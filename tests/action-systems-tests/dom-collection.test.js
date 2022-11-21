import { beforeAll} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import {ElementMock} from "../mockups/element-mock.js";
import { assertEquals, assertNotEquals, assert } from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";

await init();

beforeAll(async () => {
    await import("./../../src/action-systems/dom-collection-actions.js");
})

Deno.test("filter", async () => {
    const ul = document.createElement("ul");
    const li1 = await crs.call("dom", "create_element", { parent: ul, tag_name: "li", dataset: { tags: ["a"] }});
    const li2 = await crs.call("dom", "create_element", { parent: ul, tag_name: "li", dataset: { tags: ["b"] }});
    const li3 = await crs.call("dom", "create_element", { parent: ul, tag_name: "li", dataset: { tags: ["c"] }});

    assertEquals(li1.getAttribute("hidden"), undefined);
    assertEquals(li2.getAttribute("hidden"), undefined);
    assertEquals(li3.getAttribute("hidden"), undefined);

    await crs.call("dom_collection", "filter_children", {
        element: ul,
        filter: "a"
    })

    assertEquals(li1.getAttribute("aria-hidden"), undefined);
    assertEquals(li2.getAttribute("aria-hidden"), "true");
    assertEquals(li3.getAttribute("aria-hidden"), "true");

    await crs.call("dom_collection", "filter_children", {
        element: ul,
        filter: "b"
    })

    assertEquals(li1.getAttribute("aria-hidden"), "true");
    assertEquals(li2.getAttribute("aria-hidden"), undefined);
    assertEquals(li3.getAttribute("aria-hidden"), "true");
});

Deno.test("toggle_selection", async () => {
    const divElementParent = document.createElement("div");

    const childElement1 = await crs.call("dom", "create_element", {"parent": divElementParent, "tag_name": "div", "attributes":{"aria-selected": "true"}});
    const childElement2 = await crs.call("dom", "create_element", {"parent": divElementParent, "tag_name": "div"});
    const childElement3 = await crs.call("dom", "create_element", {"parent": divElementParent, "tag_name": "div"});

    assertEquals(childElement1.getAttribute("aria-selected"), "true");
    assertEquals(childElement2.getAttribute("aria-selected"), undefined);

    await crs.call("dom_collection", "toggle_selection", {
        target: childElement3
    });

    assertEquals(childElement3.getAttribute("aria-selected"), "true");
    assertEquals(childElement1.getAttribute("aria-selected"), undefined);
    assertEquals(childElement2.getAttribute("aria-selected"), undefined);

    await crs.call("dom_collection", "toggle_selection", {
        target: childElement2
    });

    assertEquals(childElement2.getAttribute("aria-selected"), "true");
    assertEquals(childElement1.getAttribute("aria-selected"), undefined);
    assertEquals(childElement3.getAttribute("aria-selected"), undefined);
});