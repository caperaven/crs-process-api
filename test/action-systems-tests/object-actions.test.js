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

test("ObjectActrions - delete", async() => {
    const context = {
        p1: "hello",
        p2: "world",
        p3: "value"
    }

    const step = {
        type: "object",
        action: "delete",
        args: {
            target: "$context",
            properties: ["p1", "p2"]
        }
    }

    await globalThis.crs.process.runStep(step, context, null, null);

    expect(context.p1).toBeUndefined();
    expect(context.p2).toBeUndefined();
    expect(context.p3).not.toBeUndefined();
})

test("ObjectActions - set - multiple", async () => {
    const context = {
        origin: "origin value"
    };

    const step = {
        type: "object",
        action: "set",
        args: {
            target: "$context",
            properties: {
                p1: "property 1",
                p2: "$context.origin"
            }
        }
    }

    await globalThis.crs.process.runStep(step, context, null, null);
    expect(context.p1).toEqual("property 1");
    expect(context.p2).toEqual("origin value");
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

test("ObjectActions - setPath - single", async () => {
    let obj = {};
    await crs.call("object", "set_on_path", {
        path: "value1",
        target: obj,
        value: "Test"
    })
    expect(obj["value1"]).toEqual("Test");

    obj = {};
    await crs.call("object", "set_on_path", {
        path: "subobject/value",
        target: obj,
        value: "Test"
    })
    expect(obj["subobject"]["value"]).toEqual("Test");

    obj = {};
    await crs.call("object", "set_on_path", {
        path: "subobject/values/0/name",
        target: obj,
        value: "Test"
    })
    expect(obj["subobject"]["values"][0]["name"]).toEqual("Test");
})

test("ObjectActions - setPath - multiple", async () => {
    let obj = {};

    await crs.call("object", "set_on_path", { paths: [
        { path: "subObj/value", target: obj, value: "Test" },
        { path: "subObj2/value", target: obj, value: "Test2" }
    ]})

    expect(obj["subObj"]["value"]).toEqual("Test");
    expect(obj["subObj2"]["value"]).toEqual("Test2");
})

test("ObjectActions - getPath - single", async () => {
    const obj = {
        subobj: {
            value1: "test",
            collection: [{name: "test name"}]
        }
    }

    let result;
    result = await crs.call("object", "get_on_path", { path: "subobj/value1", source: obj });
    expect(result).toEqual("test");

    result = await crs.call("object", "get_on_path", { path: "subobj/collection/0/name", source: obj });
    expect(result).toEqual("test name");

    result = await crs.call("object", "get_on_path", { path: "subobj2/name", source: obj });
    expect(result).toEqual(null);

    result = await crs.call("object", "get_on_path", { path: "subobj2/names/0/value", source: obj });
    expect(result).toEqual(null);
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