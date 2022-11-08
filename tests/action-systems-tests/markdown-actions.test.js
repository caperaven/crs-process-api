import { beforeAll, describe, it, beforeEach } from "https://deno.land/std@0.157.0/testing/bdd.ts";
import {ElementMock} from "../mockups/element-mock.js";
import { assertEquals, assertNotEquals, assert } from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";

await init();

beforeAll(async () => {
    await import("./../../src/action-systems/markdown-actions.js");
})

Deno.test("markdown to html", async () => {
    const result = await crs.call("markdown", "to_html", {
        markdown: "# heading 1"
    })

    assertEquals(result, `<h1>heading 1</h1>\n`);
})