import {assertEquals, assertExists} from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {beforeAll, beforeEach} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import {init} from "./../mockups/init.js";
await init();

beforeAll(async () => {
    await import ("../../src/action-systems/logger-actions.js");
})

beforeEach(async () => {
    await crs.call("logger", "set_level", { level: "INFO" });
    await crs.call("logger", "clear");
})

Deno.test("Logger Actions - test sequence of logs - suppress log", async () => {
    // debug is a lower evel than info so don't log it.
    await crs.call("logger", "debug", { message: "debug" });
    assertEquals(crs.intent.logger.logs.DEBUG.length, 0);
});

Deno.test("Logger Actions - test sequence of logs - positive log", async () => {
    await crs.call("logger", "set_level", { level: "DEBUG" });
    await crs.call("logger", "debug", { message: "debug" });
    assertEquals(crs.intent.logger.logs.DEBUG.length, 1);
});

Deno.test("Logger Actions - info log", async () => {
    // debug is a lower evel than info so don't log it.
    await crs.call("logger", "info", { message: "info" });
    assertEquals(crs.intent.logger.logs.INFO.length, 1);
});

Deno.test("Logger Actions - warning log", async () => {
    // debug is a lower evel than info so don't log it.
    await crs.call("logger", "warning", { message: "warning" });
    assertEquals(crs.intent.logger.logs.WARNING.length, 1);
});

Deno.test("Logger Actions - error log", async () => {
    // debug is a lower evel than info so don't log it.
    await crs.call("logger", "error", { message: "error" });
    assertEquals(crs.intent.logger.logs.ERROR.length, 1);
});

Deno.test("Logger Actions - fatal log", async () => {
    // debug is a lower evel than info so don't log it.
    await crs.call("logger", "fatal", { message: "fatal" });
    assertEquals(crs.intent.logger.logs.FATAL.length, 1);
});

Deno.test("Logger Actions - has_errors", async () => {
    // debug is a lower evel than info so don't log it.
    await crs.call("logger", "error", { message: "error" });
    assertEquals(await crs.call("logger", "has_errors"), true);
});

Deno.test("Logger Actions - has_fatal_errors", async () => {
    // debug is a lower evel than info so don't log it.
    await crs.call("logger", "fatal", { message: "fatal" });
    assertEquals(await crs.call("logger", "has_fatal_errors"), true);
});

Deno.test("Logger Actions - print", async () => {
    // stub out console.log
    let message;

    globalThis.console = {
        log: (msg) => message = msg
    }

    await crs.call("logger", "info", { message: "info" });
    await crs.call("logger", "print");

    assertExists(message);
});



