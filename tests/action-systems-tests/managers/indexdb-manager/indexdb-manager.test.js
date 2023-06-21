import "https://deno.land/x/indexeddb@v1.1.0/polyfill_memory.ts";
import { beforeAll, describe, it, beforeEach } from "https://deno.land/std@0.157.0/testing/bdd.ts";
import {assertEquals} from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {init} from "./../../../mockups/init.js";

await init();

beforeAll(async () => {
    // import("./../../../../src/action-systems/managers/indexdb-manager.js");
});

describe("IndexDB manager tests", () => {
    it("connect", async () => {
        assertEquals(true, true)
    })
})