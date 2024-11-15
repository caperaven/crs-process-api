import { assertEquals, assertThrowsAsync } from "https://deno.land/std@0.114.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";
await init();

// Mocking the global window object
globalThis.location = {
    hash :""
};

Deno.test("UrlActions.set_hash - sets the correct hash", async () => {
    await crs.call("url", "set_hash", {
        hash: "page?param1=${param1}&param2=${param2}",
        parameters: {
            param1: "value1",
            param2: "value2"
        }
    });

    assertEquals(globalThis.location.hash, "page?param1=value1&param2=value2");
});

Deno.test("UrlActions.set_hash - throws error if hash is missing", async () => {
    await assertThrowsAsync(async () => {
        await crs.call("url", "set_hash", {
            parameters: {
                param1: "value1",
                param2: "value2"
            }
        });
    });
});

Deno.test("UrlActions.get_hash_search_parameters - gets the search parameters from the hash", async () => {
    globalThis.location.hash = "page?param1=value1&param2=value2";

    const searchParameters = await crs.call("url", "get_hash_search_parameters", {});
    assertEquals(searchParameters, {
        param1: "value1",
        param2: "value2"
    });
});

Deno.test("UrlActions.get_hash_search_parameters - should not fail if no search", async () => {
    globalThis.location.hash = "";

    const searchParameters = await crs.call("url", "get_hash_search_parameters", {});
    assertEquals(searchParameters, {});
});
