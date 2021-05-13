import "./../../src/index.js";
import {getValueOnPath} from "../mockups/binding-mocks.js";

let log;

beforeAll(() => {
    globalThis.console = {
        error: (msg) => log = msg
    }

    globalThis.crsbinding = {
        utils: {
            getValueOnPath: getValueOnPath
        }
    }
})

test("LoopActions - loop through", async () => {
    const context = {
        records: [
            {
                value: 1
            },
            {
                value: 2
            },
            {
                value: 3
            },
            {
                value: 4
            }
        ],
        result: []
    }

    const step = {
        type: "loop",
        args: {
            source: "@context.records",
            start: "copy_to_array",
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

    await globalThis.crs.intent.loop.perform(step, context);
    expect(context.result.length).toEqual(context.records.length);
})