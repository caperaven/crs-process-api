import "./../../src/index.js";
import {loadBinding} from "./../mockups/crsbinding.mock.js";

let log;

beforeAll(async () => {
    globalThis.console = {
        error: (msg) => log = msg
    }

    await loadBinding()
})

function createContext(count) {
    const result = {records: [], result: []};

    for (let i = 0; i < count; i++) {
        result.records.push({value: i});
    }

    return result;
}

test("LoopActions - loop through - copy item to other arrays", async () => {
    const context = createContext(5);

    const step = {
        type: "loop",
        args: {
            source: "@context.records",
            steps: {
                copy_to_array: {
                    type: "array",
                    action: "add",
                    args: {
                        target: "@context.result",
                        value: "@item"
                    }
                }
            }
        }
    }

    await globalThis.crs.process.runStep(step, context);
    expect(context.result.length).toEqual(context.records.length);
})

test("LoopActions - loop through - set item value", async () => {
    const context = createContext(5);

    const step = {
        type: "loop",
        args: {
            source: "@context.records",
            steps: {
                set_value: {
                    type: "object",
                    action: "set",
                    args: {
                        target: "@item.value",
                        value: 10
                    }
                }
            }
        }
    }

    await globalThis.crs.process.runStep(step, context);
    for (let record of context.records) {
        expect(record.value).toBe(10);
    }
})