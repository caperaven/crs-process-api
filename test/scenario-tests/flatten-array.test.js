import {loadBinding} from "../mockups/crsbinding.mock.js";
import {process} from "./flatten-process.js";
import {createData} from './flatten-data.js';

beforeAll(async () => {
    await loadBinding();
    await import("./../../src/index.js");
})

test("Flatten Array", async () => {
    const context = {
        steps: createData()
    }

    const result = await globalThis.crs.process.run(context, process);
    expect(result.length).toEqual(10);
})