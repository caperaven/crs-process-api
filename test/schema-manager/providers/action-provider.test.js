import {init} from "./../../mockups/validations-mock-loader.js";

beforeAll(async () => {
    await init();
})

test("ArrayProvider - validate", async () => {
    const schema = {
        action_test: {
            steps: {
                start: {
                    type: "action",
                    action: "$context.log",
                }
            }
        }
    }

    let result = await globalThis.crs.api_providers.action.validate(schema, "action_test", "start");
    expect(result).toBeTruthy();

    delete schema.action_test.steps.start.action;
    result = await globalThis.crs.api_providers.action.validate(schema, "action_test", "start");
    expect(result).toBeFalsy();
})