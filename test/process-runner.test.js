import {loopExample} from "./schemas/loop-example.js";
import {loadBinding} from "./mockups/crsbinding.mock.js";

beforeAll(async () => {
    await loadBinding();
    await import("./../src/index.js");
})

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

test("ProcessRunner - getValue - context", async () => {
    const context = {value: 10};
    const result = await crs.process.getValue("$context.value", context);
    expect(result).toEqual(10);
})

test("ProcessRunner - getValue - process", async () => {
    const process = {value: 10};
    const result = await crs.process.getValue("$process.value", null, process);
    expect(result).toEqual(10);
})

test("ProcessRunner - getValue - item", async () => {
    const item = {value: 10};
    const result = await crs.process.getValue("$item.value", null, null, item);
    expect(result).toEqual(10);
})

test("ProcessRunner - getValue - with function", async () => {
    const context = {src: "Hello World"};
    const result = await crs.process.getValue("$context.src.toUpperCase()", context, null, null);
    expect(result).toEqual("HELLO WORLD");
})

test("ProcessRunner - getValue - with expression", async () => {
    const result = await crs.process.getValue("$fn(1 + 2)");
    expect(result).toEqual(3);
})

test("ProcessRunn - getValue - with backets in text", async () => {
    const result = await crs.process.getValue("My String(with value) is cool");
    expect(result).toEqual("My String(with value) is cool");
})

test("ProcessRunner - getValue - calculate using context and process and item", async () => {
    const result = await crs.process.getValue("$context.base * $item.value + $process.fraction", {base: 2}, {fraction: 0.123}, {value: 5});
    expect(result).toEqual(10.123);
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