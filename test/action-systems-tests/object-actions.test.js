import "./../../src/index.js";
import {loadBinding} from "./../mockups/crsbinding.mock.js";

beforeAll(async () => {
    await loadBinding();
})

test("ObjectActions - set - context", async () => {
    const context = {};
    const descriptor = await SetDescriptor.new("@context.value", 1);
    await globalThis.crs.process.runStep(descriptor, context);
    expect(context.value).toEqual(1);
})

test("ObjectActions - set - process", async () => {
    const process = {data: {}};
    const descriptor = await SetDescriptor.new("@process.data.value", 1);
    await globalThis.crs.process.runStep(descriptor, null, process);
    expect(process.data.value).toEqual(1);
})

test("ObjectActions - set - item", async () => {
    const item = {};
    const descriptor = await SetDescriptor.new("@item.value", 1);
    await globalThis.crs.process.runStep(descriptor, null, null, item);
    expect(item.value).toEqual(1);
})

test("ObjectActions - set - with functions", async () => {
    const context = {src: "hello world"};
    const descriptor = await SetDescriptor.new("@context.value", "@context.src.toUpperCase()");
    await globalThis.crs.process.runStep(descriptor, context);
    expect(context.value).toEqual("HELLO WORLD");
})

class SetDescriptor {
    static async new(target, value) {
        return {
            type: "object",
            action: "set",
            args: {
                target: target,
                value: value
            }
        }
    }
}