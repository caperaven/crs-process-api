import {process} from "./schemas/single-parameterised-process.js";
import {loadBinding} from "./mockups/crsbinding.mock.js";

beforeAll(async () => {
    await loadBinding();
    await import("./../src/index.js");
})

test("pre process - load parameter values", async () => {
    const context = {
        value: 10
    }

    const result = await crs.process.run(context, process.parameterised);
    expect(result).toEqual(100);
})