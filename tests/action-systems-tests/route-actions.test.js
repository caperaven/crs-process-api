import { beforeAll, describe, it, beforeEach, afterAll } from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assertExists } from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";

await init();

beforeAll(async () => {
    await import("./../../src/action-systems/route-actions.js");
    await import("./../../src/action-systems/dom-observer-actions.js");
    await crs.call("route", "register", {
        definition: {
            parameters: {
                0: "connection",
                1: "environment",
                2: "view"
            }
        }
    });
})

afterAll(async () => {
    await crs.call("route", "dispose", {});
})

describe("route actions tests", async () => {
    it("register", async () => {
        assertExists(globalThis.routeManager);
    })

    it ("parse", async () => {
        const result = await crs.call("route", "parse", {
            url: "https://www.google.com/connection/en-us/search?q=crs"
        });

        assertEquals(result, {
            protocol: "https",
            host: "www.google.com",
            params: {
                "connection"  : "connection",
                "environment" : "en-us",
                "view"        : "search"
            },
            query: {
                "q": "crs"
            }
        })
    })
})