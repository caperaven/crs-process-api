import { beforeAll, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import {ElementMock} from "../mockups/element-mock.js";
import { assertEquals, assertNotEquals, assert } from "https://deno.land/std@0.147.0/testing/asserts.ts";
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

    it ("group", async () => {
        const result = await crs.call("data_processing", "group", {
            source: [{value: 1, value2: 0}, {value: 2, value2: 0}, {value: 3, value2: 1}, {value: 3, value2: 1}, {value: "null", value2: 0}],
            intent: ["value", "value2"]
        });

        assertEquals(result["root"]["children"]["1"]["rows"][0], 0);
        assertEquals(result["root"]["children"]["2"]["rows"][0], 1);
        assertEquals(result["root"]["children"]["3"]["rows"][0], 2);
        assertEquals(result["root"]["children"]["3"]["rows"][1], 3);
        assertEquals(result["root"]["children"]["null"]["rows"][0], 4);
    })
})