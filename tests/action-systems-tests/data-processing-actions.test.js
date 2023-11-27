import { beforeAll, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import {ElementMock} from "../mockups/element-mock.js";
import { assertEquals, assertExists, assert } from "https://deno.land/std@0.147.0/testing/asserts.ts";
import "./../mockups/init.js";

beforeAll(async () => {
    await import("./../../src/action-systems/data-processing-actions.js");
})

describe("data processing actions tests", () => {
    it ("unique values", async () => {
        const result = await crs.call("data_processing", "unique_values", {
            source: [{value: 1}, {value: 2}, {value: 3}, {value: 3}, {value: null}],
            fields: ["value"]
        });

        assertEquals(result["value"]["1"], 1);
        assertEquals(result["value"]["2"], 1);
        assertEquals(result["value"]["3"], 2);
        assertEquals(result["value"]["null"], 1);
    });

    it ("filter", async () => {
        const result = await crs.call("data_processing", "filter", {
            source: [{value: 1}, {value: 2}, {value: 3}, {value: 3}, {value: null}],
            intent: {field: "value", operator: "eq", value: 3},
            case_sensitive: false
        });

        assertEquals(result.length, 2);
        assertEquals(result[0], 2);
        assertEquals(result[1], 3);
    })

    it ("filter - neq", async () => {
        const result = await crs.call("data_processing", "filter", {
            source: [{value: 1}, {value: 2}, {value: 3}, {value: 3}, {value: null}],
            intent: {field: "value", operator: "neq", value: 3},
            case_sensitive: false
        });

        assertEquals(result.length, 3);
        assertEquals(result[0], 0);
        assertEquals(result[1], 1);
        assertEquals(result[2], 4);
    })

    it ("filter - gt", async () => {
        const result = await crs.call("data_processing", "filter", {
            source: [{value: 1}, {value: 2}, {value: 3}, {value: 3}, {value: null}],
            intent: {field: "value", operator: "gt", value: 2},
            case_sensitive: false
        });

        assertEquals(result.length, 2);
        assertEquals(result[0], 2);
        assertEquals(result[1], 3);
    })

    it ("filter - lt", async () => {
        const result = await crs.call("data_processing", "filter", {
            source: [{value: 1}, {value: 2}, {value: 3}, {value: 3}, {value: null}],
            intent: {field: "value", operator: "lt", value: 3},
            case_sensitive: false
        });

        assertEquals(result.length, 2);
        assertEquals(result[0], 0);
        assertEquals(result[1], 1);
    })

    it ("filter - ge", async () => {
        const result = await crs.call("data_processing", "filter", {
            source: [{value: 1}, {value: 2}, {value: 3}, {value: 3}, {value: null}],
            intent: {field: "value", operator: "ge", value: 3},
            case_sensitive: false
        });

        assertEquals(result.length, 2);
        assertEquals(result[0], 2);
        assertEquals(result[1], 3);
    })

    it ("filter - le", async () => {
        const result = await crs.call("data_processing", "filter", {
            source: [{value: 1}, {value: 2}, {value: 3}, {value: 3}, {value: null}],
            intent: {field: "value", operator: "le", value: 2},
            case_sensitive: false
        });

        assertEquals(result.length, 2);
        assertEquals(result[0], 0);
        assertEquals(result[1], 1);
    })

    it ("filter - is null", async () => {
        const result = await crs.call("data_processing", "filter", {
            source: [{value: 1}, {value: 2}, {value: 3}, {value: 3}, {value: null}],
            intent: {field: "value", operator: "is_null"},
            case_sensitive: false
        });

        assertEquals(result.length, 1);
        assertEquals(result[0], 4);
    })

    it ("filter - not null", async () => {
        const result = await crs.call("data_processing", "filter", {
            source: [{value: 1}, {value: 2}, {value: 3}, {value: 3}, {value: null}],
            intent: {field: "value", operator: "not_null"},
            case_sensitive: false
        });

        assertEquals(result.length, 4);
        assertEquals(result[0], 0);
        assertEquals(result[1], 1);
        assertEquals(result[2], 2);
        assertEquals(result[3], 3);
    })

    it ("filter - like %value", async () => {
        const result = await crs.call("data_processing", "filter", {
            source: [{value: "alpha"}, {value: "beta"}, {value: "delta"}],
            intent: {field: "value", operator: "like", value: "%a"},
            case_sensitive: false
        });

        assertEquals(result.length, 1);
        assertEquals(result[0], 0);
    })

    it ("filter - like value%", async () => {
        const result = await crs.call("data_processing", "filter", {
            source: [{value: "alpha"}, {value: "beta"}, {value: "delta"}],
            intent: {field: "value", operator: "like", value: "a%"},
            case_sensitive: false
        });

        assertEquals(result.length, 3);
        assertEquals(result[0], 0);
        assertEquals(result[1], 1);
        assertEquals(result[2], 2);
    })

    it ("filter - like %value%", async () => {
        const result = await crs.call("data_processing", "filter", {
            source: [{value: "alpha"}, {value: "beta"}, {value: "delta"}],
            intent: {field: "value", operator: "like", value: "%l%"},
            case_sensitive: false
        });

        assertEquals(result.length, 2);
        assertEquals(result[0], 0);
        assertEquals(result[1], 2);
    })

    it ("filter - contains value", async () => {
        const result = await crs.call("data_processing", "filter", {
            source: [{value: "alpha"}, {value: "beta"}, {value: "delta"}],
            intent: {field: "value", operator: "contains", value: "ta"},
            case_sensitive: false
        });

        assertEquals(result.length, 2);
        assertEquals(result[0], 1);
        assertEquals(result[1], 2);
    })

    it ("filter - in value", async () => {
        const result = await crs.call("data_processing", "filter", {
            source: [{value: "alpha"}, {value: "beta"}, {value: "delta"}],
            intent: {field: "value", operator: "in", value: ["test1", "alpha", "test2"]},
            case_sensitive: false
        });

        assertEquals(result.length, 1);
        assertEquals(result[0], 0);
    })

    it ("filter - between", async () => {
        const result = await crs.call("data_processing", "filter", {
            source: [{value: 1}, {value: 2}, {value: 3}],
            intent: {field: "value", operator: "between", value: [1, 3]},
            case_sensitive: false
        });

        assertEquals(result.length, 1);
        assertEquals(result[0], 1);
    })

    it ("filter - starts_with", async () => {
        const result = await crs.call("data_processing", "filter", {
            source: [{value: "alpha"}, {value: "beta"}, {value: "delta"}],
            intent: {field: "value", operator: "starts_with", value: "al"},
            case_sensitive: false
        });

        assertEquals(result.length, 1);
        assertEquals(result[0], 0);
    })

    it ("filter - ends_with", async () => {
        const result = await crs.call("data_processing", "filter", {
            source: [{value: "alpha"}, {value: "beta"}, {value: "delta"}],
            intent: {field: "value", operator: "ends_with", value: "ta"},
            case_sensitive: false
        });

        assertEquals(result.length, 2);
        assertEquals(result[0], 1);
        assertEquals(result[1], 2);
    })

    it ("group", async () => {
        const result = await crs.call("data_processing", "group", {
            source: [{value: 1, value2: 0}, {value: 2, value2: 0}, {value: 3, value2: 1}, {value: 3, value2: 1}, {value: "null", value2: 0}],
            intent: ["value", "value2"]
        });

        assertExists(result);
        assertExists(result["root"]);
    })

    it ("get_perspective", async () => {
        const people = [
            { "id": 1, "name": "John", "lastName": "Doe", "age": 10 },
            { "id": 2, "name": "Andrew", "lastName": "Smith", "age": 20 },
            { "id": 3, "name": "Suzy", "lastName": "Doe", "age": 12 }
        ]

        const result = await crs.call("data_processing", "get_perspective", {
            source: people,
            intent: {
                filter: { field: "lastName", operator: "eq", value: "Doe" },
                sort: ["age:dec"]
            }
        });

        assertEquals(result, [2, 0]);
    });
})