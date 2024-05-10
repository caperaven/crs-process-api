import { beforeAll, beforeEach, afterAll, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import {ElementMock} from "../mockups/element-mock.js";
import { assertEquals, assertNotEquals, assert } from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";

await init();

describe("process tests", async () => {
    let process;

    it("getValue - template", async () => {
        const template = `
        $template
        # heading
        `

        const result = await crs.process.getValue(template);
        assertEquals(result, template);
    })

    it ("getValue - value", async () => {
        assertEquals(await crs.process.getValue(10), 10);
        assertEquals(await crs.process.getValue("test"), "test");
    })

    it ("getValue - context", async () => {
        const context = { value: 10 };
        assertEquals(await crs.process.getValue("$context", context), context);
        assertEquals(await crs.process.getValue("$context.value", context), 10);
    })

    it ("getValue - process", async () => {
        const process = { value: 10 };
        assertEquals(await crs.process.getValue("$process", null, process), process);
        assertEquals(await crs.process.getValue("$process.value", null, process), 10);
    })

    it ("getValue - item", async () => {
        const item = { value: 10 };
        assertEquals(await crs.process.getValue("$item", null, null, item), item);
        assertEquals(await crs.process.getValue("$item.value", null, null, item), 10);
    })

    it("getValue - normal text", async () => {
        const value = "my normal value"
        assertEquals(await crs.process.getValue(value), value);
    })

    it("getValue - text with a $ inside", async () => {
        const value = "my confusing get $ value"
        assertEquals(await crs.process.getValue("my confusing get $ value"), value);
    })

    it("getValue - text with multiple special characters $", async () => {
        const value = "$!@#$%^&*()_+{}|:<>?~`"
        assertEquals(await crs.process.getValue("$!@#$%^&*()_+{}|:<>?~`"), value);
    })

    it("getValue - start with $ text followed by number", async () => {
        const value = "$10000"
        assertEquals(await crs.process.getValue(`$10000`), value);
    })


    it("getValue - text with a prefix on process and context", async () => {
        const process = {
            prefixes: {
                "$data": "$process.$data",
            },
            data: {
                value: 10
            },
            expCache: {}
        }

        assertEquals(await crs.process.getValue("$data.value", null, process), 10);
    })
})