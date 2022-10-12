import { assertEquals, assertNotEquals } from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";

await init();

const logs = {
    log: null,
    warn: null,
    error: null,
    table: null
}

globalThis.console = {
    log: (msg) => logs.log = msg,
    warn: (msg) => logs.warn = msg,
    error: (msg) => logs.error = msg,
    table: (msg) => logs.table = msg
}

Deno.test("ConsoleActions - log", async () => {
    logs.log = null;
    await crs.call("console", "log", {message: "log-message"});
    assertEquals(logs.log, "log-message");
})

Deno.test("ConsoleActions - log - messages", async () => {
    logs.log = null;
    await crs.call("console", "log", {messages: ["log-message"]})
    assertEquals(logs.log, "log-message");
})

Deno.test("ConsoleActions - warn", async () => {
    logs.log = null;
    await crs.call("console", "warn", {message: "warn-message"});
    assertEquals(logs.warn, "warn-message");
})

Deno.test("ConsoleActions - error", async () => {
    logs.log = null;
    await crs.call("console", "error", {message: "error-message"});
    assertEquals(logs.error, "error-message");
})

Deno.test("ConsoleActions - table", async () => {
    logs.log = null;
    await crs.call("console", "table", {message: "table-message"});
    assertEquals(logs.table, "table-message");
})