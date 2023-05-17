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

Deno.test("filter - or", () => {
    const intent = {
        "operator": "or",
        "expressions": [
            { "field": "value", "operator": "eq", "value": "a" },
            { "field": "value", "operator": "eq", "value": "b" }
        ]
    };

    const result = filter([
        { value: "a" },
        { value: "b" },
        { value: "c" },
        { value: "a" },
        { value: "b" }
    ], intent, false);

    assertEquals(result.length, 4);
});

Deno.test("filter - and", () => {
    const intent = {
        "operator": "and",
        "expressions": [
            { "field": "value", "operator": "eq", "value": "a" },
            { "field": "value2", "operator": "eq", "value": 10 }
        ]
    };

    const result = filter([
        { value: "a", value2: 10 },
        { value: "b", value2: 10 },
        { value: "c", value2: 13 },
        { value: "a", value2: 12 },
        { value: "b", value2: 20 }
    ], intent, false);

    assertEquals(result.length, 1);
});

Deno.test("filter - mixed 'and' and 'or'", () => {
    const intent = {
        "operator": "or",
        "expressions": [
            {
                "operator": "and",
                "expressions": [
                    { "field": "value", "operator": "eq", "value": "a" },
                    { "field": "value2", "operator": "eq", "value": 10 }
                ]
            },
            {
                "field": "value2",
                "operator": "eq",
                "value": 20
            }
        ]
    }

    const result = filter([
        { value: "a", value2: 10 },
        { value: "b", value2: 10 },
        { value: "c", value2: 13 },
        { value: "a", value2: 12 },
        { value: "b", value2: 20 }
    ], intent, false);

    assertEquals(result.length, 2);
});