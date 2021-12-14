import init, {filter_data, group_data, iso8601_to_string} from "./../../src/bin/data.js";

init();

export default class Data extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
    }

    async buildData() {
        this.data = await createData(100000);
        console.log("data loaded done");
    }

    async groupData() {
        let json = JSON.stringify(this.data);
        let fields = JSON.stringify(["site", "value"]);

        let start = performance.now();
        let result = group_data(fields, json);
        let end = performance.now();
        console.log(`group time: ${end - start} milliseconds`);
    }

    async filterData() {
        let json = JSON.stringify(this.data);

        let intent = JSON.stringify([
            { "field": "site", "operator": "==", "value": "Site 1" },
            { "field": "value", "operator": "==", "value": 1 },
        ]);

        let start = performance.now();
        let result = filter_data(intent, json);
        let end = performance.now();

        console.log(`filter time: ${end - start} milliseconds - result: ${result.length}`);

        for (let i = 0; i < 10; i++) {
            let index = result[i];
            console.log(this.data[index]);
        }
    }

    async convertDuration() {
        console.log(iso8601_to_string("PT100H30M10S"));
    }
}

async function createData(count) {
    let result = [];
    for (let i = 0; i < count; i++) {
        let value = await crs.intent.random.integer({args: {min: 0, max: 100}});
        let site;
        if (value < 20) {
            site = "Site 1";
        }
        else if (value < 60) {
            site = "Site 2"
        }
        else {
            site = "Site 3"
        }

        result.push({
            id      : i,
            code    : `Code ${i}`,
            value   : value,
            site    : site
        })
    }
    return result;
}