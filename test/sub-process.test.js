import {processes as subProcesses} from "./schemas/sub-process.js";
import {processes as loopProcesses} from "./schemas/loop-sub-process.js";
import {loadBinding} from "./mockups/crsbinding.mock.js";

beforeAll(async () => {
    await loadBinding();
    await import("./../src/index.js")
    crs.processSchemaRegistry.add(subProcesses);
    crs.process.fetch = () => loopProcesses;
})

afterAll(async () => {
    crs.process.fetch = null;
})

afterAll(async () => {
    crs.processSchemaRegistry.remove(subProcesses);
})

test("sub-process", async () => {
    const result = await crs.process.run(null, subProcesses.process1);
    expect(result).toEqual(21);
})

test("loop-sub-processes", async () => {
    const context = {
        records: [
            {value: 1}, {value: 2}, {value: 3}, {value: 4}, {value: 5}
        ]
    }

    const result = await crs.process.run(context, loopProcesses.process1);
    expect(result).toEqual(3);
})