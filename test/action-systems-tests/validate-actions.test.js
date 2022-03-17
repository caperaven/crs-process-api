import {loadBinding} from "./../mockups/crsbinding.mock.js";

const logs = {
    log: null
}

beforeAll(async () => {
    global.console = {
        log: (msg) => logs.log = msg
    }

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

    const result = await crs.call("validate", "assert_step", {
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

    const result = await crs.call("validate", "assert_step", {
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

test("ValidateActions - required - true", async () => {
    const obj = {
        "value": 10,
        "person": {
            "name": "John"
        }
    }

    const result = await crs.call("validate", "required", {
        source  : obj,
        paths   : ["value", "person/name"]
    })

    expect(result).toEqual(true);
})

test("ValidateActions - required - false", async () => {
    const result = await crs.call("validate", "required", {
        source  : {},
        paths   : ["value", "person/name"]
    })

    expect(result).toEqual(false);
})

test("ValidateActions - required - next step", async () => {
    const process = {
        data: {
            person: {
                firstName: "John"
            }
        },
        steps: {
            start: {
                type: "validate",
                action: "required",
                args: {
                    source: "$data",
                    paths: ["person/firstName"]
                },
                pass_step: "pass_step",
                fail_step: "fail_step"
            },
            pass_step: {
                type: "console",
                action: "log",
                args: {message: "pass"}
            },
            fail_step: {
                type: "console",
                action: "log",
                args: {message: "fail"}
            }
        }
    }

    await crs.process.run(null, process);
    expect(logs.log).toEqual("pass");

    delete process.data.person.firstName;
    await crs.process.run(null, process);
    expect(logs.log).toEqual("fail");
})
