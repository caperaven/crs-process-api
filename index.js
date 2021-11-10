import {schema as loopSchema} from "./app/loop-example.js";
import {schema as domExample} from "./app/dom-example.js";
import {schema as migrateSchema} from "./app/data-migrate-example.js";
import {process} from "/test/scenario-tests/flatten-process.js";
import {createData} from "/test/scenario-tests/flatten-data.js";

export default class IndexViewModel extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        crs.processSchemaRegistry.add(loopSchema);
        crs.processSchemaRegistry.add(domExample);
        crs.processSchemaRegistry.add(migrateSchema);
        crs.processSchemaRegistry.onError = (error) => {
            console.error(error);
        }
    }

    preLoad() {
        this.data = [];
        for (let i = 0; i < 20; i++) {
            this.data.push({
                id: i,
                value: `Item ${i}`
            })
        }

        this.context = {
            steps: createData(1, 100000)
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
        console.log("start big batch");
        const t0 = performance.now();
        let result = await crs.process.run(this.context, process);
        const t1 = performance.now();

        console.log(`${t1 - t0} milliseconds.`);
        result = null;
    }

    async performMigrateProcess() {
        await crsbinding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "main",
                args: {
                    schema: "data-migrate-process-schema"
                }
            },
            parameters: {
                taskId  : "ABC",
                assetId : "Asset 100"
            }
        });
    }
}