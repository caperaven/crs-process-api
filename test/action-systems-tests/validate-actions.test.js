import {loadBinding} from "./../mockups/crsbinding.mock.js";

beforeAll(async () => {
    await loadBinding();
    await import("./../../src/index.js");
})

test("ValidateActions - validate - true", async () => {
    const schema = {
        id: "test_schema",
        process1: {
            steps: {
                start: {
                    type: "array",
                    action: "add",
                    args: {
                        target: [],
                        value: 10
                    }
                }
            }
        }
    }

    const result = await crs.call("validate", "assert", {
        source  : schema,
        process : "process1",
        step    : "start",
        required: {
            target : '"target" must have a value',
            value  : '"value" must have a value'
        }
    })

    expect(result.passed).toBeTruthy();
})

test("ValidateActions - validate - false", async () => {
    const schema = {
        id: "test_schema",
        process1: {
            steps: {
                start: {
                    type: "array",
                    action: "add",
                    args: {
                    }
                }
            }
        }
    }

    const result = await crs.call("validate", "assert", {
        source  : schema,
        process : "process1",
        step    : "start",
        required: {
            target : '"target" must have a value',
            value  : '"value" must have a value'
        }
    })

    expect(result.passed).toBeFalsy();
    expect(result.process).toEqual("process1");
    expect(result.step).toEqual("start");
    expect(result.messages.length).toEqual(2);
    expect(result.messages[0]).toEqual('"target" must have a value');
    expect(result.messages[1]).toEqual('"value" must have a value');
})