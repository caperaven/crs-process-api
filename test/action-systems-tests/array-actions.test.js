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

    await globalThis.crs.intent.array.perform({action: "add", args: {target: "$context.values", value: "Hello World"}}, context);
    expect(context.values.length).toEqual(1);
    expect(context.values[0]).toEqual("Hello World");
})

test("ArrayActions - add - context to array", async () => {
    const step = { type: "array", action: "add", args: {target: "$process.data.collection", value: "$item"}};
    const process = {functions: {}, data: {collection: []}};
    const item = "Hello World";
    await globalThis.crs.intent.array.perform(step, null, process, item);
    expect(process.data.collection.length).toEqual(1);
    expect(process.data.collection[0]).toEqual("Hello World");
});

test("ArrayActions - field to CSV", async () => {
    const context = {
        values: [{value: 1}, {value: 2}, {value: 3}]
    };

    await globalThis.crs.intent.array.perform({action: "field_to_csv", args: {source: "$context.values", target: "$context.result", delimiter: ";", field: "value"}}, context);
    expect(context.result).not.toBeUndefined();
    expect(context.result).toEqual("1;2;3");
})

test("ArrayActions - fields to CSV", async () => {
    const context = {
        values: [
            { code: "code1", value: "value1" },
            { code: "code2", value: "value2" }
        ]
    }

    await globalThis.crs.intent.array.perform({
        action: "field_to_csv",
        args: {
            source: "$context.values",
            fields: ["code", "value"],
            target: "$context.result",
            delimiter: ";"
        }
    }, context, null, null);

    expect(context.result).not.toBeUndefined();
    expect(context.result.length).toEqual(2);
    expect(context.result[0]).toEqual("code1;value1");
    expect(context.result[1]).toEqual("code2;value2");
})

test("ArrayActions - concat", async () => {
    const context = {
        collection1: [1, 2, 3],
        collection2: [4, 5, 6]
    }

    const step = {
        action: "concat",
        args: {
            sources: ["$context.collection1", "$context.collection2"],
            target: "$context.result"
        }
    }

    await globalThis.crs.intent.array.perform(step, context, null, null);

    expect(context.result.length).toEqual(6);
    expect(context.result[0]).toEqual(1);
    expect(context.result[5]).toEqual(6);
})

test("ArrayActions - change_values", async () => {
    const context = {
        values: [{value: 1}, {value: 2}, {value: 3}],
        value: 10
    };

    const step = {
        action: "change_values",
        args: {
            source: "$context.values",
            changes: {
                "value": "$context.value",
                "site": "Site 1"
            }
        }
    }

    await globalThis.crs.intent.array.perform(step, context, null, null);

    expect(context.values[0].value).toEqual(10);
    expect(context.values[0].site).toEqual("Site 1");
    expect(context.values[1].value).toEqual(10);
    expect(context.values[1].site).toEqual("Site 1");
    expect(context.values[2].value).toEqual(10);
    expect(context.values[2].site).toEqual("Site 1");
})