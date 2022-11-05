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
        ],
        variables: {
            "--cl-color": "blue"
        }
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
    assertEquals(element.style.getPropertyValue("--cl-color"), "blue");
})

Deno.test("remove_element", async () => {
    const element = await crs.call("dom", "create_element", { parent: document.body });
    assertEquals(document.body.children.length, 1);

    await crs.call("dom", "remove_element", {element: element});
    assertEquals(document.body.children.length, 0);

    await crs.call("dom", "create_element", { parent: document.body, id: "item1" });
    assertEquals(document.body.children.length, 1);
    await crs.call("dom", "remove_element", {element: "#item1"});
    assertEquals(document.body.children.length, 0);
})

Deno.test("clear_element", async () => {
    await crs.call("dom", "create_element", { parent: document.body });
    await crs.call("dom", "create_element", { parent: document.body });
    await crs.call("dom", "create_element", { parent: document.body });
    assertEquals(document.body.children.length, 3);

    await crs.call("dom", "clear_element", {
        element: document.body
    })
    assertEquals(document.body.children.length, 0);
})

Deno.test("move_element", async () => {
    const target = document.createElement("div");
    const element = document.createElement("div");
    document.body.appendChild(element);

    assertEquals(target.children.length, 0);
    assertEquals(document.body.children.length, 1);

    await crs.call("dom", "move_element", {
        element: element,
        target: target
    })

    assertEquals(target.children.length, 1);
    assertEquals(document.body.children.length, 0);
})

Deno.test("move element up and down", async () => {
    document.body.appendChild(document.createElement("div1"));
    document.body.appendChild(document.createElement("div2"));
    document.body.appendChild(document.createElement("div3"));
    document.body.appendChild(document.createElement("div4"));
    document.body.appendChild(document.createElement("div5"));

    const element = document.body.children[0];
    await crs.call("dom", "move_element_down", {
        element: element
    })
    assertEquals(document.body.children.indexOf(element), 1);

    await crs.call("dom", "move_element_down", {
        element: element
    })
    assertEquals(document.body.children.indexOf(element), 2);

    await crs.call("dom", "move_element_up", {
        element: element
    })
    assertEquals(document.body.children.indexOf(element), 1);

    await crs.call("dom", "move_element_up", {
        element: element
    })
    assertEquals(document.body.children.indexOf(element), 0);
})

Deno.test("css variables - get and set", async () => {
    const element = document.createElement("div");

    await crs.call("dom", "set_css_variable", {
        element: element,
        variable: "--background",
        value: "blue"
    })

    assertEquals(element.style["--background"], "blue");

    element.style["--background"] = "red";
    const value = await crs.call("dom", "get_css_variable", {
        element: element,
        variable: "--background"
    })

    assertEquals(value, "red");
})

Deno.test("css variables get and set multiple", async () => {
    const element = document.createElement("div");

    await crs.call("dom", "set_css_variables", {
        element: element,
        variables: {
            "--background": "blue",
            "--color": "white"
        }
    })

    assertEquals(element.style["--background"], "blue");
    assertEquals(element.style["--color"], "white");

    element.style["--background"] = "red";
    element.style["--color"] = "green";

    const result = await crs.call("dom", "get_css_variables", {
        element: element,
        variables: ["--background", "--color"]
    })

    assertEquals(result[0], "red");
    assertEquals(result[1], "green");
})