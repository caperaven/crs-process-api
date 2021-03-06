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

beforeEach(() => {
    logs.log = null;
})

test("ConditionActions - condition on context - pass step executed", async () => {
    await crs.intent.condition.perform({args: {condition: "$context.isValid == true"}, pass_step: {type: "console", action: "log", args: {message: "pass"}}}, {isValid: true})
    expect(logs.log).toEqual("pass");
})

test("ConditionActions - condition on context - fail", async () => {
    await crs.intent.condition.perform({args: {condition: "$context.isValid == true"}, fail_step: {type: "console", action: "log", args: {message: "fail"}}}, {isValid: false})
    expect(logs.log).toEqual("fail");
})

test("ConditionActions - condition on process - pass step executed", async () => {
    await crs.intent.condition.perform({args: {condition: "$process.isValid == true"}, pass_step: {type: "console", action: "log", args: {message: "pass"}}}, null, {isValid: true});
    expect(logs.log).toEqual("pass");
})

test("ConditionActions - condition on process - fail", async () => {
    await crs.intent.condition.perform({args: {condition: "$process.isValid == true"}, fail_step: {type: "console", action: "log", args: {message: "fail"}}}, null, {isValid: false})
    expect(logs.log).toEqual("fail");
})

test("ConditionActions - condition on item - pass step executed", async () => {
    await crs.intent.condition.perform({args: {condition: "$item.isValid == true"}, pass_step: {type: "console", action: "log", args: {message: "pass"}}}, null, null, {isValid: true})
    expect(logs.log).toEqual("pass");
})

test("ConditionActions - condition on item - fail", async () => {
    await crs.intent.condition.perform({args: {condition: "$item.isValid == true"}, fail_step: {type: "console", action: "log", args: {message: "fail"}}}, null, null, {isValid: false})
    expect(logs.log).toEqual("fail");
})

test("ConditionActions - pass_step string", async () => {
    const process = {
        steps: {
            log_success: {
                type: "console",
                action: "log",
                args: {
                    message: "pass"
                }
            }
        }
    }

    await crs.intent.condition.perform({args: {condition: "$context.isValid == true"}, pass_step: "log_success"}, {isValid: true}, process)
    expect(logs.log).toEqual("pass");
})

test("ConditionActions - fail_step string", async () => {
    const process = {
        steps: {
            log_failure: {
                type: "console",
                action: "log",
                args: {
                    message: "fail"
                }
            }
        }
    }

    await crs.intent.condition.perform({args: {condition: "$context.isValid == true"}, fail_step: "log_failure"}, {isValid: false}, process)
    expect(logs.log).toEqual("fail");
})

test ("ConditionActions - binding expression", async () => {
    const bId = crsbinding.data.addObject("test");
    crsbinding.data.setProperty(bId, "value", 100);

    const process = {
        parameters: {
            bId: bId
        }
    }

    const success = await crs.intent.condition.perform({args: {condition: "$binding.value == 100"}}, null, process);
    expect(success).toBeTruthy();
    crsbinding.data.removeObject(bId);
})
