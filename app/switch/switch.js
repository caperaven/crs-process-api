import {schema} from "./schema.js";

export default class SwitchViewModel extends crsbinding.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return false;
    }

    async connectedCallback() {
        await super.connectedCallback();
    }

    async perform(value) {
        const process = structuredClone(schema.main);
        process.parameters = {
            entityName: value
        };

        const context = {};

        await crs.process.run(context, process);
    }
}