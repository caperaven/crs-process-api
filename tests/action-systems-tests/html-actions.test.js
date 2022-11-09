import { beforeAll } from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.147.0/testing/asserts.ts";
import { init } from "./../mockups/init.js";
import {createSchemaLoader} from "./../../packages/crs-schema/crs-schema.js";
import {HTMLParser} from "./../../packages/crs-schema/html/crs-html-parser.js";

await init();

beforeAll(async () => {
    await import("./../../src/action-systems/html-actions.js");

    globalThis.schema = {
        parser: await createSchemaLoader(new HTMLParser(null))
    };
})

Deno.test("html - from file", async () => {
    const result = await crs.call("html", "get", {
        url: import.meta.url.replace("action-systems-tests/html-actions.test.js", "test.html")
    })

    assert(result.indexOf("<h1>") != -1);
})

Deno.test("html - from template", async () => {
    const result = await crs.call("html", "get", {
        template: "test",
        url: import.meta.url.replace("action-systems-tests/html-actions.test.js", "test.html")
    })

    assert(result != null);
    assert(await crsbinding.templates.get("test") != null);
})

Deno.test("html - from schema", async () => {
    assert(schema.parser != null);
    const result = await crs.call("html", "get", {
        schema: {
            body: {
                elements: [
                    {
                        element: "div",
                        content: "Hello World"
                    }
                ]
            }
        }
    })

    assertEquals(result, "<div  >Hello World</div>");
})

Deno.test("html - from process", async () => {

})

Deno.test("html - from function", async () => {
    const result = await crs.call("html", "get", {function: () => "<h1>test</h2>"});
    assertEquals(result, "<h1>test</h2>");
})

Deno.test("html - markdown", async () => {
    const result = await crs.call("html", "get", { markdown: "# hello world" });
    assertEquals(result, "<h1>hello world</h1>\n");
})