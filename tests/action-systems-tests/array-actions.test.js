import { assertEquals, assertExists, assertNotEquals } from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";

await init();

let log = null;
globalThis.console = {
    error: (msg) => log = msg
}

Deno.test("ArrayActions - add - directly to array", async () => {
    const values = [];

    await crs.call("array", "add", {target: values, value: "Hello World"});

    assertEquals(values.length, 1);
    assertEquals(values[0], "Hello World");
})

Deno.test("ArrayActions - add - no array - show error", async () => {
    log = null;
    const values = null;
    await crs.call("array", "add", {target: values, value: "Hello World"});

    assertExists(log);
})

Deno.test("ArrayActions - add - on context path", async () => {
    const context = {
        values: []
    }

    await crs.call("array", "add", {target: "$context.values", value: "Hello World"}, context);
    assertEquals(context.values.length, 1);
    assertEquals(context.values[0], "Hello World");
})

Deno.test("ArrayActions - add - context to array", async () => {
    const process = {functions: {}, data: {collection: []}};
    const item = "Hello World";

    await crs.call("array", "add", {target: "$process.data.collection", value: "$item"}, null, process, item);

    assertEquals(process.data.collection.length, 1);
    assertEquals(process.data.collection[0], "Hello World");
})

Deno.test("ArrayActions - field to CSV", async () => {
    const context = {
        values: [{value: 1}, {value: 2}, {value: 3}]
    };

    await crs.call("array", "field_to_csv", {source: "$context.values", target: "$context.result", delimiter: ";", field: "value"}, context);

    assertExists(context.result);
    assertEquals(context.result, "1;2;3");
})

Deno.test("ArrayActions - fields to CSV", async () => {
    const context = {
        values: [
            { code: "code1", value: "value1" },
            { code: "code2", value: "value2" }
        ]
    }

    await crs.call("array", "field_to_csv", {
        source: "$context.values",
        fields: ["code", "value"],
        target: "$context.result",
        delimiter: ";"
    }, context);

    assertNotEquals(context.result, undefined);
    assertEquals(context.result.length, 2);
    assertEquals(context.result[0], "code1;value1");
    assertEquals(context.result[1], "code2;value2");
})

Deno.test("ArrayActions - concat", async () => {
    const context = {
        collection1: [1, 2, 3],
        collection2: [4, 5, 6]
    }

    await crs.call("array", "concat", {
        sources: ["$context.collection1", "$context.collection2"],
        target: "$context.result"
    }, context)

    assertEquals(context.result.length, 6);
    assertEquals(context.result[0], 1);
    assertEquals(context.result[5], 6);
})

Deno.test("ArrayActions - change_values", async () => {
    const context = {
        values: [{value: 1}, {value: 2}, {value: 3}],
        value: 10
    };

    await crs.call("array", "change_values", {
        source: "$context.values",
        changes: {
            "value": "$context.value",
            "site": "Site 1"
        }
    }, context)

    assertEquals(context.values[0].value, 10);
    assertEquals(context.values[0].site, "Site 1");
    assertEquals(context.values[1].value, 10);
    assertEquals(context.values[1].site, "Site 1");
    assertEquals(context.values[2].value, 10);
    assertEquals(context.values[2].site, "Site 1");
})

Deno.test("ArrayActions - get value", async () => {
    const context = {
        values: [{value: 1.1}, {value: 2.2}, {value: 3.3}]
    };

    await crs.call("array", "get_value", {
        source: "$context.values",
        index: 0,
        field: "value",
        target: "$context.result"
    }, context);

    assertEquals(context.result, 1.1);
})

Deno.test("ArrayActions - map objects array field to array", async () => {
    const context = {
        values: [{v1: 1, v2: 2}, {v1: 3, v2: 4}, {v1: 5, v2: 6}]
    }

    await crs.call("array", "map_objects", {
        source: "$context.values",
        fields: ["v2"],
        target: "$context.result"
    }, context)

    assertEquals(context.result, [2, 4, 6]);
})

Deno.test("ArrayActions - map objects array fields to arrays", async () => {
    const context = {
        values: [{v1: 1, v2: 2, v3: 3}, {v1: 4, v2: 5, v3: 6}, {v1: 7, v2: 8, v3: 9}]
    }

    await crs.call("array", "map_objects", {
        source: "$context.values",
        fields: ["v1", "v3"],
        target: "$context.result"
    }, context);

    assertEquals(context.result, [1, 3, 4, 6, 7, 9]);
})

