import { beforeAll} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import {ElementMock} from "../mockups/element-mock.js";
import { assertEquals, assertNotEquals, assert } from "https://deno.land/std@0.147.0/testing/asserts.ts";
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

Deno.test("set_style", async () => {
    const element = new ElementMock("div");

    await crs.call("dom", "set_style", {
        element: element,
        style: "background",
        value: "blue"
    })

    assertEquals(element.style.background, "blue");
})

Deno.test("set_styles", async () => {
    const element = new ElementMock("div");

    await crs.call("dom", "set_styles", {
        element: element,
        styles: {
            background: "blue",
            color: "white"
        }
    })

    assertEquals(element.style.background, "blue");
    assertEquals(element.style.color, "white");
})

Deno.test("set_text", async () => {
    const element = new ElementMock("div");

    await crs.call("dom", "set_text", {
        element: element,
        value: "Hello World"
    })

    assertEquals(element.textContent, "Hello World");
})

Deno.test("get_text", async () => {
    const element = new ElementMock("div");
    element.textContent = "Hello World";

    const text = await crs.call("dom", "get_text", {
        element: element
    })

    assertEquals(text, "Hello World");
})

Deno.test("create_element", async () => {
    const parent = new ElementMock("div");
    const element = await crs.call("dom", "create_element", {
        parent: parent,
        tag_name: "label",
        attributes: {
            for: "edtFirstName"
        },
        styles: {
            background: "blue"
        },
        classes: ["italic"],
        dataset: {
            id: "lblFirstName"
        },
        text_content: "First Name",
        children: [
            {
                tag_name: "input"
            }
        ]
    });

    assert(element != null);
    assertEquals(parent.children.length, 1);
    assertEquals(element.nodeName, "LABEL");
    assertEquals(element.getAttribute("for"), "edtFirstName");
    assertEquals(element.style.background, "blue");
    assertEquals(element.classList.contains("italic"), true);
    assertEquals(element.dataset.id, "lblFirstName");
    assertEquals(element.textContent, "First Name");
    assertEquals(element.children.length, 1);
    assertEquals(element.children[0].nodeName, "INPUT");
})