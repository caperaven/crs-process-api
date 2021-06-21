import {schema as loopSchema} from "./app/loop-example.js";
import {schema as domExample} from "./app/dom-example.js";

export default class IndexViewModel extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        crs.processSchemaRegistry.add(loopSchema);
        crs.processSchemaRegistry.add(domExample);
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

    async performProcess() {
        performance.mark("start");

        await crsbinding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "main",
                args: {
                    schema: "loop-example"
                }
            }
        });

        performance.mark("end");
        performance.measure("performance", "start", "end");

        const measure = performance.getEntriesByName("performance");

        console.log(`performance: ${measure[0].duration}`);
        performance.clearMarks();
        performance.clearMeasures();
    }

    async performUIProcess() {
        await crsbinding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "main",
                args: {
                    schema: "dom-example"
                }
            }
        });
    }
}