import {loadBinding} from "./../mockups/crsbinding.mock.js";

let log = null;

beforeAll(async () => {
    globalThis.console = {
        error: (msg) => log = msg
    }

    await loadBinding();
    await import("./../../src/index.js");
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

test("ArrayActions - add - context to array", async () => {
    const step = { type: "array", action: "add", args: {target: "@process.data.collection", value: "@item"}};
    const process = {data: {collection: []}};
    const item = "Hello World";
    await globalThis.crs.intent.array.perform(step, null, process, item);
    expect(process.data.collection.length).toEqual(1);
    expect(process.data.collection[0]).toEqual("Hello World");
});

test("ArrayActions - fieldToCSV", async () => {
    const context = {
        values: [{value: 1}, {value: 2}, {value: 3}]
    };

    await globalThis.crs.intent.array.perform({action: "field_to_svg", args: {source: "@context.values", target: "@context.result", delimiter: ";", field: "value"}}, context);
    expect(context.result).not.toBeUndefined();
    expect(context.result).toEqual("1;2;3");
})