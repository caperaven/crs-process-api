import {beforeAll} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import {ElementMock} from "../mockups/element-mock.js";
import {assertEquals, assertNotEquals, assert} from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";

await init();

beforeAll(async () => {
    await import("./../../src/action-systems/dom-collection-actions.js");
})

Deno.test("filter", async () => {
    const ul = document.createElement("ul");
    const li1 = await crs.call("dom", "create_element", {parent: ul, tag_name: "li", dataset: {tags: ["a"]}});
    const li2 = await crs.call("dom", "create_element", {parent: ul, tag_name: "li", dataset: {tags: ["b"]}});
    const li3 = await crs.call("dom", "create_element", {parent: ul, tag_name: "li", dataset: {tags: ["c"]}});

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


Deno.test("toggle_selection on one child selected: multiple = false", async () => {

    // Arrange
    const divElement = await crs.call("dom", "create_element", {
        children: [
            {"tag_name": "div"},
            {"tag_name": "div"},
            {"tag_name": "div"}
        ]
    });

    // Act
    await crs.call("dom_collection", "toggle_selection", {
        target: divElement.children[0],
        multiple: false
    });

    // Assert
    assertEquals(divElement.children[0].getAttribute("aria-selected"), "true");
    assertEquals(divElement.children[1].getAttribute("aria-selected"), undefined);
    assertEquals(divElement.children[2].getAttribute("aria-selected"), undefined);

});

Deno.test("toggle_selection remove selected state from target child selected: multiple = true", async () => {
    // Arrange
    const divElement = await crs.call("dom", "create_element", {
        children: [
            {"tag_name": "div"},
            {"tag_name": "div"},
            {"tag_name": "div"}
        ]
    });

    // Act
    await crs.call("dom_collection", "toggle_selection", {
        target: divElement.children[0],
        multiple: false
    });

    // Assert
    assertEquals(divElement.children[0].getAttribute("aria-selected"), "true");

    await crs.call("dom_collection", "toggle_selection", {
        target: divElement.children[0],
        multiple: true
    });

    // Assert
    assertEquals(divElement.children[0].getAttribute("aria-selected"), undefined);
    assertEquals(divElement.children[1].getAttribute("aria-selected"), undefined);
    assertEquals(divElement.children[2].getAttribute("aria-selected"), undefined);


});

Deno.test("toggle_selection add selected state to multiple target children selected: multiple = true", async () => {
    // Arrange
    const divElement = await crs.call("dom", "create_element", {
        children: [
            {"tag_name": "div"},
            {"tag_name": "div"},
            {"tag_name": "div"}
        ]
    });

    // Act
    await crs.call("dom_collection", "toggle_selection", {
        target: divElement.children[1],
        multiple: true
    });

    await crs.call("dom_collection", "toggle_selection", {
        target: divElement.children[2],
        multiple: true
    });

    // Assert
    assertEquals(divElement.children[0].getAttribute("aria-selected"), undefined);
    assertEquals(divElement.children[1].getAttribute("aria-selected"), "true");
    assertEquals(divElement.children[2].getAttribute("aria-selected"), "true");
});

Deno.test("get_selected_state", async () => {

    // Arrange
    const divElement = await crs.call("dom", "create_element", {
        children: [
            {"tag_name": "div", "attributes": {"aria-selected": true}},
            {"tage_name": "div"},
            {"tag_name": "div"}
        ]
    });

    // Act
    const result = await crs.call("dom_collection", "get_selected_state", {
        target: divElement
    });

    // Assert
    assertEquals(result, {});
});

