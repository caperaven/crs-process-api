import {loadBinding} from "./../mockups/crsbinding.mock.js";

beforeAll(async () => {
    await loadBinding();
    await import("./../../src/index.js");
})

test("ActionActions - call action", async () => {
    const context = {
        getValue: () => {
            return 10;
        }
    }

    const step = {
        action: "@context.getValue",
        args: {
            target: "@context.result"
        }
    }

    await globalThis.crs.intent.action.perform(step, context);
    expect(context.result).toEqual(10);
})