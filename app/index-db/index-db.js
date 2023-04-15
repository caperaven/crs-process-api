import "./../../src/action-systems/managers/indexdb-manager.js"

export default class IndexDbViewModel extends crsbinding.classes.ViewBase {
    #data1;
    #data2;

    async preLoad() {
        this.setProperty("index", 0);
        this.setProperty("batchStart", 10);
        this.setProperty("batchSize", 10);
        this.setProperty("page", 1);
        this.setProperty("pageSize", 10);
    }

    async connect() {
        Promise.all([
            crs.call("idb", "create", {
                "name": "test_database",
                "version": 1,
                "storeNames": ["test_1", "test_2"]
            })
        ])
        .then(() => {
            console.log("all connected");
        })
    }

    async disconnect() {
        Promise.all([
            crs.call("idb", "disconnect", {
                "name": "test_database",
            }),

            crs.call("idb", "disconnect", {
                "name": "test_database",
            })
        ])
        .then(() => {
            console.log("all disconnected");
        })
    }

    async generateData() {
        this.#data1 = await generateData(1000);
        this.#data2 = await generateData(10);

        console.log("data generated");
        alert("data generated");
    }

    async pushData() {
        const start = performance.now();

        await Promise.all([
            crs.call("idb", "set", {
                "name": "test_database",
                "store": "test_1",
                "records": this.#data1,
                "clear": true
            })
            .then(() => {
                console.log("data 1 pushed");
            })
            .catch((error) => {
                console.log(error);
            }),

            await crs.call("idb", "set", {
                "name": "test_database",
                "store": "test_2",
                "records": this.#data2
            })
            .then(() => {
                console.log("data 2 pushed");
            })
            .catch((error) => {
                console.log(error);
            })
        ])

        const end = performance.now();
        console.log("pushed in " + (end - start) + " ms");
    }

    async clearData() {
        Promise.all([
            crs.call("idb", "clear", {
                "name": "test_database",
                "store": "test_1"
            }),

            crs.call("idb", "clear", {
                "name": "test_database",
                "store": "test_2"
            })
        ])
        .then(() => {
            console.log("all cleared");
        })
        .catch((error) => {
            console.log(error);
        })
    }

    async fetch() {
        const result = await crs.call("idb", "get", {
            "name": "test_database",
            "store": "test_1",
            "indexes": Number(this.getProperty("index"))
        })

        this.setProperty("model", result.data);

        const indexItems = await crs.call("idb", "get", {
            "name": "test_database",
            "store": "test_1",
            "indexes": [0, 2, 4, 6, 8, 10]
        })

        console.log("fetching items based on index:", indexItems);
    }

    async fetchBatch() {
        const result = await crs.call("idb", "get_batch", {
            "name": "test_database",
            "store": "test_1",
            "startIndex": Number(this.getProperty("batchStart")),
            "count": Number(this.getProperty("batchSize"))
        });

        console.log(result);
    }

    async fetchAll() {
        const result = await crs.call("idb", "get_all", {
            "name": "test_database",
            "store": "test_1",
        })

        console.log(result);
    }

    async fetchPage() {
        const result = await crs.call("idb", "get_page", {
            "name": "test_database",
            "store": "test_1",
            "pageSize": Number(this.getProperty("pageSize")),
            "page": Number(this.getProperty("page"))
        })

        console.log(result);
    }

    async deleteOlderThan() {
        const result = await crs.call("idb", "delete_older_than", {
            "name": "test_database",
            "store": "test_1",
            "date": "2020-01-01"
        })

        console.log(result);
    }
}

async function generateData(count) {
    return await crs.call("random", "generate_collection", {
        definition: {
            id: "auto",
            code: "string:auto",
            description: "string:10",
            price: "float:1:100",
            quantity: "integer:1:100",
            date: "date:2020-01-01:2020-12-31",
            time: "time:0:24",
            duration: "duration:1:10",
            isValid: "boolean",
        },
        count: count
    })
}