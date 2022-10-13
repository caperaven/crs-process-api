import { beforeAll} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import {ElementMock} from "../mockups/element-mock.js";
import { assertEquals, assertNotEquals, assert } from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";

await init();

beforeAll(async () => {
    await import("./../../src/action-systems/dom-utils-actions.js");
})

Deno.test("call_on_element", async () => {
    let called = false;
    let calledArgs1 = null;
    let calledArgs2 = null;

    const element = new ElementMock("div");
    element.fn = (args1, args2) => {
        called = true;
        calledArgs1 = args1;
        calledArgs2 = args2;
    }

    await crs.call("dom_utils", "call_on_element", {
        element: element,
        action: "fn",
        parameters: ["arg1", "arg2"]
    })

    assertEquals(called, true);
    assertEquals(calledArgs1, "arg1");
    assertEquals(calledArgs2, "arg2");
})