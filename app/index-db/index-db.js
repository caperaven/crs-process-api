import "./../../src/action-systems/managers/indexdb-manager.js"

export default class IndexDbViewModel extends crsbinding.classes.ViewBase {
    #data1;
    #data2;

    async preLoad() {
        this.setProperty("index", 0);
    }

    async connect() {
        Promise.all([
            crs.call("idb", "connect", {
                "name": "test_1",
            }),

            crs.call("idb", "connect", {
                "name": "test_2",
            })
        ])
        .then(() => {
            console.log("all connected");
        })
    }

    async disconnect() {
        Promise.all([
            crs.call("idb", "disconnect", {
                "name": "test_1",
            }),

            crs.call("idb", "disconnect", {
                "name": "test_2",
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
                "name": "test_1",
                "records": this.#data1
            })
            .then(() => {
                console.log("data 1 pushed");
            })
            .catch((error) => {
                console.log(error);
            }),

            await crs.call("idb", "set", {
                "name": "test_2",
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
                "name": "test_1",
            }),

            crs.call("idb", "clear", {
                "name": "test_2",
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
            "name": "test_1",
            "indexes": [this.getProperty("index")]
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