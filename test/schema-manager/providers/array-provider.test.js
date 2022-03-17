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

    const result = await globalThis.crs.api_providers["array"].validate(schema, "array_test", "start");
    expect(result.passed).toBeTruthy();
})

test("ArrayProvider - validate - add - false", async () => {
    const schema = {
        array_test: {
            steps: {
                start: {
                    type: "array",
                    action: "add",
                    args: {
                    }
                }
            }
        }
    }

    const result = await globalThis.crs.api_providers["array"].validate(schema, "array_test", "start");
    expect(result.passed).toBeFalsy();
    expect(result.messages[0]).toEqual('"target" must have a value');
    expect(result.messages[1]).toEqual('"value" must have a value');
})