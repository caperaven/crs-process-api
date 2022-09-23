import { assertEquals } from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {initRequired} from "./../mockups/init-required.js";

await initRequired();

Deno.test("math - normalize", async () => {
    assertEquals(await crs.call("math", "normalize", { value: 10, min: 0, max: 100 }), 0.1);
    assertEquals(await crs.call("math", "normalize", { value: 50, min: 0, max: 100 }), 0.5);
    assertEquals(await crs.call("math", "normalize", { value: 100, min: 0, max: 100 }), 1);
})