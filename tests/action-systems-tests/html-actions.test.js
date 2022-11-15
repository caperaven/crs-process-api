import {beforeAll} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import {assertEquals, assert} from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";
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

Deno.test("html - from schema from file", async () => {
    assert(schema.parser != null);
    const result = await crs.call("html", "get", {
        schema: import.meta.url.replace("action-systems-tests/html-actions.test.js", "schema.json")
    })

    assertEquals(result, "<div  >Hello World</div>");
})

Deno.test("html - from function", async () => {
    const result = await crs.call("html", "get", {function: () => "<h1>test</h2>"});
    assertEquals(result, "<h1>test</h2>");
})

Deno.test("html - markdown", async () => {
    const result = await crs.call("html", "get", {markdown: "# hello world"});
    assertEquals(result, "<h1>hello world</h1>\n");
});

Deno.test("html - create elements from string", async () => {
    // Arrange
    await crsbinding.translations.add({label: "Its Approved"});
    // Act
    const result = await crs.call("html", "create", {
        html: "<b data-id='${codeId}'>${code}</b><span aria-label='&{label}'>${description}</span>",
        ctx: {code: "AP", description: "Approved", codeId: 101}
    });
    // Assert
    assertEquals(result.innerHTML, "<b data-id='101'>AP</b><span aria-label='Its Approved'>Approved</span>");
});

Deno.test("html - create elements from string using variables", async () => {
    // Arrange
    const context = {};
    const process = {
        data: {
            html: "<b data-id='${codeId}'>${code}</b><span aria-label='&{label}'>${description}</span>",
            ctx: {code: "AP", description: "Approved", codeId: 101}
        }};
    await crsbinding.translations.add({label: "Its Approved"});
    // Act
    const result = await crs.call("html", "create", {
        html: "$process.data.html",
        ctx: "$process.data.ctx"
    }, context, process);
    // Assert
    assertEquals(result.innerHTML, "<b data-id='101'>AP</b><span aria-label='Its Approved'>Approved</span>");
});

//Note for reviewer I cant do the following "Hello&nbsp;${test}"
Deno.test("html - create elements from string simple html", async () => {
    // Act
    const result = await crs.call("html", "create", {
        html: "Hello&nbsp;World",
        ctx: {test: "World"}
    });
    // Assert
    assertEquals(result.innerHTML, "Hello&nbsp;World");
});