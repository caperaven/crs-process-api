import "./../../src/action-systems/managers/indexdb-manager.js"

export default class IndexDbViewModel extends crsbinding.classes.ViewBase {
    #data1;
    #data2;

    async connect() {
        await crs.call("idb", "connect", {
            "name": "test_1",
        })
    }

    async disconnect() {
        await crs.call("idb", "disconnect", {
            "name": "test_1",
        })
    }

    async GenerateData() {
        this.#data1 = await generateData(100);
        this.#data2 = await generateData(100);
        alert("done");
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