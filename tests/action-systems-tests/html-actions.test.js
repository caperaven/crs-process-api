import { beforeAll } from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.147.0/testing/asserts.ts";
import { init } from "./../mockups/init.js";

await init();

beforeAll(async () => {
    await import("./../../src/action-systems/html-actions.js");
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

})

Deno.test("html - from process", async () => {

})

Deno.test("html - from function", async () => {
    const result = await crs.call("html", "get", {function: () => "<h1>test</h2>"});
    assert(result, "<h1>test</h2>");
})