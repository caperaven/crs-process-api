import {schema} from "./app/loop-example.js";

export default class IndexViewModel extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        crs.processSchemaRegistry.add(schema);
        await super.connectedCallback();
        console.log(crs.processSchemaRegistry);
    }

    preLoad() {
        this.data = [];
        for (let i = 0; i < 20; i++) {
            this.data.push({
                id: i,
                value: `Item ${i}`
            })
        }
    }

    performProcess() {
        crsbinding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "main",
                args: {
                    schema: "loop-example"
                }
            }
        })
    }
}