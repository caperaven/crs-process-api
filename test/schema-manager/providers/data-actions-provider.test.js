import {init} from "./../../mockups/validations-mock-loader.js";
import {validateStepTest} from "./provider-utils";

beforeAll(async () => {
    await init();
})

test("data-actions - validate - filter", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "data",
                    action: "filter",
                    args: {
                        source: [],
                        filter: [],
                        target: "$context.target"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "data", "test", "start", [
        '"source" must have a value',
        '"filter" must have a value',
        '"target" must have a value',
    ])
})

test("data-actions - validate - sort", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "data",
                    action: "sort",
                    args: {
                        source: [],
                        sort: [],
                        target: "$context.target"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "data", "test", "start", [
        '"source" must have a value',
        '"sort" must have a value',
        '"target" must have a value'
    ])
})

test("data-actions - validate - group", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "data",
                    action: "group",
                    args: {
                        source: [],
                        fields: [],
                        target: "$context.target"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "data", "test", "start", [
        '"source" must have a value',
        '"fields" must have a value',
        '"target" must have a value'
    ])
})

test("data-actions - validate - aggregate", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "data",
                    action: "aggregate",
                    args: {
                        source: [],
                        aggregate: {},
                        target: "$context.target"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "data", "test", "start", [
        '"source" must have a value',
        '"aggregate" must have a value',
        '"target" must have a value'
    ])
})

test("data-actions - validate - aggregate_group", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "data",
                    action: "aggregate_group",
                    args: {
                        source: [],
                        group: {},
                        aggregate: {},
                        target: "$context.target"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "data", "test", "start", [
        '"source" must have a value',
        '"group" must have a value',
        '"aggregate" must have a value',
        '"target" must have a value'
    ])
})

test("data-actions - validate - iso8601_to_string", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "data",
                    action: "iso8601_to_string",
                    args: {
                        value: "",
                        target: "$context.target"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "data", "test", "start", [
        '"value" must have a value',
        '"target" must have a value'
    ])
})

test("data-actions - validate - iso8601_batch", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "data",
                    action: "iso8601_batch",
                    args: {
                        value: "",
                        target: "$context.target"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "data", "test", "start", [
        '"value" must have a value',
        '"target" must have a value'
    ])
})

test("data-actions - validate - in_filter", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "data",
                    action: "in_filter",
                    args: {
                        source: [],
                        filter: {},
                        target: "$context.target"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "data", "test", "start", [
        '"source" must have a value',
        '"filter" must have a value',
        '"target" must have a value'
    ])
})

test("data-actions - validate - unique_values", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "data",
                    action: "unique_values",
                    args: {
                        source: [],
                        fields: [],
                        target: "$context.target"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "data", "test", "start", [
        '"source" must have a value',
        '"fields" must have a value',
        '"target" must have a value'
    ])
})

test("data-actions - validate - assert_equal", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "data",
                    action: "assert_equal",
                    args: {
                        source: [],
                        expr: "",
                        target: "$context.target"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "data", "test", "start", [
        '"source" must have a value',
        '"expr" must have a value',
        '"target" must have a value'
    ])
})

test("data-actions - validate - perspective", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "data",
                    action: "perspective",
                    args: {
                        source: [],
                        perspective: {},
                        target: "@context.target"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "data", "test", "start", [
        '"source" must have a value',
        '"perspective" must have a value',
        '"target" must have a value',
    ])
})