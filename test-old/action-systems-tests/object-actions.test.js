import {loadBinding} from "./../mockups/crsbinding.mock.js";

beforeAll(async () => {
    await loadBinding();
    await import("./../../src/index.js");
})

test("ObjectActions - set values", async() => {
    const context = {};
    const item = {
        value: "item world"
    }

    await crs.call("object", "set", {
        properties: {
            "$context/value": "Hello World",
            "subobj/value": "Sub Hello",
            "itemValue": "$item.value.toUpperCase()"
        }
    }, context, null, item)

    expect(context.value).toEqual("Hello World")
    expect(context.subobj.value).toEqual("Sub Hello");
    expect(context.itemValue).toEqual("ITEM WORLD");
})


test ("ObjectActions - get values", async() => {
    const context = {
        value: "Hello World",
        subObj: {
            value: "Sub Hello"
        }
    };

    const results = await crs.call("object", "get", {
        properties: [
            "value",
            "$context/value",
            "subobj?/value",
            "subObj/value"
        ]
    }, context)

    expect(results[0]).toEqual("Hello World");
    expect(results[1]).toEqual("Hello World");
    expect(results[2]).toEqual(undefined);
    expect(results[3]).toEqual("Sub Hello");
})

test ("ObjectActions - delete", async() => {
    const context = {
        value: "Hello World",
        subObj: {
            value: "Sub Hello"
        }
    };

    await crs.call("object", "delete", {
        properties: [
            "value",
            "subObj/value"
        ]
    }, context)

    expect(context.value).toBeUndefined();
    expect(context.subObj?.value).toBeUndefined();
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
            properties: ["code"]
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


test("ObjectActions - copy_on_path - multiple", async () => {
    const obj = {
        subobj: {
            value1: "test",
            collection: [{name: "test name"}]
        }
    }

    const obj2 = {};

    await crs.call("object", "copy_on_path", {
        source: obj,
        target: obj2,
        properties: ["subobj/value1"]
    })

    expect(obj2["subobj"]["value"]).toEqual(obj["subobj"]["value"]);
})

test("ObjectActions - assert - multiple", async () => {
    const obj = {
        subobj: {
            value1: 1,
            value2: 2,
            value3: null,
        }
    }

    const result = await crs.call("object", "assert", {
        source: obj,
        properties: ["subobj/value1", "subobj/value2"]
    })
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