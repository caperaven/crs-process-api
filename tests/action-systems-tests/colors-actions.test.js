import { assertEquals } from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {initRequired} from "./../mockups/init-required.js";
import {ElementMock} from "./../mockups/element.mock.js";
import "./../mockups/computed-style-mock.js";

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

Deno.test("colors - hex to rgba", async () => {
    let result = await crs.call("colors", "hex_to_rgba", { hex: "#ff0000ff" });
    assertEquals(result.r, 255);
    assertEquals(result.g, 0);
    assertEquals(result.b, 0);
    assertEquals(result.a, 255);

    result = await crs.call("colors", "hex_to_rgba", { hex: "#00ff007d" });
    assertEquals(result.r, 0);
    assertEquals(result.g, 255);
    assertEquals(result.b, 0);
    assertEquals(result.a, 125);
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

Deno.test("colors - rgba to hex", async () => {
    let result = await crs.call("colors", "rgba_to_hex", { r: 255 });
    assertEquals(result, "#ff0000ff");

    result = await crs.call("colors", "rgba_to_hex", { r: 255, g: 255, b: 255, a: 125 });
    assertEquals(result, "#ffffff7d");
})

Deno.test("colors - hex_to_normalised", async () => {
    const result = await crs.call("colors", "hex_to_normalised", { hex: "#ff007dff" });
    assertEquals(result.r, 1);
    assertEquals(result.g, 0);
    assertEquals(result.b, 0.49);
    assertEquals(result.a, 1)
})

Deno.test("colors - css_to_hex", async () => {
    const element = new ElementMock();
    element.variables = {
        "--color-hex": "#ff0000",
        "--color-rgb": "rgb(255, 0, 0)",
        "--color-rgba": "rgb(255, 0, 0, 125)"
    };

    const result = await crs.call("colors", "css_to_hex", {
        element: element,
        variables: ["--color-hex", "--color-rgb", "--color-rgba"]
    })

    assertEquals(result["--color-hex"], "#ff0000");
    assertEquals(result["--color-rgb"], "#ff0000ff");
    assertEquals(result["--color-rgba"], "#ff00007d");
})