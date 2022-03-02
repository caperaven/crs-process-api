import {loadBinding} from "../mockups/crsbinding.mock.js";

beforeAll(async () => {
    await loadBinding();
    await import("./../../src/index.js");
})

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

test("ConsoleActions - log", async () => {
    logs.log = null;
    await globalThis.crs.intent.console.perform({action: "log", args: {message: "log-message"}});
    expect(logs.log).toEqual("log-message");
})

test("ConsoleActions - log - messages", async () => {
    logs.log = null;
    await globalThis.crs.intent.console.perform({action: "log", args: {messages: ["log-message"]}});
    expect(logs.log).toEqual("log-message");
})

test("ConsoleActions - warn", async () => {
    logs.log = null;
    await globalThis.crs.intent.console.perform({action: "warn", args: {message: "warn-message"}});
    expect(logs.warn).toEqual("warn-message");
})

test("ConsoleActions - error", async () => {
    logs.log = null;
    await globalThis.crs.intent.console.perform({action: "error", args: {message: "error-message"}});
    expect(logs.error).toEqual("error-message");
})

test("ConsoleActions - table", async () => {
    logs.log = null;
    await globalThis.crs.intent.console.perform({action: "table", args: {message: "table-message"}});
    expect(logs.table).toEqual("table-message");
})

test("ConsoleActions - log - text", async () => {
   logs.log = null;
   const process = {
       steps: {
           start: {
               type: "console",
               action: "log",
               args: {
                   message: "$text.message"
               }
           }
       }
   }

    await crs.process.run(null, process, null, {message: "Hello World"});
   expect(logs.log).toEqual("Hello World");
});