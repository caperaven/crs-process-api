import {init} from "./../../mockups/validations-mock-loader.js";
import {validateStepTest} from "./provider-utils";

beforeAll(async () => {
    await init();
})

test("events-actions - validate - post_message", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "events",
                    action: "post_message",
                    args: {
                        query: "#element",
                        parameters: {},
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "events", "test", "start", [
        '"query" must have a value',
        '"parameters" must have a value'
    ])
})

test("events-actions - validate - emit", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "events",
                    action: "emit",
                    args: {
                        event: "on_change",
                        parameters: {},
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "events", "test", "start", [
        '"event" must have a value',
        '"parameters" must have a value'
    ])
})
