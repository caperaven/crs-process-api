import {init} from "./../../mockups/validations-mock-loader.js";

beforeAll(async () => {
    await init();
})

test("ArrayProvider - validate - add - true", async () => {
    const schema = {
        array_test: {
            steps: {
                start: {
                    type: "array",
                    action: "add",
                    args: {
                        target  : [],
                        value   : 10
                    }
                }
            }
        }
    }

    const step = schema.array_test.steps.start;

    const result = await globalThis.crs.api_providers["array"].validate(schema, "array_test", step);
    expect(result.pass).toBeTruthy();
    expect(result.issues).toBeUndefined();
})