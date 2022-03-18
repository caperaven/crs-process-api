import {init} from "./../../mockups/validations-mock-loader.js";
import {validateStepTest} from "./../providers/provider-utils.js";

beforeAll(async () => {
    await init();
})

test("ArrayProvider - validate - add", async () => {
    const schema = {
        test: {
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

    await validateStepTest(schema, "array", "test", "start", [
        '"value" must have a value',
        '"target" must have a value'
    ])
})

test("ArrayProvider - validate - calculate_paging", async () => {
    const schema = {
        test: {
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

    await validateStepTest(schema, "array", "test", "start", [
        '"source" must have a value',
        '"page_size" must have a value',
        '"target" must have a value'
    ])
})

test("ArrayProvider - validate - change_values", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "array",
                    action: "change_values",
                    args: {
                        source     : "$context.collection",
                        changes    : {}
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "array", "test", "start", [
        '"source" must have a value',
        '"changes" must have a value'
    ])
})

test("ArrayProvider - validate - concat", async () => {
    const schema = {
        test: {
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

    await validateStepTest(schema, "array", "test", "start", [
        '"sources" must have a value',
        '"target" must have a value'
    ])
})

test("ArrayProvider - validate - field_to_csv", async () => {
    const schema = {
        test: {
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

    await validateStepTest(schema, "array", "test", "start", [
        '"source" must have a value',
        '"target" must have a value',
        '"delimiter" must have a value',
        '"field" must have a value'
    ])
})

test("ArrayProvider - validate - get_range", async () => {
    const schema = {
        test: {
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

    await validateStepTest(schema, "array", "test", "start", [
        '"source" must have a value',
        '"target" must have a value',
        '"field" must have a value'
    ])
})

test("ArrayProvider - validate - get_records", async () => {
    const schema = {
        test: {
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

    await validateStepTest(schema, "array", "test", "start", [
        '"source" must have a value',
        '"target" must have a value',
        '"page_number" must have a value',
        '"page_size" must have a value'
    ])
})

test("ArrayProvider - validate - get_value", async () => {
    const schema = {
        test: {
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

    await validateStepTest(schema, "array", "test", "start", [
        '"source" must have a value',
        '"target" must have a value',
        '"field" must have a value',
        '"index" must have a value'
    ])
})

test("ArrayProvider - validate - map_objects", async () => {
    const schema = {
        test: {
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

    await validateStepTest(schema, "array", "test", "start", [
        '"source" must have a value',
        '"target" must have a value',
        '"field" must have a value'
    ])
})