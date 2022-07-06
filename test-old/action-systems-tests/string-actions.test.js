import {loadBinding} from "./../mockups/crsbinding.mock.js";

beforeAll(async () => {
    await loadBinding();
    await import("./../../src/index.js");
})

test ("inflate string format", async () => {
    let context = {
        typeId: 1001
    }

    const step = {
        type: "string",
        action: "inflate",
        args: {
            template: "#input/${id}?type='tasks'&typeId='${typeId}'",
            parameters: {
                id: 100,
                typeId: "$context.typeId"
            },
            target: "$context.result"
        }
    }

    await globalThis.crs.process.runStep(step, context, null, null);

    expect(context.result).toEqual("#input/100?type='tasks'&typeId='1001'");
})

test ("inflate standard string", async () => {
    let result = await globalThis.crs.intent.string.inflate({args: {template: "www.test.com"}});
    expect(result).toEqual("www.test.com")
})

test("string to_array", async () => {
    let context = {
        value: "Hello There World"
    }

    const step = {
        type: "string",
        action: "to_array",
        args: {
            source: "$context.value",
            pattern: " ",
            target: "$context.result"
        }
    }

    await globalThis.crs.process.runStep(step, context, null, null);

    expect(context.result.length).toEqual(3);
    expect(context.result[0]).toEqual("Hello");
    expect(context.result[1]).toEqual("There");
    expect(context.result[2]).toEqual("World");
})

test("string from_array", async () => {
    let context = {
        value: ["Hello", "There", "Array"]
    }

    const step = {
        type: "string",
        action: "from_array",
        args: {
            source: "$context.value",
            separator: " ",
            target: "$context.result"
        }
    }

    await globalThis.crs.process.runStep(step, context, null, null);

    expect(context.result).toEqual("Hello There Array");
})

test("string replace pattern", async () => {
    const context = {
        expr: "@property = value"
    }

    const step = {
        type: "string",
        action: "replace",
        args: {
            source: "$context.expr",
            pattern: "@",
            value: "schema.variables.",
            target: "$context.expr"
        }
    }

    await globalThis.crs.process.runStep(step, context, null, null);

    expect(context.expr).toEqual("schema.variables.property = value");

})