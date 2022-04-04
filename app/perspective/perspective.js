import "./../../src/action-systems/data-actions.js";
import {createData} from "./../data-factory.js";

export default class Perspective extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
    }

    preLoad() {
        this.setProperty("doFilter", true);
        this.setProperty("doSort", true);
        this.setProperty("doGroup", true);
        this.setProperty("doAggregates", false);
        createData(10).then(result => this.data = result);
    }

    async build_perspective(event) {
        const doFilter = this.getProperty("doFilter");
        const doSort = this.getProperty("doSort");
        const doGroup = this.getProperty("doGroup");
        const doAggregates = this.getProperty("doAggregates");

        const perspective = {};

        if (doFilter == true) {
            perspective.filter = [
                { "field": "number", "operator": "gt", "value": 5 }
            ];
        }

        if (doSort == true) {
            perspective.sort = [
                { "name": "site", "direction": "asc" }
            ];
        }

        if (doGroup == true) {
            perspective.group = ["externalCode"];
        }

        if (doAggregates == true) {
            perspective.aggregates = {
                "min": "number",
                "max": "number",
                "ave": "number",
                "count": "number"
            }
        }

        const data = JSON.stringify(this.data);

        let result = await crs.call("data", "perspective", {source: data, perspective: perspective});

        let json = JSON.parse(result);
        this.setProperty("jsonstr", JSON.stringify(json, null, 4));
    }
}