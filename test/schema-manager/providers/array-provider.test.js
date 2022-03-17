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

test("ArrayProvider - validate - calculate_paging  - true", async () => {
    const schema = {
        array_test: {
            steps: {
                start: {
                    type: "array",
                    action: "calculate_paging",
                    args: {
                        source      : "$context.collection",
                        page_size   : 10,
                        target      : "$context.size"
                    }
                }
            }
        }
    }

    const result = await globalThis.crs.api_providers["array"].validate(schema, "array_test", "start");
    expect(result.passed).toBeTruthy();
})

test("ArrayProvider - validate - calculate_paging - false", async () => {
    const schema = {
        array_test: {
            steps: {
                start: {
                    type: "array",
                    action: "calculate_paging",
                    args: {
                    }
                }
            }
        }
    }

    const result = await globalThis.crs.api_providers["array"].validate(schema, "array_test", "start");
    expect(result.passed).toBeFalsy();
    expect(result.messages[0]).toEqual('"source" must have a value');
    expect(result.messages[1]).toEqual('"page_size" must have a value');
    expect(result.messages[2]).toEqual('"target" must have a value');
})

test("ArrayProvider - validate - change_values - true", async () => {
    const schema = {
        array_test: {
            steps: {
                start: {
                    type: "array",
                    action: "change_values",
                    args: {
                        source      : "$context.collection",
                        changes     : {},
                    }
                }
            }
        }
    }

    const result = await globalThis.crs.api_providers["array"].validate(schema, "array_test", "start");
    expect(result.passed).toBeTruthy();
})

test("ArrayProvider - validate - change_values - false", async () => {
    const schema = {
        array_test: {
            steps: {
                start: {
                    type: "array",
                    action: "change_values",
                    args: {
                    }
                }
            }
        }
    }

    const result = await globalThis.crs.api_providers["array"].validate(schema, "array_test", "start");
    expect(result.passed).toBeFalsy();
    expect(result.messages[0]).toEqual('"source" must have a value');
    expect(result.messages[1]).toEqual('"changes" must have a value');
})

test("ArrayProvider - validate - concat - true", async () => {
    const schema = {
        array_test: {
            steps: {
                start: {
                    type: "array",
                    action: "concat",
                    args: {
                        sources     : "$context.collection",
                        target      : "$context.target",
                    }
                }
            }
        }
    }

    const result = await globalThis.crs.api_providers["array"].validate(schema, "array_test", "start");
    expect(result.passed).toBeTruthy();
})

test("ArrayProvider - validate - concat - false", async () => {
    const schema = {
        array_test: {
            steps: {
                start: {
                    type: "array",
                    action: "concat",
                    args: {
                    }
                }
            }
        }
    }

    const result = await globalThis.crs.api_providers["array"].validate(schema, "array_test", "start");
    expect(result.passed).toBeFalsy();
    expect(result.messages[0]).toEqual('"sources" must have a value');
    expect(result.messages[1]).toEqual('"target" must have a value');
})

test("ArrayProvider - validate - field_to_csv - true", async () => {
    const schema = {
        array_test: {
            steps: {
                start: {
                    type: "array",
                    action: "field_to_csv",
                    args: {
                        source      : "$context.collection",
                        target      : "$context.target",
                        delimiter   : ";",
                        field       : "value",
                    }
                }
            }
        }
    }

    const result = await globalThis.crs.api_providers["array"].validate(schema, "array_test", "start");
    expect(result.passed).toBeTruthy();
})

test("ArrayProvider - validate - field_to_csv - false", async () => {
    const schema = {
        array_test: {
            steps: {
                start: {
                    type: "array",
                    action: "field_to_csv",
                    args: {
                    }
                }
            }
        }
    }

    const result = await globalThis.crs.api_providers["array"].validate(schema, "array_test", "start");
    expect(result.passed).toBeFalsy();
    expect(result.messages[0]).toEqual('"source" must have a value');
    expect(result.messages[1]).toEqual('"target" must have a value');
    expect(result.messages[2]).toEqual('"delimiter" must have a value');
    expect(result.messages[3]).toEqual('"field" must have a value');
})

