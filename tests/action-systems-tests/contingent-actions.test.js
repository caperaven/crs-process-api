import { beforeAll, beforeEach, describe, it } from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assertNotEquals} from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";

await init();

const logs = [];

globalThis.console = {
    log: (msg) => logs.push(msg)
}
beforeAll(async () => {
    await import("./../../src/action-systems/contingent-actions.js");
})

it ("contingent actions", async () => {
    const process = {
        data: { value: 20 },
        prefixes: {
            "$text": "$process.text",
            "$data": "$process.data",
            "$parameters": "$process.parameters",
            "$bId": "$process.parameters.bId",
            "$global": "globalThis",
            "$translation": 'crsbinding.translations.get("$0")'
        }
    }


    await crs.call("contingent", "perform", {
        contingents: {
            "$data.value == 10": {
                "type": "console",
                "action": "log",
                "args": {
                    "message": "step1"
                }
            },
            "$data.value == 20": {
                "type": "console",
                "action": "log",
                "args": {
                    "message": "step2"
                }
            },
            "$data.value == 30": {
                "type": "console",
                "action": "log",
                "args": {
                    "message": "step3"
                }
            },
        }
    }, null, process);

    assertEquals(logs.length, 1);
    assertEquals(logs[0], "step2");
});