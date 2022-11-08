import { beforeAll, afterAll, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import {ElementMock} from "../mockups/element-mock.js";
import { assertEquals, assertNotEquals, assert } from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";

await init();

describe("process tests", async () => {
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
})