import { beforeAll} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import {ElementMock} from "../mockups/element-mock.js";
import { assertEquals, assertNotEquals } from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";

await init();

beforeAll(async () => {
    await import("./../../src/action-systems/dom-actions.js");
})

Deno.test("set_attribute", async () => {
    const element = new ElementMock("div");
    await crs.call("dom", "set_attribute", {
        element: element,
        attr: "test",
        value: "hello world"
    });

    const attr = element.getAttribute("test");
    assertEquals(attr, "hello world");
})

Deno.test("get_attribute", async () => {
    const element = new ElementMock("div");
    element.setAttribute("test", "hello world");

    const attr = await crs.call("dom", "get_attribute", {
        element: element,
        attr: "test",
        value: "hello world"
    });

    assertEquals(attr, "hello world");
})

Deno.test("add_class", async () => {
    const element = new ElementMock("div");
    await crs.call("dom", "add_class", {
        element: element,
        value: "blue"
    })

    const hasBlue = element.classList.contains("blue");
    assertEquals(hasBlue, true);
})

Deno.test("remove_class", async () => {
    const element = new ElementMock("div");
    element.classList.add("blue");
    assertEquals(element.classList.contains("blue"), true);

    await crs.call("dom", "remove_class", {
        element: element,
        value: "blue"
    })

    assertEquals(element.classList.contains("blue"), false);
})
