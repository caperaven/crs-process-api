import {beforeAll} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import {ElementMock} from "../mockups/element-mock.js";
import {assertEquals, assertNotEquals, assert} from "https://deno.land/std@0.147.0/testing/asserts.ts";
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
});

Deno.test("find_parent_of_type - finds specified ancestor li", async () => {
    // Arrange
    const element = document.createElement("span");
    element.parentElement = document.createElement("div");
    element.parentElement.parentElement = document.createElement("li");
    // Act
    const result = await crs.call("dom_utils", "find_parent_of_type", {
       element,
       nodeName: "li"
    });
    // Assert
    assertEquals(result.nodeName, "LI");
});

Deno.test("find_parent_of_type - stops at div", async () => {
    // Arrange
    const element = document.createElement("span");
    element.parentElement = document.createElement("div");
    element.parentElement.parentElement = document.createElement("li");
    // Act
    const result = await crs.call("dom_utils", "find_parent_of_type", {
        element,
        nodeName: "li",
        stopAtNodeName: "div"
    });
    // Assert
    assertEquals(result, undefined);
});