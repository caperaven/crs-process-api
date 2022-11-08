import { beforeAll } from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.147.0/testing/asserts.ts";
import { init } from "./../mockups/init.js";

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

Deno.test("markdown tables", async () => {
    const markdown = `
| foo | bar |
| --- | --- |
| baz | bim |
    `

    const result = await crs.call("markdown", "to_html", {
        markdown
    })

    assert(result.indexOf("<table>") != -1);
})