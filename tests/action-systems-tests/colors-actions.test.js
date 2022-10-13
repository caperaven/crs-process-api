import { assertEquals } from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {ElementMock} from "../mockups/element-mock.js";
import {init} from "./../mockups/init.js";

await init();

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

    element.style["--color-hex"] = "#ff0000";
    element.style["--color-rgb"] = "rgb(255, 0, 0)";
    element.style["--color-rgba"] = "rgb(255, 0, 0, 125)";

    const result = await crs.call("colors", "css_to_hex", {
        element: element,
        variables: ["--color-hex", "--color-rgb", "--color-rgba"]
    })

    assertEquals(result["--color-hex"], "#ff0000ff");
    assertEquals(result["--color-rgb"], "#ff0000ff");
    assertEquals(result["--color-rgba"], "#ff00007d");
})

Deno.test("colors - css_to_normalized", async () => {
    const element = new ElementMock();

    element.style["--color-hex"] = "#ff0000";
    element.style["--color-rgb"] = "rgb(255, 0, 0)";
    element.style["--color-rgba"] = "rgb(255, 0, 0, 125)";

    const result = await crs.call("colors", "css_to_normalized", {
        element: element,
        variables: ["--color-hex", "--color-rgb", "--color-rgba"]
    })

    assertEquals(result["--color-hex"].r, 1);
    assertEquals(result["--color-hex"].g, 0);
    assertEquals(result["--color-hex"].b, 0);
    assertEquals(result["--color-hex"].a, 1);

    assertEquals(result["--color-rgb"].r, 1);
    assertEquals(result["--color-rgb"].g, 0);
    assertEquals(result["--color-rgb"].b, 0);
    assertEquals(result["--color-rgb"].a, 1);

    assertEquals(result["--color-rgba"].r, 1);
    assertEquals(result["--color-rgba"].g, 0);
    assertEquals(result["--color-rgba"].b, 0);
    assertEquals(result["--color-rgba"].a, 0.49);
})