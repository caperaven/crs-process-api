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

    assertEquals(li1.getAttribute("hidden"), undefined);
    assertEquals(li2.getAttribute("hidden"), "hidden");
    assertEquals(li3.getAttribute("hidden"), "hidden");

    await crs.call("dom_collection", "filter_children", {
        element: ul,
        filter: "b"
    })

    assertEquals(li1.getAttribute("hidden"), "hidden");
    assertEquals(li2.getAttribute("hidden"), undefined);
    assertEquals(li3.getAttribute("hidden"), "hidden");
})