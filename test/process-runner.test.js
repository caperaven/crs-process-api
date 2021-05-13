import "./../src/index.js";
import {loopExample} from "./schemas/loop-example.js";
import {loadBinding} from "./mockups/crsbinding.mock.js";

let logs = {
    log: null
};

beforeAll(async () => {
    global.console = {
        log: (msg) => logs.log = msg
    }
    await loadBinding();
})

test("ProcessRunner - run", async () => {
    const context = createContext(20);

    const result = await crs.process.run(context, loopExample.distribute_array);
    expect(result).not.toBeUndefined();
    expect(result.min_collection.length).toEqual(11);
    expect(result.max_collection.length).toEqual(9);
})

function createContext(count) {
    const result = [];

    for (let i = 0; i < count; i++) {
        result.push({
            value: i
        })
    }

    return {
        records: result
    };
}