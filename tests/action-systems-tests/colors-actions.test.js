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

Deno.test("colors - rgb to hex", async () => {
    let result = await crs.call("colors", "rgb_to_hex", { r: 255 });
    assertEquals(result, "#ff0000");

    result = await crs.call("colors", "rgb_to_hex", { g: 255 });
    assertEquals(result, "#00ff00");

    result = await crs.call("colors", "rgb_to_hex", { b: 255 });
    assertEquals(result, "#0000ff");

    result = await crs.call("colors", "rgb_to_hex", { r: 255, g: 255, b: 255 });
    assertEquals(result, "#ffffff");
})