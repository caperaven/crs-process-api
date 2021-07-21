import {loadBinding} from "./mockups/crsbinding.mock.js";

beforeAll(async () => {
    await loadBinding();
    await import("./../src/index.js");
})


class Math {
    static async perform(step, context, process, item) {
        if (this[step.action]) {
            return await this[step.action](step, context, process, item)
        }
    }

    static async add(step, context, process, item) {
        const result = step.args.v1 + step.args.v2;
        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }
        return result;
    }
}

test("extend - add custom action", async () => {
    crs.intent.math = Math;
    const context = {};

    const value = await crs.process.runStep({type: "math", action: "add", args: {v1: 2, v2: 3, target: "$context.result"}}, context);

    expect(value).toBe(5)
    expect(context.result).toBe(5);
})