import {init} from "./../../mockups/validations-mock-loader.js";
import {validateStepTest} from "./../providers/provider-utils.js";

beforeAll(async () => {
    await init();
})

test("BindingProvider - validate - create_context", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "binding",
                    action: "create_context",
                    args: {
                        context_id: "my_context"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "binding", "test", "start", [
        '"context_id" must have a value'
    ])
})

test("BindingProvider - validate - free_context", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "binding",
                    action: "free_context"
                }
            }
        }
    }

    await validateStepTest(schema, "binding", "test", "start")
})

test("BindingProvider - validate - get_property", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "binding",
                    action: "get_property",
                    args: {
                        property : "code",
                        target   : "$context.target"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "binding", "test", "start", [
        '"property" must have a value',
        '"target" must have a value'
    ])
})

test("BindingProvider - validate - set_property", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "binding",
                    action: "set_property",
                    args: {
                        property : "code",
                        value    : 10
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "binding", "test", "start", [
        '"property" must have a value',
        '"value" must have a value'
    ])
})

test("BindingProvider - validate - get_data", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "binding",
                    action: "get_data",
                    args: {
                        target : "$context.target"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "binding", "test", "start", [
        '"target" must have a value'
    ])
})

test("BindingProvider - validate - set_errors", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "binding",
                    action: "set_errors",
                    args: {
                        source: "$context.errors"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "binding", "test", "start", [
        '"source" must have a value'
    ])
})