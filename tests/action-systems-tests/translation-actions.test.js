import { beforeAll, afterAll, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import {ElementMock} from "../mockups/element-mock.js";
import { assertEquals, assertNotEquals, assert } from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";

await init();

const logs = {
    log: null,
}

globalThis.console = {
    log: (msg) => logs.log = msg
}

beforeAll(async () => {
    await import("./../../src/action-systems/translations-actions.js");

    await crs.call("translations", "add", {
        translations: {
            message: "Hello World",
            formatted: "${code} is valid"
        },
        context: "myprocess"
    })
})

afterAll(async () => {
    await crs.call("translations", "delete", {context: "myprocess"});
})

describe("translation tests", async () => {
    it("get translation", async () => {
        const result = await crs.call("translations", "get", {key: "myprocess.message"});
        assertEquals(result, "Hello World");
    })

    it("translate_elements", async () => {
        const element = document.createElement("div");
        element.textContent = "&{myprocess.message}";

        await crs.call("translations", "translate_elements", {element: element});
        assertEquals(element.textContent, "Hello World");
    })

    it("inflate", async () => {
        const result = await crs.call("translations", "inflate", {
            key: "myprocess.formatted",
            parameters: {
                code: "A11"
            }
        })

        assertEquals(result, "A11 is valid");
    })

    it("$translation expression", async () => {
        await crs.call("console", "log", { messages: ["$translation.myprocess.message"] });
        assertEquals(logs.log, "Hello World");
    })
})