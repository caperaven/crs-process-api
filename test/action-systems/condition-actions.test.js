import "./../../src/index.js";

const logs = {
    log: null
}

beforeAll(() => {
    global.console = {
        log: (msg) => logs.log = msg
    }

    global.crsbinding = {
        expression: {
            compile: (exp) => {
                exp = exp.replace("@context", "context").replace("@process", "context").replace("@item", "context");
                return {
                    function: new Function("context", `return ${exp};`)
                };
            }
        }
    };

})

beforeEach(() => {
    logs.log = null;
})

test("ConditionActions - condition on context - pass step executed", async () => {
    await crs.intent.condition.perform({args: {condition: "@context.isValid == true", pass_step: {type: "console", action: "log", args: {message: "pass"}}}}, {isValid: true})
    expect(logs.log).toEqual("pass");
})

test("ConditionActions - condition on context - fail", async () => {
    await crs.intent.condition.perform({args: {condition: "@context.isValid == true", fail_step: {type: "console", action: "log", args: {message: "fail"}}}}, {isValid: false})
    expect(logs.log).toEqual("fail");
})

test("ConditionActions - condition on process - pass step executed", async () => {
    await crs.intent.condition.perform({args: {condition: "@process.isValid == true", pass_step: {type: "console", action: "log", args: {message: "pass"}}}}, null, {isValid: true});
    expect(logs.log).toEqual("pass");
})

test("ConditionActions - condition on process - fail", async () => {
    await crs.intent.condition.perform({args: {condition: "@process.isValid == true", fail_step: {type: "console", action: "log", args: {message: "fail"}}}}, null, {isValid: false})
    expect(logs.log).toEqual("fail");
})

test("ConditionActions - condition on item - pass step executed", async () => {
    await crs.intent.condition.perform({args: {condition: "@item.isValid == true", pass_step: {type: "console", action: "log", args: {message: "pass"}}}}, null, null, {isValid: true})
    expect(logs.log).toEqual("pass");
})

test("ConditionActions - condition on item - fail", async () => {
    await crs.intent.condition.perform({args: {condition: "@item.isValid == true", fail_step: {type: "console", action: "log", args: {message: "fail"}}}}, null, null, {isValid: false})
    expect(logs.log).toEqual("fail");
})


