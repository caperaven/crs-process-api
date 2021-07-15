import {schema as loopSchema} from "./app/loop-example.js";
import {schema as domExample} from "./app/dom-example.js";
import {process} from "/test/scenario-tests/flatten-process.js";
import {createData} from "/test/scenario-tests/flatten-data.js";

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

    async performFlattenProcess() {
        let context = {
            steps: createData(1, 1000)
        }

        const t0 = performance.now();
        const result = await crs.process.run(context, process);
        const t1 = performance.now();

        delete context.steps;
        context = null;

        console.log(`${t1 - t0} milliseconds.`);
        console.log(result);
    }
}