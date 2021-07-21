import {loadBinding} from "./../mockups/crsbinding.mock.js";

beforeAll(async () => {
    await loadBinding();
    await import("./../../src/index.js");
})

test("ObjectActions - set - context", async () => {
    const context = {};
    const descriptor = await SetDescriptor.new("$context.value", 1);
    await globalThis.crs.process.runStep(descriptor, context);
    expect(context.value).toEqual(1);
})

test("ObjectActions - set - process", async () => {
    const process = {data: {}};
    const descriptor = await SetDescriptor.new("$process.data.value", 1);
    await globalThis.crs.process.runStep(descriptor, null, process);
    expect(process.data.value).toEqual(1);
})

test("ObjectActions - set - item", async () => {
    const item = {};
    const descriptor = await SetDescriptor.new("$item.value", 1);
    await globalThis.crs.process.runStep(descriptor, null, null, item);
    expect(item.value).toEqual(1);
})

test("ObjectActions - set - with functions", async () => {
    const context = {src: "hello world"};
    const descriptor = await SetDescriptor.new("$context.value", "$context.src.toUpperCase()");
    await globalThis.crs.process.runStep(descriptor, context);
    expect(context.value).toEqual("HELLO WORLD");
})

test("ObjectActions - get", async () => {
    const context = {source: "hello world"};

    const step = {
        type: "object",
        action: "get",
        args: {
            source: "$context.source",
            target: "$context.result"
        }
    }

    await globalThis.crs.process.runStep(step, context);
    expect(context.result).toEqual(context.source);
})

test("ObjectActions - clone, no fields", async () => {
    const context = {
        source: {id: 0, code: "A", value: 10}
    }

    const step = {
        type: "object",
        action: "clone",
        args: {
            source: "$context.source",
            target: "$context.result"
        }
    }

    await globalThis.crs.process.runStep(step, context);
    expect(context.result).not.toBeUndefined();
    expect(context.result.id).toEqual(0);
    expect(context.result.code).toEqual("A");
    expect(context.result.value).toEqual(10);
})

test("ObjectActions - clone, with fields", async () => {
    const context = {
        source: {id: 0, code: "A", value: 10}
    }

    const step = {
        type: "object",
        action: "clone",
        args: {
            source: "$context.source",
            target: "$context.result",
            fields: ["code"]
        }
    }

    await globalThis.crs.process.runStep(step, context);
    expect(context.result).not.toBeUndefined();
    expect(context.result.code).toEqual("A");
    expect(context.result.id).toBeUndefined();
    expect(context.result.value).toBeUndefined();
})

test("ObjectActions - assign", async () => {
    const context = {
        source: {id: 0, code: "A", value: 10},
        result: {}
    }

    const step = {
        type: "object",
        action: "assign",
        args: {
            source: "$context.source",
            target: "$context.result",
        }
    };

    await globalThis.crs.process.runStep(step, context);
    expect(context.result).not.toBeUndefined();
    expect(context.result.id).toEqual(0);
    expect(context.result.code).toEqual("A");
    expect(context.result.value).toEqual(10);
})

test("ObjectActions - create", async () => {
    const context = {};

    const step = {
        type: "object",
        action: "create",
        args: {
            target: "$context.result",
        }
    };

    await globalThis.crs.process.runStep(step, context);
    expect(context.result).not.toBeUndefined();
})

class SetDescriptor {
    static async new(target, value) {
        return {
            type: "object",
            action: "set",
            args: {
                target: target,
                value: value
            }
        }
    }
}