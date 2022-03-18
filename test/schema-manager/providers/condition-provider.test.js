import {init} from "./../../mockups/validations-mock-loader.js";
import {validateStepTest} from "./../providers/provider-utils.js";

beforeAll(async () => {
    await init();
})

test("ConditionProvider - validate - true", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "condition",
                    args: {
                        condition: "$context.a == $context.b"
                    },
                    pass_step: "next_step"
                }
            }
        }
    }

    await validateStepTest(schema, "condition", "test", "start", [
        '"condition" must have a value'
    ])
})

test("ConditionProvider - validate - true", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "condition",
                    args: {
                        condition: "$context.a == $context.b"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "condition", "test", "start", [
        '"condition" must have a value',
        '"pass_step" or "fail_step" required'
    ])
})