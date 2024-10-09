import {assertEquals, assertThrows} from "https://deno.land/std@0.148.0/testing/asserts.ts";
import init, {filter, init_panic_hook} from "../../../src/wasm/data_processing.js";
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

Deno.test("filter - not", () => {
    const result = filter([
        { value: "a", value2: 10 },
        { value: "b", value2: 10 },
        { value: "c", value2: 10 },
        { value: "a", value2: 12 },
        { value: "b", value2: 20 }
    ], {
        "operator": "not",
        "expressions": [
            { "field": "value2", "operator": "eq", "value": 10 },
        ]
    }, false);

    assertEquals(result.length, 2);
});

Deno.test("filter - equal", () => {
    const result = filter([
        { value: "a", value2: 10 },
        { value: "b", value2: 10 },
        { value: "c", value2: 10 },
        { value: "a", value2: 12 },
        { value: "b", value2: 20 }
    ],{ "field": "value2", "operator": "eq", "value": 10 }, false);

    assertEquals(result.length, 3);
})

Deno.test("filter - not equal", () => {
    const result = filter([
        { value: "a", value2: 10 },
        { value: "b", value2: 10 },
        { value: "c", value2: 10 },
        { value: "a", value2: 12 },
        { value: "b", value2: 20 }
    ],{ "field": "value2", "operator": "neq", "value": 10 }, false);

    assertEquals(result.length, 2);
})

Deno.test("filter - greater than", () => {
    const result = filter([
        { value: "a", value2: 10 },
        { value: "b", value2: 10 },
        { value: "c", value2: 10 },
        { value: "a", value2: 12 },
        { value: "b", value2: 20 }
    ],{ "field": "value2", "operator": "gt", "value": 10 }, false);

    assertEquals(result.length, 2);
})

Deno.test("filter - greater than", () => {
    const result = filter([
        { value: "a", value2: 10 },
        { value: "b", value2: 10 },
        { value: "c", value2: 10 },
        { value: "a", value2: 12 },
        { value: "b", value2: 20 }
    ],{ "field": "value2", "operator": "gt", "value": 12 }, false);

    assertEquals(result.length, 1);
})

Deno.test("filter - less than", () => {
    const result = filter([
        { value: "a", value2: 10 },
        { value: "b", value2: 10 },
        { value: "c", value2: 10 },
        { value: "a", value2: 12 },
        { value: "b", value2: 20 }
    ],{ "field": "value2", "operator": "lt", "value": 12 }, false);

    assertEquals(result.length, 3);
})

Deno.test("filter - greater or equal", () => {
    const result = filter([
        { value: "a", value2: 10 },
        { value: "b", value2: 10 },
        { value: "c", value2: 10 },
        { value: "a", value2: 12 },
        { value: "b", value2: 20 }
    ],{ "field": "value2", "operator": "ge", "value": 12 }, false);

    assertEquals(result.length, 2);
})

Deno.test("filter - greater or equal", () => {
    const result = filter([
        { value: "a", value2: 10 },
        { value: "b", value2: 10 },
        { value: "c", value2: 10 },
        { value: "a", value2: 12 },
        { value: "b", value2: 20 }
    ],{ "field": "value2", "operator": "le", "value": 12 }, false);

    assertEquals(result.length, 4);
})

Deno.test("filter - is null", () => {
    const result = filter([
        { value: "a", value2: 10 },
        { value: "b", value2: 10 },
        { value: "c", value2: 10 },
        { value: "a", value2: 12 },
        { value: "b", value2: null }
    ],{ "field": "value2", "operator": "is_null" }, false);

    assertEquals(result.length, 1);
})

Deno.test("filter - is not null", () => {
    const result = filter([
        { value: "a", value2: 10 },
        { value: "b", value2: 10 },
        { value: "c", value2: 10 },
        { value: "a", value2: 12 },
        { value: "b", value2: null }
    ],{ "field": "value2", "operator": "not_null" }, false);

    assertEquals(result.length, 4);
})

Deno.test("filter - like", () => {
    const result = filter([
        { value: "hello", value2: 10 },
        { value: "world", value2: 10 },
        { value: "line 3", value2: 10 },
        { value: "test 1", value2: 12 },
        { value: "say whaaat", value2: null }
    ],{ "field": "value", "operator": "like", value: "%line%" }, false);

    assertEquals(result.length, 1);
})

Deno.test("filter - not like", () => {
    const result = filter([
        { value: "hello", value2: 10 },
        { value: "world", value2: 10 },
        { value: "line 3", value2: 10 },
        { value: "test 1", value2: 12 },
        { value: "say whaaat", value2: null }
    ],{ "field": "value", "operator": "not_like", value: "%line%" }, false);

    assertEquals(result.length, 4);
})

Deno.test("filter - contains", () => {
    const result = filter([
        { value: "hello", value2: 10 },
        { value: "world", value2: 10 },
        { value: "line 3", value2: 10 },
        { value: "test 1", value2: 12 },
        { value: "say whaaat", value2: null }
    ],{ "field": "value", "operator": "contains", value: "line" }, false);

    assertEquals(result.length, 1);
})

Deno.test("filter - in", () => {
    const result = filter([
        { value: "hello", value2: 1 },
        { value: "world", value2: 2 },
        { value: "line 3", value2: 3 },
        { value: "test 1", value2: 4 },
        { value: "say whaaat", value2: null }
    ],{ "field": "value2", "operator": "in", value: [1, 2, 3] }, false);

    assertEquals(result.length, 3);
})

Deno.test("filter - starts with", () => {
    const result = filter([
        { value: "hello world", value2: 1 },
        { value: "world order", value2: 2 },
        { value: "line 3", value2: 3 },
        { value: "test 1", value2: 4 },
        { value: "say whaaat", value2: null }
    ],{ "field": "value", "operator": "starts_with", value: "line" }, false);

    assertEquals(result.length, 1);
})

Deno.test("filter - ends with", () => {
    const result = filter([
        { value: "hello world", value2: 1 },
        { value: "world order", value2: 2 },
        { value: "line 3", value2: 3 },
        { value: "test 1", value2: 4 },
        { value: "say whaaat", value2: null }
    ],{ "field": "value", "operator": "ends_with", value: "order" }, false);

    assertEquals(result.length, 1);
})

Deno.test("filter - between", () => {
    // JHR: this is problematic, needs a better breakdown and see if the implementation works.
    // More scenarios to cater for than the current allows as the current only allows strings.
})