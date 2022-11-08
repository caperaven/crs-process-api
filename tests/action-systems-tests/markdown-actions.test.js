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

Deno.test("markdown inflation", async () => {
    await crsbinding.translations.add({
        "title": "Hello World"
    }, "md")

    const markdown = [
        "$template",
        "# &{md.title}",
        "**Summary**",
        "Work order: \"${code}\" has asset \"${assetCode}\"."
    ].join("\n")

    const parameters = {
        code: "WRK0001",
        assetCode: "ASSET12"
    }

    const result = await crs.call("markdown", "to_html", {
        markdown,
        parameters
    })

    const parts = result.split("\n");

    assert(parts[0].indexOf("<h1>Hello World</h1>") != -1);
    assert(parts[1].indexOf("<strong>Summary</strong>") != -1);
    assert(parts[2].indexOf('Work order: “WRK0001” has asset “ASSET12”') != -1);

    await crsbinding.translations.delete("md");
})