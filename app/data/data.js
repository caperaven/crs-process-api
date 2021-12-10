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
        let result = group_data(fields, json);
        console.log(result);
        // alert("done");
    }

    async filterData() {
        let json = JSON.stringify(this.data);
        let intent = JSON.stringify([{ "field": "site", "operator": "==", "value": "Site 1" }]);
        let result = filter_data(intent, json);
        console.log(result);

        for (let i = 0; i < 10; i++) {
            let index = result[i];
            console.log(this.data[index]);
        }
    }

    async convertDuration() {
        console.log(iso8601_to_string("PT100H30M"));
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