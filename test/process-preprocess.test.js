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

test("pre process - load parameter values - null value", async () => {
    const context = {
        value: null
    }

    let hasError = false;
    try {
        await crs.process.run(context, process.parameterised).catch(error => hasError = true);
    }
    catch(e) {
        hasError = true;
    }

    expect(hasError).toEqual(true);
})