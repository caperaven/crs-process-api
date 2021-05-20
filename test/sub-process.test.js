import {processes} from "./schemas/sub-process.js";
import {loadBinding} from "./mockups/crsbinding.mock.js";

beforeAll(async () => {
    await loadBinding();
    await import("./../src/index.js")
    crs.processSchemaRegistry.add(processes);
})

afterAll(async () => {
    crs.processSchemaRegistry.remove(processes);
})

test("sub-process", async () => {
    const result = await crs.process.run(null, processes.process1);
    expect(result).toEqual(21);
})