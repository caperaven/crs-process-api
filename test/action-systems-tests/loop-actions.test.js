import {loadBinding} from "./../mockups/crsbinding.mock.js";

beforeAll(async () => {
    await loadBinding();
    await import("./../../src/index.js");
})

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
            source: "$context.records",
            steps: {
                copy_to_array: {
                    type: "array",
                    action: "add",
                    args: {
                        target: "$context.result",
                        value: "$item"
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
            source: "$context.records",
            steps: {
                set_value: {
                    type: "object",
                    action: "set",
                    args: {
                        target: "$item.value",
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

test("LoopActions - uppercase item value", async () => {
    const context = {
        records: [{code: "a"}, {code: "b"}, {code: "c"}]
    }

    const step = {
        type: "loop",
        args: {
            source: "$context.records",
            steps: {
                set_value: {
                    type: "object",
                    action: "set",
                    args: {
                        target: "$item.code",
                        value: "$item.code.toUpperCase()"
                    }
                }
            }
        }
    }

    await globalThis.crs.process.runStep(step, context);
    expect(context.records[0].code).toEqual("A");
    expect(context.records[1].code).toEqual("B");
    expect(context.records[2].code).toEqual("C");
})

test("LoopActions - set target as reference", async () => {
    const context = {
        records: [{value: 1}, {value: 2}, {value: 3}],
        result: [],
        current: {value: 1}
    }

    const step = {
        type: "loop",
        args: {
            source: "$context.records",
            target: "$context.current",
            steps: {
                copy: {
                    type: "array",
                    action: "add",
                    args: {
                        target: "$context.result",
                        value: "$context.current.value"
                    }
                }
            }
        }
    };

    await globalThis.crs.process.runStep(step, context);
    expect(context.result.length).toEqual(3);
    expect(context.result[0]).toEqual(1);
    expect(context.result[1]).toEqual(2);
    expect(context.result[2]).toEqual(3);
})