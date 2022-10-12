import { beforeAll} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals } from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";

await init();

beforeAll(async () => {
    await import("./../../src/action-systems/styles-actions.js");
})

Deno.test("load / unload css file", async () => {
    await crs.call("styles", "load_file", { id: "test", file: "test.css" });
    await crs.call("styles", "load_file", { id: "test", file: "test.css" });

    assertEquals(document.head.children.length, 1);

    await crs.call("styles", "unload_file", { id: "test" });
    assertEquals(document.head.children.length, 0);
})