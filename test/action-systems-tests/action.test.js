import {loadBinding} from "../mockups/crsbinding.mock.js";

beforeAll(async () => {
    await loadBinding();
    await import("../../src/index.js");
})

const data = {

}

test("execute action - context", async () => {
    const context = {
        log: (value) => {
            data.value = value
        }
    }

    await crs.process.runStep({
        type: "action",
        action: "$context.log",
        args: {
            parameters: ["Hello World"]
        }
    }, context)

    expect(data.value).toEqual("Hello World");
})

test("execute action - process", async () => {
    const process = {
        functions: {},
        log: (value) => {
            data.value = value
        }
    }

    await crs.process.runStep({
        type: "action",
        action: "$process.log",
        args: {
            parameters: ["Hello World"]
        }
    }, null, process)

    expect(data.value).toEqual("Hello World");
})

test("execute action - item", async () => {
    const item = {
        log: (value) => {
            data.value = value
        }
    }

    await crs.process.runStep({
        type: "action",
        action: "$item.log",
        args: {
            parameters: ["Hello World"]
        }
    }, null, null, item)

    expect(data.value).toEqual("Hello World");
})