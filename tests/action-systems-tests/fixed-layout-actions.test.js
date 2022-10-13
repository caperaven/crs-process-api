import { beforeAll, describe, it, beforeEach } from "https://deno.land/std@0.157.0/testing/bdd.ts";
import {ElementMock} from "../mockups/element-mock.js";
import { assertEquals, assertNotEquals, assert } from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";

await init();

beforeAll(async () => {
    await import("./../../src/action-systems/fixed-layout-actions.js");
})

describe("fixed layout tests", () => {
    let target;
    let element;

    beforeEach(async () => {
        target = document.createElement("div");
        target.bounds = { x: 0, y: 0, width: 100, height: 100 };

        element = document.createElement("div");
        element.bounds = { x: 0, y: 0, width: 50, height: 50 };
    })

    it("top - left", async () => {
        await crs.call("fixed_layout", "set", {
            element: element,
            target: target,
            at: "top",
            anchor: "left",
            margin: 10
        });

        assertEquals(element.style.position, "fixed");
    })
})