Deno.test("ArrayActions - map objects array null values", async () => {
    const context = {};

    await crs.call("array", "map_objects", {
        source: "$context.values",
        target: "$context.result"
    }, context);

    assertEquals(context.result, []);
})

Deno.test("ArrayActions - map objects array nested path fields to arrays", async () => {
    const context = {
        values: [
            {v1: 1, v2: 2, v3: {1: {2: 3}}},
            {v1: 4, v2: 5, v3: {1: {2: 6}}},
            {v1: 7, v2: 8, v3: {1: {2: 9}}}]
    }

    await crs.call("array", "map_objects", {
        source: "$context.values",
        fields: ["v1", "v3.1.2"],
        target: "$context.result"
    }, context);

    assertEquals(context.result, [1, 3, 4, 6, 7, 9]);
})

Deno.test("ArrayActins - get_records", async () => {
    const context = {
        values: [
            {v1: 1, v2: 2, v3: {1: {2: 3}}},
            {v1: 4, v2: 5, v3: {1: {2: 6}}},
            {v1: 7, v2: 8, v3: {1: {2: 9}}}]
    }

    const result = await crs.call("array", "get_records", {
        source: "$context.values",
        page_number: 1,
        page_size: 2
    }, context);

    assertEquals(result.length, 2);
    assertEquals(result[0].v1, 4);
    assertEquals(result[1].v1, 7);
})

Deno.test("ArrayActins - get_range", async () => {
    const context = {
        values: [
            {v1: 1, v2: 2, v3: {1: {2: 3}}},
            {v1: 4, v2: 5, v3: {1: {2: 6}}},
            {v1: 7, v2: 8, v3: {1: {2: 9}}}]
    }

    const result = await crs.call("array", "get_range", {
        source: "$context.values",
        field: "v1"
    }, context);

    assertEquals(result.min, 1);
    assertEquals(result.max, 7);
})

Deno.test("ArrayActins - calculate_paging", async () => {
    const context = {
        values: [
            {v1: 1, v2: 2, v3: {1: {2: 3}}},
            {v1: 4, v2: 5, v3: {1: {2: 6}}},
            {v1: 7, v2: 8, v3: {1: {2: 9}}}]
    }

    const result = await crs.call("array", "calculate_paging", {
        source: "$context.values",
        page_size: 1
    }, context);

    assertEquals(result.row_count, 3);
    assertEquals(result.page_count, 3);
})

Deno.test("map_assign_data: change 2 properties and add one", async () => {
    // Arrange
    const testData = [
        { a: 1, b: 2, c: 3 },
        { a: 4, b: 5, c: 6 }
    ];
    const mappings = { a: "A", b: "B" };
    const properties = { d: "Test" };

    const step = { source: testData, mappings, properties, target: "$context.result" };
    const context = {};
    const process = {};
    const item = {};

    // Act
    const result = await crs.call("array","map_assign_data", step, context, process, item);

    // Assert
    const expected = [
        { A: 1, B: 2, d: "Test" },
        { A: 4, B: 5, d: "Test" }
    ];
    assertEquals(result, expected);
    assertEquals(context.result, expected);
});

// Edge case test: empty input
Deno.test("map_assign_data: empty input", async () => {
    const step = {
            source: [],
            mappings: {},
            properties: {},
            target: null
    };
    const result = await crs.call("array","map_assign_data", step);
    assertEquals(result, []);
});

// Edge case test: no mappings
Deno.test("map_assign_data: no mappings", async () => {
    const step = {
            source: [{a: 1, b: 2}],
            mappings: {},
            properties: {c: 3},
            target: null
    };
    const result = await crs.call("array","map_assign_data", step);
    assertEquals(result, [{c: 3}]);
});

// Edge case test: no properties
Deno.test("map_assign_data: no properties", async () => {
    const step = {
            source: [{a: 1, b: 2}],
            mappings: {a: "x", b: "y"},
            properties: {},
            target: null
    };
    const result = await crs.call("array","map_assign_data", step);
    assertEquals(result, [{x: 1, y: 2}]);
});