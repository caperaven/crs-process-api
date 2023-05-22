import { beforeAll, describe, it, beforeEach } from "https://deno.land/std@0.157.0/testing/bdd.ts";
import {ElementMock} from "../mockups/element-mock.js";
import { assertEquals, assertNotEquals, assert } from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";

await init();

beforeAll(async () => {
    await import("./../../src/action-systems/component-actions.js");
})

describe("component actions tests", async () => {
    it ("notify_ready", async () => {
        let isReady = false;
        const element = new ElementMock("div");
        element.addEventListener("ready", () => isReady = true);

        await crs.call("component", "notify_ready", {
            element: element
        })

        assertEquals(element.dataset.ready, "true");
        assertEquals(isReady, true);
    })

    it ("observe / unobserve", async () => {
        let isCalled = false;

        const element = new ElementMock("div");
        const id = await crs.call("component", "observe", {
            element: element,
            properties: ["p1", "p2"],
            callback: () => isCalled = true
        })

        assert(element._dataId != null);
        assert(element._processObserver != null);
        assert(element._processObserver["0"] != null);

        await crs.binding.data.setProperty(element._dataId, "p1", "a");
        assertEquals(isCalled, false);

        await crs.binding.data.setProperty(element._dataId, "p2", "b");
        assertEquals(isCalled, true);

        await crs.call("component", "unobserve", {
            element: element,
            ids: [id]
        })

        assert(element._processObserver["0"] == null);
    })
})
