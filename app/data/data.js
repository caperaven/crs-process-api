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
        let json = JSON.stringify(Object.assign([], this.data));
        let fields = JSON.stringify(["site", "value"]);
        let result = group_data(fields, json);
        console.log(result);
        // alert("done");
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