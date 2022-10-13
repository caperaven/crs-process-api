import { beforeAll} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import {ElementMock} from "../mockups/element-mock.js";
import { assertEquals, assertNotEquals, assert } from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";

await init();

beforeAll(async () => {
    await import("./../../src/action-systems/dom-interactive-actions.js");
})

Deno.test("get_animation_layer", async () => {
    const layer = await crs.call("dom_interactive", "get_animation_layer");

    assert(layer != null);
    assert(document.querySelector("#animation-layer") != null);
    assertEquals(layer.parentElement, document.body);
    assertEquals(layer.id, "animation-layer");
})

Deno.test("clear_animation_layer", async () => {
    const layer = await crs.call("dom_interactive", "get_animation_layer");
    layer.appendChild(document.createElement("div"));

    assertEquals(layer.children.length, 1);
    await crs.call("dom_interactive", "clear_animation_layer");
    assertEquals(layer.children.length, 0);
})

Deno.test("clear_animation_layer", async () => {
    const layer = await crs.call("dom_interactive", "get_animation_layer");
    assert(document.querySelector("#animation-layer") != null);

    await crs.call("dom_interactive", "remove_animation_layer");
    assert(document.querySelector("#animation-layer") == null);
})