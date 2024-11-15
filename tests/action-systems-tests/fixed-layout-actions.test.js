import { beforeAll, describe, it, beforeEach } from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals} from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";

await init();

beforeAll(async () => {
    await import("./../../src/action-systems/fixed-layout-actions.js");
})

describe("fixed layout tests", () => {
    let target;
    let element;
    let container;

    beforeEach(async () => {
        target = document.createElement("div");
        target.bounds = { x: 100, left: 100, y: 100, top: 100, width: 100, right: 100, height: 100, bottom: 100 };

        element = document.createElement("div");
        element.bounds = { x: 0, left: 0, y: 0, top: 0, width: 50, right: 50, height: 50, bottom: 50 };

        document.body.bounds = { x: 0, left: 0, y: 0, top: 0, width: 100, right: 100, height: 100, bottom: 100 };
    })

    it("top - left", async () => {
        await globalThis.crs.call("fixed_layout", "set", {
            element: element,
            target: target,
            at: "top",
            anchor: "left",
            margin: 10
        });

        assertEquals(element.style.position, "fixed");
        assertEquals(element.style.translate, "100px 40px")
    })

    it("top - right", async () => {
        await globalThis.crs.call("fixed_layout", "set", {
            element: element,
            target: target,
            at: "top",
            anchor: "right",
            margin: 10
        });

        assertEquals(element.style.position, "fixed");
        assertEquals(element.style.translate, "50px 40px")
    })

    it("top - middle", async () => {
        await globalThis.crs.call("fixed_layout", "set", {
            element: element,
            target: target,
            at: "top",
            anchor: "middle"
        });

        assertEquals(element.style.position, "fixed");
        assertEquals(element.style.translate, "125px 50px")
    })

    it("bottom - left", async () => {
        await globalThis.crs.call("fixed_layout", "set", {
            element: element,
            target: target,
            at: "bottom",
            anchor: "left",
            margin: 10
        });

        assertEquals(element.style.position, "fixed");
        assertEquals(element.style.translate, "100px 210px");
    })

    it("bottom - right", async () => {
        await globalThis.crs.call("fixed_layout", "set", {
            element: element,
            target: target,
            at: "bottom",
            anchor: "right",
            margin: 10
        });

        assertEquals(element.style.position, "fixed");
        assertEquals(element.style.translate, "50px 210px");
    })

    it ("left - top", async () => {
        await globalThis.crs.call("fixed_layout", "set", {
            element: element,
            target: target,
            at: "left",
            anchor: "top",
            margin: 10
        });

        assertEquals(element.style.position, "fixed");
        assertEquals(element.style.translate, "40px 100px");
    })

    it ("left - bottom", async () => {
        await globalThis.crs.call("fixed_layout", "set", {
            element: element,
            target: target,
            at: "left",
            anchor: "bottom",
            margin: 10
        });

        assertEquals(element.style.position, "fixed");
        assertEquals(element.style.translate, "40px 50px");
    })

    it ("left - middle", async () => {
        await globalThis.crs.call("fixed_layout", "set", {
            element: element,
            target: target,
            at: "left",
            anchor: "middle"
        });

        assertEquals(element.style.position, "fixed");
        assertEquals(element.style.translate, "50px 125px");
    })

    it ("right - top", async () => {
        await globalThis.crs.call("fixed_layout", "set", {
            element: element,
            target: target,
            at: "right",
            anchor: "top",
            margin: 10
        });

        assertEquals(element.style.position, "fixed");
        assertEquals(element.style.translate, "210px 100px");
    })

    it ("left - bottom", async () => {
        await globalThis.crs.call("fixed_layout", "set", {
            element: element,
            target: target,
            at: "right",
            anchor: "bottom",
            margin: 10
        });

        assertEquals(element.style.position, "fixed");
        assertEquals(element.style.translate, "210px 50px");
    })

    it ("below - point - left", async() => {
        await globalThis.crs.call("fixed_layout", "set", {
            element: element,
            point: {x: 100, y:100},
            at: "bottom",
            anchor: "left"
        })

        assertEquals(element.style.position, "fixed");
        assertEquals(element.style.translate, "100px 101px");
    })

    it ("below - point - right", async() => {
        await globalThis.crs.call("fixed_layout", "set", {
            element: element,
            point: {x: 100, y:100},
            at: "bottom",
            anchor: "right"
        })

        assertEquals(element.style.position, "fixed");
        assertEquals(element.style.translate, "51px 101px");
    })

    it ("top - point - left", async() => {
        await globalThis.crs.call("fixed_layout", "set", {
            element: element,
            point: {x: 100, y:100},
            at: "top",
            anchor: "left"
        })

        assertEquals(element.style.position, "fixed");
        assertEquals(element.style.translate, "100px 50px");
    })

    it ("top - point - right", async() => {
        await globalThis.crs.call("fixed_layout", "set", {
            element: element,
            point: {x: 100, y:100},
            at: "top",
            anchor: "right"
        })

        assertEquals(element.style.position, "fixed");
        assertEquals(element.style.translate, "51px 50px");
    })

})