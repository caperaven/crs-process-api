import { assertEquals } from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";

await init();


Deno.test("execute-action", async () => {
    const data = {
        value: ""
    }

    const context = {
        log: (value) => {
            data.value = value
        }
    }

    await crs.call("action", "$context.log", { parameters: ["Hello World"] }, context);

    assertEquals(data.value, "Hello World");
})

Deno.test("execute action - item", async () => {
    const data = {
        value: ""
    }

    const item = {
        log: (value) => {
            data.value = value
        }
    }

    await crs.call("action", "$item.log", { parameters: ["Hello World"] }, null, null, item);

    assertEquals(data.value, "Hello World");
})

Deno.test("execute action - parameter paths", async () => {
    const data = {
        value: ""
    }

    const context = {
        value: "My Cool Value",
        log: (value) => {
            data.value = value
        }
    }

    await crs.call("action", "$context.log", { parameters: ["$context.value"] }, context);

    assertEquals(data.value, "My Cool Value");
})