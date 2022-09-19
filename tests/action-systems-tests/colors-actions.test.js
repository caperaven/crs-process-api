import { assertEquals } from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {initRequired} from "./../mockups/init-required.js";

await initRequired();

Deno.test("colors - hex to rgb", async () => {
    let result = await crs.call("colors", "hex_to_rgb", { hex: "#ff0000" });
    assertEquals(result.r, 255);
    assertEquals(result.g, 0);
    assertEquals(result.b, 0);

    result = await crs.call("colors", "hex_to_rgb", { hex: "#00ff00" });
    assertEquals(result.r, 0);
    assertEquals(result.g, 255);
    assertEquals(result.b, 0);

    result = await crs.call("colors", "hex_to_rgb", { hex: "#0000ff" });
    assertEquals(result.r, 0);
    assertEquals(result.g, 0);
    assertEquals(result.b, 255);
})