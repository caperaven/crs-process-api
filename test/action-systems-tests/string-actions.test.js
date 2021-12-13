import {loadBinding} from "./../mockups/crsbinding.mock.js";

beforeAll(async () => {
    await loadBinding();
    await import("./../../src/index.js");
})

test ("string format", async () => {
    let context = {
        typeId: 1001
    }

    const step = {
        type: "string",
        action: "inflate",
        args: {
            template: "#input/${id}?type='tasks'&typeId='${typeId}'",
            parameters: {
                id: 100,
                typeId: "$context.typeId"
            },
            target: "$context.result"
        }
    }

    await globalThis.crs.process.runStep(step, context, null, null);

    expect(context.result).toEqual("#input/100?type='tasks'&typeId='1001'");
})

test ("standard string", async () => {
    let result = await globalThis.crs.intent.string.inflate({args: {template: "www.test.com"}});
    expect(result).toEqual("www.test.com")
})