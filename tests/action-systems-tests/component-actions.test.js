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
})
