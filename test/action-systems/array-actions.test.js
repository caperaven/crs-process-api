import "./../../src/index.js";

let log = null;

beforeAll(() => {
    globalThis.console = {
        error: (msg) => log = msg
    }
})

test("ArrayActions - add - directly to array", async () => {
    const values = [];
    await globalThis.crs.intent.array.perform({action: "add", args: {target: values, value: "Hello World"}});
    expect(values.length).toEqual(1);
    expect(values[0]).toEqual("Hello World");
})

test("ArrayActions - add - no array - show error", async () => {
    log = null;
    const values = null;
    await globalThis.crs.intent.array.perform({action: "add", args: {target: values, value: "Hello World"}});
    expect(log).not.toBeNull();
})