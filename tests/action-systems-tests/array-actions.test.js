import {assertEquals, assertExists, assertNotEquals} from "https://deno.land/std@0.147.0/testing/asserts.ts";
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

    await crs.call("array", "field_to_csv", {
        source: "$context.values",
        target: "$context.result",
        delimiter: ";",
        field: "value"
    }, context);

    assertExists(context.result);
    assertEquals(context.result, "1;2;3");
})

Deno.test("ArrayActions - fields to CSV", async () => {
    const context = {
        values: [
            {code: "code1", value: "value1"},
            {code: "code2", value: "value2"}
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

Deno.test("map_assign_data: change 2 properties and add one nulling changes", async () => {
    // Arrange
    const testData = [
        {a: 1, b: 2, c: 3},
        {a: 4, b: 5, c: 6}
    ];
    const mappings = {
        A: "a",
        "$process.data.propertyMap": "b",
        d: "$process.data.testValue2",
        c: null,
        a: null,
        b: null
    };

    const step = {source: testData, mappings, target: "$context.result"};
    const context = {};
    const process = {
        data: {
            propertyMap: "B",
            testValue2: "Test"
        }
    };
    const item = {};

    // Act
    const result = await crs.call("array", "map_assign_data", step, context, process, item);

    // Assert
    const expected = [
        {A: 1, B: 2, a: null, b: null, c: null, d: "Test"},
        {A: 4, B: 5, a: null, b: null, c: null, d: "Test"}
    ];
    assertEquals(result, expected);
    assertEquals(context.result, expected);
});

Deno.test("map_assign_data: map b and add d", async () => {
    // Arrange
    const testData = [
        {a: 1, b: 2, c: 3},
        {a: 4, b: 5, c: 6}
    ];
    const mappings = {B: "b", d: "$process.data.testValue2"};

    const step = {source: testData, mappings, target: "$context.result", keepOtherFields: true};
    const context = {};
    const process = {
        data: {
            testValue2: "Test"
        }
    };
    const item = {};

    // Act
    const result = await crs.call("array", "map_assign_data", step, context, process, item);

    // Assert
    const expected = [
        {a: 1, b: 2, c: 3, d: "Test", B: 2},
        {a: 4, b: 5, c: 6, d: "Test", B: 5}
    ];
    assertEquals(result, expected);
    assertEquals(context.result, expected);
});

Deno.test("delete_properties: delete a single property from an array of objects", async () => {
    //Arrange
    const testData = [
        {id: 'xx', field1: 'xx', field2: 'xx'},
        {id: 'yy', field1: 'yy', field2: 'yy'},
        {id: 'zz', field1: 'zz', field2: 'zz'}
    ]
    const assertData = [
        {field1: 'xx', field2: 'xx'},
        {field1: 'yy', field2: 'yy'},
        {field1: 'zz', field2: 'zz'}
    ]
    //Act
    await crs.call("array", "delete_properties", {
        source: testData,
        properties: ["id"]
    });

    //Assert
    assertEquals(testData, assertData);
});

Deno.test("delete_properties: delete a multiple properties from an array of objects", async () => {
    //Arrange
    const testData = [
        {id: 'xx', id1: 'xx', field1: 'xx', field2: 'xx'},
        {id: 'yy', id1: 'yy', field1: 'yy', field2: 'yy'},
        {id: 'zz', id1: 'zz', field1: 'zz', field2: 'zz'}
    ]
    const assertData = [
        {field2: 'xx'},
        {field2: 'yy'},
        {field2: 'zz'}
    ]
    //Act
    await crs.call("array", "delete_properties", {
        source: testData,
        properties: ["id", "id1", "field1"]
    });

    //Assert
    assertEquals(testData, assertData);
});

// Edge case test: empty input
Deno.test("map_assign_data: empty input", async () => {
    const step = {
        source: [],
        mappings: {},
        target: null
    };
    const result = await crs.call("array", "map_assign_data", step);
    assertEquals(result, []);
});

// Edge case test: no mappings
Deno.test("map_assign_data: no mappings", async () => {
    const step = {
        source: [{a: 1, b: 2}],
        mappings: {},
        target: null
    };
    const result = await crs.call("array", "map_assign_data", step);
    assertEquals(result, [{a: 1, b: 2}]);
});

// Edge case test: map to a null value
Deno.test("map_assign_data: map to a null value", async () => {
    const step = {
        source: [{a: 1, b: null}],
        mappings: {b: 5},
        target: null
    };
    const result = await crs.call("array", "map_assign_data", step);
    assertEquals(result, [{a: 1, b: 5}]);
});

// Edge case test: map from a null value
Deno.test("map_assign_data: map from a null value", async () => {
    const step = {
        source: [{a: 1, b: null}],
        mappings: {a: "b"},
        target: null
    };
    const result = await crs.call("array", "map_assign_data", step);
    assertEquals(result, [{a: null, b: null}]);
});

//Edge case test: delete a property that does not exist
Deno.test("delete_properties:delete a property that does not exist", async () => {
    //Arrange
    const testData = [
        {id: 'xx', field1: 'xx', field2: 'xx'},
        {id: 'yy', field1: 'yy', field2: 'yy'},
        {id: 'zz', field1: 'zz', field2: 'zz'}
    ]
    const assertData = [
        {id: 'xx', field1: 'xx', field2: 'xx'},
        {id: 'yy', field1: 'yy', field2: 'yy'},
        {id: 'zz', field1: 'zz', field2: 'zz'}
    ]
    //Act
    await crs.call("array", "delete_properties", {
        source: testData,
        properties: ["name"]
    });

    //Assert
    assertEquals(testData, assertData);
});

//Edge case test: delete a null property
Deno.test("delete_properties: delete a null property", async () => {
    //Arrange
    const testData = [
        {id: 'xx', field1: 'xx', field2: 'xx'},
        {id: 'yy', field1: 'yy', field2: 'yy'},
        {id: 'zz', field1: 'zz', field2: 'zz'}
    ]
    const assertData = [
        {id: 'xx', field1: 'xx', field2: 'xx'},
        {id: 'yy', field1: 'yy', field2: 'yy'},
        {id: 'zz', field1: 'zz', field2: 'zz'}
    ]
    //Act
    await crs.call("array", "delete_properties", {
        source: testData,
        properties: [null]
    });

    //Assert
    assertEquals(testData, assertData);
});

Deno.test("move_item", async () => {
    const sourceData = [
        {id: 'a'},
        {id: 'b'},
        {id: 'c'}
    ];

    const targetData = [
        {id: 'd'},
        {id: 'e'},
        {id: 'f'}
    ];

    await crs.call("array", "move", {
        source: sourceData,
        source_item: sourceData[1],
        action: "move_up"
    });

    assertEquals(sourceData, [{id: 'b'}, {id: 'a'}, {id: 'c'}]);

    await crs.call("array", "move", {
        source: sourceData,
        source_item: sourceData[0],
        action: "move_down"
    });

    assertEquals(sourceData, [{id: 'a'}, {id: 'b'}, {id: 'c'}]);

    await crs.call("array", "move", {
        source: sourceData,
        source_item: sourceData[0],
        action: "append"
    });

    assertEquals(sourceData, [{id: 'b'}, {id: 'c'}, {id: 'a'}]);

    await crs.call("array", "move", {
        source: sourceData,
        source_item: sourceData[2],
        action: "prepend"
    });

    assertEquals(sourceData, [{id: 'a'}, {id: 'b'}, {id: 'c'}]);


    await crs.call("array", "move", {
        source: sourceData,
        source_item: sourceData[0],
        action: "insert",
        index: 1
    });

    assertEquals(sourceData, [{id: 'b'}, {id: 'a'}, {id: 'c'}]);

    await crs.call("array", "move", {
        source: sourceData,
        source_item: sourceData[0],
        action: "after",
        target: targetData,
        target_item: targetData[0]
    });

    assertEquals(sourceData, [{id: 'a'}, {id: 'c'}]);
    assertEquals(targetData, [{id: 'd'}, {id: 'b'}, {id: 'e'}, {id: 'f'}]);
})
