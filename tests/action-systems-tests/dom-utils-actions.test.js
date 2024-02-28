import {beforeAll} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import {ElementMock} from "../mockups/element-mock.js";
import {assertEquals, assertNotEquals, assert} from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";

await init();

let expectedResult;
beforeAll(async () => {

    await import("./../../src/action-systems/dom-utils-actions.js");
    window.open = (url) => {
        assertEquals(url, expectedResult);
    }
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

Deno.test("find_parent_of_type - finds specified ancestor li tagname", async () => {
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

Deno.test("find_parent_of_type - stops at div tagname", async () => {
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

Deno.test("find_parent_of_type - finds specified ancestor li matches", async () => {
    // Arrange
    const element = document.createElement("span");
    element.parentElement = document.createElement("div");
    element.parentElement.parentElement = document.createElement("li");
    element.parentElement.parentElement.setAttribute("data-id", "overHere");
    element.parentElement.parentElement.queryResults["[data-id='overHere']"] = element.parentElement.parentElement;

    // Act
    const result = await crs.call("dom_utils", "find_parent_of_type", {
        element,
        nodeQuery: "[data-id='overHere']"
    });
    // Assert
    assertEquals(result.nodeName, "LI");
});

Deno.test("find_parent_of_type - stops at stopAtNodeQuery", async () => {
    // Arrange
    const element = document.createElement("span");
    element.parentElement = document.createElement("div");
    element.parentElement.setAttribute("data-id", "stop");
    element.parentElement.queryResults["[data-id='stop']"] = element.parentElement;
    element.parentElement.parentElement = document.createElement("li");
    element.parentElement.parentElement.setAttribute("data-id", "overHere");
    element.parentElement.parentElement.queryResults["[data-id='overHere']"] = element.parentElement.parentElement;

    // Act
    const result = await crs.call("dom_utils", "find_parent_of_type", {
        element,
        nodeQuery: "[data-id='overHere']",
        stopAtNodeQuery: "[data-id='stop']"
    });
    // Assert
    assertEquals(result, undefined);
});

Deno.test("find_parent_of_type - element not found", async () => {
    // Arrange
    const element = document.createElement("span");
    element.parentElement = document.createElement("div");
    element.parentElement.parentElement = document.createElement("li");

    // Act
    const result = await crs.call("dom_utils", "find_parent_of_type", {
        element,
        nodeName: "section"
    });
    // Assert
    assertEquals(result, undefined);
});

Deno.test("open_tab, should prefix url with http if prefix_http equals true" , async () => {
    // Arrange
    const url = "www.google.com";
    expectedResult = "http://www.google.com";

    // Act
    await crs.call("dom_utils", "open_tab", {
        url,
        prefix_http: true
    });
});

Deno.test("open_tab, should not prefix url with http if prefix_http equals false" , async () => {
    // Arrange
    const url = "www.google.com";
    expectedResult = "www.google.com";

    // Act
    await crs.call("dom_utils", "open_tab", {
        url,
        prefix_http: false
    });
});

Deno.test("open_tab, should not prefix url with http if prefix_http equals true but already contains a protocol" , async () => {
    // Arrange
    const url = "http://www.google.com";
    expectedResult = "http://www.google.com";

    // Act
    await crs.call("dom_utils", "open_tab", {
        url,
        prefix_http: true
    });
});

