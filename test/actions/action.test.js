import "./../../src/index.js";

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
        args: {
            action: "@context.log",
            parameters: ["Hello World"]
        }
    }, context)

    expect(data.value).toEqual("Hello World");
})

test("execute action - process", async () => {
    const process = {
        log: (value) => {
            data.value = value
        }
    }

    await crs.process.runStep({
        type: "action",
        args: {
            action: "@process.log",
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
        args: {
            action: "@item.log",
            parameters: ["Hello World"]
        }
    }, null, null, item)

    expect(data.value).toEqual("Hello World");
})