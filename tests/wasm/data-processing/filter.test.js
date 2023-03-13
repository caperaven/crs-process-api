import {assertEquals, assertThrows} from "https://deno.land/std@0.148.0/testing/asserts.ts";
import init, {filter} from "./../../../src/bin/data_processing.js";
await init();

Deno.test("filter - simple", () => {
    const start = performance.now();

    const result = filter([
        { value: "a" },
        { value: "b" },
        { value: "c" },
        { value: "a" },
        { value: "b" }
    ], { "field": "value", "operator": "eq", "value": "a" }, false);

    const end = performance.now();

    assertEquals(result.length, 2);
    assertEquals(result[0], 0);
    assertEquals(result[1], 3);
})