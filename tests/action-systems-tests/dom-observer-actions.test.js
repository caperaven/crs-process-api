import { beforeAll} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.147.0/testing/asserts.ts";
import "./../mockups/init.js";

beforeAll(async () => {
    globalThis.ResizeObserver = class ResizeObserver {
        constructor() {
            this.elements = []
        }

        observe(element) {
            this.elements.push(element);
        }

        disconnect() {}
    }
    await import("./../../src/action-systems/dom-observer-actions.js");
});

Deno.test("observe_resize", async () => {
    const element = document.createElement("div");
    const callback = (entry) => {
        console.log(entry);
    }
    await crs.call("dom_observer", "observe_resize", {
        element: element,
        callback: callback
    });

    assert(element.__resizeObserver);
    assert(element.__resizeObserver.elements.indexOf(element) > -1);
});

Deno.test("unobserve_resize", async () => {
    const element = document.createElement("div");
    const callback = (entry) => {
        console.log(entry);
    }
    await crs.call("dom_observer", "observe_resize", {
        element: element,
        callback: callback
    });

    await crs.call("dom_observer", "unobserve_resize", {
        element: element
    });

    assertEquals(element.__resizeObserver, undefined);
});

