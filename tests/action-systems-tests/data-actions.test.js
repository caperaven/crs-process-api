import { beforeAll} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import {ElementMock} from "../mockups/element-mock.js";
import { assertEquals, assertNotEquals, assert } from "https://deno.land/std@0.147.0/testing/asserts.ts";
import "./../mockups/init.js";

beforeAll(async () => {
    await import("./../../src/action-systems/data-actions.js");
});

Deno.test("convert iso8601 value", async () => {
    let value1 = "PT5H30M";
    let value2 = "P1DT12H";
    let value3 = "PT2H15M30S";

    const element = new ElementMock("div");

    let result1 = await crs.call("data", "iso8601_to_string",{
        value: value1
    })

    element.innerHTML = result1;

    console.log(element.innerHTML);
    assertEquals(element.innerHTML, "0:5:30:0");

    let result2 = await crs.call("data", "iso8601_to_string",{
        value: value2
    });

    const element2 = new ElementMock("div");
    element2.innerHTML = result2;
    assertEquals(element2.innerHTML, "1:12:0:0");

    let result3 = await crs.call("data", "iso8601_to_string",{
        value: value3
    });

    const element3 = new ElementMock("div");
    element3.innerHTML = result3;
    assertEquals(element3.innerHTML, "0:2:15:30");
});