import {assertEquals} from "https://deno.land/std@0.148.0/testing/asserts.ts";
import init, {fuzzy_filter, init_panic_hook} from "./../../../src/bin/data_processing.js";
await init();

Deno.test("fuzzy filter", () => {
    init_panic_hook();

    const result = fuzzy_filter([
        { value: "a" , value2: "aa" },
        { value: "b" , value2: "b"},
        { value: "c" , value2: "aa"},
        { value: "a" , value2: "c"},
        { value: "b" , value2: "aa"}
    ], { "fields": ["value", "value2"], "value": "a" });

    assertEquals(result.length, 4);
    assertEquals(result, [0, 2, 3, 4]);
})
