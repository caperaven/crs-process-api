import { beforeAll, describe, it, beforeEach, afterAll } from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assertExists } from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";

await init();

let changeDef = null;
let stateDef = null;

globalThis.location = {
    href: ""
}

globalThis.requestAnimationFrame = (callback) => callback();
globalThis.history = {
    pushState: (state, title, url) => {
        stateDef = {state, url}
    }
}

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
        },
        callback: async (def) => changeDef = def
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
            url: "https://www.google.com/connection/en-us/search?q=crs&id=1000"
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
                "q": "crs",
                "id": "1000"
            }
        })
    })

    it ("create_url", async () => {
        const result = await crs.call("route", "create_url", {
            definition: {
                protocol: "https",
                host: "www.google.com",
                params: {
                    "connection"  : "connection",
                    "environment" : "en-us",
                    "view"        : "search"
                },
                query: {
                    "q": "crs",
                    "id": "1000"
                }
            }
        });

        assertEquals(result, "https://www.google.com/connection/en-us/search?q=crs&id=1000");
    })

    it ("goto", async () => {
        const definition = {
            protocol: "https",
            host: "www.google.com",
            params: {
                "connection"  : "connection",
                    "environment" : "en-us",
                    "view"        : "search"
            },
            query: {
                "q": "crs",
                "id": "1000"
            }
        }

        await crs.call("route", "goto", { definition });

        assertEquals(changeDef, definition);
        assertEquals(stateDef.url, "https://www.google.com/connection/en-us/search?q=crs&id=1000");
        assertEquals(stateDef.state, { search: { q: "crs", id: "1000" } });
    })

    it ("goto using string path", async () => {
        await crs.call("route", "goto", {
            definition: "https://www.google.com/connection/en-us/search?q=crs&id=2000"
        })

        assertEquals(stateDef.url, "https://www.google.com/connection/en-us/search?q=crs&id=2000");
        assertEquals(stateDef.state, { search: { q: "crs", id: "2000" } });
    })

    it ("set_parameters", async () => {
        await crs.call("route", "goto", {
            definition: {
                protocol: "https",
                host: "www.google.com",
                params: {
                    "connection"  : "connection",
                    "environment" : "en-us",
                    "view"        : "search"
                },
                query: {
                    "q": "crs",
                    "id": "1000"
                }
            }
        });

        await crs.call("route", "set_parameters", {
            parameters: {
                "connection"  : "new_connection",
                "environment" : "new_environment",
                "view"        : "new_view"
            }
        })

        const parameters = globalThis.routeManager.routeDefinition.params;
        assertEquals(parameters.connection, "new_connection");
        assertEquals(parameters.environment, "new_environment");
        assertEquals(parameters.view, "new_view");
    })

    it ("set_queries", async () => {
        await crs.call("route", "set_queries", {
            queries: {
                id: "2000"
            },
            refresh: true
        })

        const queries = globalThis.routeManager.routeDefinition.query;
        assertEquals(queries.id, "2000");
    })
})