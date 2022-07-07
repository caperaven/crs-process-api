import { assertEquals, assertNotEquals } from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {initRequired} from "./../mockups/init-required.js";

await initRequired();

Deno.test("execute-action", async () => {
    const context = {};
    const process = {};

    await crs.call("binding", "create_context", { contextId: "test_context" }, context, process)
    assertNotEquals(process.parameters.bId, undefined);

    await crs.call("binding", "free_context", { contextId: "test_context" }, context, process)
    assertEquals(process.parameters.bId, undefined);
})

Deno.test("binding - get and set property", async() => {
    const context = {
        value: "Hello World"
    };

    const process = {};

    await crs.call("binding", "create_context", {}, context, process);

    await crs.call("binding", "set_property", {
        property: "field1",
        value: "$context.value"
    }, context, process);

    await crs.call("binding", "get_property", {
        property: "field1",
        target: "$context.field1"
    }, context, process);

    assertEquals(context.field1, context.value);

    await crs.call("object", "set", {
        properties: {
            "$context.field2": "$binding.field1"
        }
    }, context, process);

    assertEquals(context.field2, context.value);
})