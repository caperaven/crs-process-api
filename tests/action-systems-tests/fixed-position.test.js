import { beforeAll, describe, it, beforeEach } from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals} from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";

await init();

const bounds = { x: 0, left: 0, y: 0, top: 0, width: 50, right: 50, height: 50, bottom: 50 };

beforeAll(async () => {
    await import("./../../src/action-systems/fixed-position-actions.js");
    globalThis.innerWidth = 1000;
    globalThis.innerHeight = 1000;
})

describe("fixed position tests", () => {
    it ("top - left", async () => {
        const element = document.createElement("div");
        element.bounds = bounds;
        await crs.call("fixed_position", "set", { element: element, position: "top-left", margin: 10});

        assertEquals(element.style.position, "fixed");
        assertEquals(element.style.translate, "10px 10px");
    })

    it ("top - center", async () => {
        const element = document.createElement("div");
        element.bounds = bounds;
        await crs.call("fixed_position", "set", { element: element, position: "top-center", margin: 10});

        assertEquals(element.style.position, "fixed");
        assertEquals(element.style.translate, "475px 10px");
    })

    it ("top - right", async () => {
        const element = document.createElement("div");
        element.bounds = bounds;
        await crs.call("fixed_position", "set", { element: element, position: "top-right", margin: 10});

        assertEquals(element.style.position, "fixed");
        assertEquals(element.style.translate, "940px 10px");
    })

    it ("bottom - left", async () => {
        const element = document.createElement("div");
        element.bounds = bounds;
        await crs.call("fixed_position", "set", { element: element, position: "bottom-left", margin: 10});

        assertEquals(element.style.position, "fixed");
        assertEquals(element.style.translate, "10px 940px");
    })

    it ("bottom - center", async () => {
        const element = document.createElement("div");
        element.bounds = bounds;
        await crs.call("fixed_position", "set", { element: element, position: "bottom-center", margin: 10});

        assertEquals(element.style.position, "fixed");
        assertEquals(element.style.translate, "475px 940px");
    })

    it ("bottom - right", async () => {
        const element = document.createElement("div");
        element.bounds = bounds;
        await crs.call("fixed_position", "set", { element: element, position: "bottom-right", margin: 10});

        assertEquals(element.style.position, "fixed");
        assertEquals(element.style.translate, "940px 940px");
    })
})


