import {loadBinding} from "../mockups/crsbinding.mock.js";

beforeAll(async () => {
    await loadBinding();
    await import("./../../src/index.js");
})

test("binding - create_context", async () => {
    const context = {};

    const step = {
        type: "binding",
        action: "create_context",
        args: {
            contextId: "test_context"
        }
    }

    const process = {};

    await crs.process.runStep(step, context, process);
    expect(process.parameters.bId).not.toBeUndefined();

    await crs.intent.binding.free_context(step, context, process);
    expect(process.parameters.bId).toBeUndefined();
})

test("binding - get and set property", async() => {
    const context = {
        value: "Hello World"
    };

    const process = {};

    await crs.intent.binding.create_context(null, context, process, null);

    const set_step = {
        type: "binding",
        action: "set_property",
        args: {
            property: "field1",
            value: "$context.value"
        }
    }

    await crs.process.runStep(set_step, context, process);

    const get_step = {
        type: "binding",
        action: "get_property",
        args: {
            property: "field1",
            target: "$context.field1"
        }
    }

    await crs.process.runStep(get_step, context, process);
    expect(context.field1).toEqual(context.value);

    const obj_set_step = {
        type: "object",
        action: "set",
        args: {
            properties: {
                "$context.field2": "$binding.field1"
            }
        }
    }

    await crs.process.runStep(obj_set_step, context, process);
    expect(context.field2).toEqual(context.value);
})