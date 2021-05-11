import "./../../src/index.js";
import {getValueOnPath} from "./../mockups/binding-mocks.js";

let log = null;

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

test("ArrayActions - add - on context path", async () => {
    const context = {
        values: []
    }

    await globalThis.crs.intent.array.perform({action: "add", args: {target: "@context.values", value: "Hello World"}}, context);
    expect(context.values.length).toEqual(1);
    expect(context.values[0]).toEqual("Hello World");
})