import "./../../src/index.js";

const logs = {
    log: null,
    warn: null,
    error: null,
    table: null
}

beforeAll(() => {
    global.console = {
        log: (msg) => logs.log = msg,
        warn: (msg) => logs.warn = msg,
        error: (msg) => logs.error = msg,
        table: (msg) => logs.table = msg
    }
})

test("ConditionActions - log", async () => {
    logs.log = null;
    await globalThis.crs.intent.console.perform({action: "log", args: {message: "log-message"}});
    expect(logs.log).toEqual("log-message");
})

test("ConditionActions - log - messages", async () => {
    logs.log = null;
    await globalThis.crs.intent.console.perform({action: "log", args: {messages: ["log-message"]}});
    expect(logs.log).toEqual("log-message");
})

test("ConditionActions - warn", async () => {
    logs.log = null;
    await globalThis.crs.intent.console.perform({action: "warn", args: {message: "warn-message"}});
    expect(logs.warn).toEqual("warn-message");
})

test("ConditionActions - error", async () => {
    logs.log = null;
    await globalThis.crs.intent.console.perform({action: "error", args: {message: "error-message"}});
    expect(logs.error).toEqual("error-message");
})

test("ConditionActions - table", async () => {
    logs.log = null;
    await globalThis.crs.intent.console.perform({action: "table", args: {message: "table-message"}});
    expect(logs.table).toEqual("table-message");
})