test("ArrayProvider - validate - get_range - true", async () => {
    const schema = {
        array_test: {
            steps: {
                start: {
                    type: "array",
                    action: "get_range",
                    args: {
                        source      : "$context.collection",
                        target      : "$context.target",
                        field       : "value",
                    }
                }
            }
        }
    }

    const result = await globalThis.crs.api_providers["array"].validate(schema, "array_test", "start");
    expect(result.passed).toBeTruthy();
})

test("ArrayProvider - validate - get_range - false", async () => {
    const schema = {
        array_test: {
            steps: {
                start: {
                    type: "array",
                    action: "get_range",
                    args: {
                    }
                }
            }
        }
    }

    const result = await globalThis.crs.api_providers["array"].validate(schema, "array_test", "start");
    expect(result.passed).toBeFalsy();
    expect(result.messages[0]).toEqual('"source" must have a value');
    expect(result.messages[1]).toEqual('"target" must have a value');
    expect(result.messages[2]).toEqual('"field" must have a value');
})

test("ArrayProvider - validate - get_records - true", async () => {
    const schema = {
        array_test: {
            steps: {
                start: {
                    type: "array",
                    action: "get_records",
                    args: {
                        source      : "$context.collection",
                        target      : "$context.target",
                        page_number : 1,
                        page_size   : 10
                    }
                }
            }
        }
    }

    const result = await globalThis.crs.api_providers["array"].validate(schema, "array_test", "start");
    expect(result.passed).toBeTruthy();
})

test("ArrayProvider - validate - get_records - false", async () => {
    const schema = {
        array_test: {
            steps: {
                start: {
                    type: "array",
                    action: "get_records",
                    args: {
                    }
                }
            }
        }
    }

    const result = await globalThis.crs.api_providers["array"].validate(schema, "array_test", "start");
    expect(result.passed).toBeFalsy();
    expect(result.messages[0]).toEqual('"source" must have a value');
    expect(result.messages[1]).toEqual('"target" must have a value');
    expect(result.messages[2]).toEqual('"page_number" must have a value');
    expect(result.messages[3]).toEqual('"page_size" must have a value');
})

test("ArrayProvider - validate - get_value - true", async () => {
    const schema = {
        array_test: {
            steps: {
                start: {
                    type: "array",
                    action: "get_value",
                    args: {
                        source      : "$context.collection",
                        target      : "$context.target",
                        index       : 1,
                        field       : "value"
                    }
                }
            }
        }
    }

    const result = await globalThis.crs.api_providers["array"].validate(schema, "array_test", "start");
    expect(result.passed).toBeTruthy();
})

test("ArrayProvider - validate - get_value - false", async () => {
    const schema = {
        array_test: {
            steps: {
                start: {
                    type: "array",
                    action: "get_value",
                    args: {
                    }
                }
            }
        }
    }

    const result = await globalThis.crs.api_providers["array"].validate(schema, "array_test", "start");
    expect(result.passed).toBeFalsy();
    expect(result.messages[0]).toEqual('"source" must have a value');
    expect(result.messages[1]).toEqual('"target" must have a value');
    expect(result.messages[2]).toEqual('"index" must have a value');
    expect(result.messages[3]).toEqual('"field" must have a value');
})

test("ArrayProvider - validate - map_objects - true", async () => {
    const schema = {
        array_test: {
            steps: {
                start: {
                    type: "array",
                    action: "map_objects",
                    args: {
                        source      : "$context.collection",
                        target      : "$context.target",
                        field       : "value"
                    }
                }
            }
        }
    }

    const result = await globalThis.crs.api_providers["array"].validate(schema, "array_test", "start");
    expect(result.passed).toBeTruthy();
})

test("ArrayProvider - validate - map_objects - false", async () => {
    const schema = {
        array_test: {
            steps: {
                start: {
                    type: "array",
                    action: "map_objects",
                    args: {
                    }
                }
            }
        }
    }

    const result = await globalThis.crs.api_providers["array"].validate(schema, "array_test", "start");
    expect(result.passed).toBeFalsy();
    expect(result.messages[0]).toEqual('"source" must have a value');
    expect(result.messages[1]).toEqual('"target" must have a value');
    expect(result.messages[2]).toEqual('"field" must have a value');
})