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
    expect(process._dataId).not.toBeUndefined();

    await crs.intent.binding.free_context(step, context, process);
    expect(process._dataId).toBeUndefined();
})

test("binding - get and set property", async() => {
    const context = {};

    const step = {
        type: "binding",
        action: "set_property",
        args: {
            property: "field1",
            value: "@context.value"
        }
    }
})