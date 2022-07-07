import { assertEquals, assertNotEquals } from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {initRequired} from "./../mockups/init-required.js";

await initRequired();
await crs.modules.get("condition");
const logs = {
    log: null
}

globalThis.console = {
    log: (msg) => logs.log = msg
}

Deno.test("ConditionActions - condition on context - pass step executed", async () => {
    await crs.intent.condition.perform({args: {condition: "$context.isValid == true"}, pass_step: {type: "console", action: "log", args: {message: "pass"}}}, {isValid: true})
    assertEquals(logs.log, "pass");
})

Deno.test("ConditionActions - condition on context - fail", async () => {
    await crs.intent.condition.perform({args: {condition: "$context.isValid == true"}, fail_step: {type: "console", action: "log", args: {message: "fail"}}}, {isValid: false})
    assertEquals(logs.log, "fail");
})

Deno.test("ConditionActions - condition on process - pass step executed", async () => {
    await crs.intent.condition.perform({args: {condition: "$process.isValid == true"}, pass_step: {type: "console", action: "log", args: {message: "pass"}}}, null, {isValid: true});
    assertEquals(logs.log, "pass");
})

Deno.test("ConditionActions - condition on process - fail", async () => {
    await crs.intent.condition.perform({args: {condition: "$process.isValid == true"}, fail_step: {type: "console", action: "log", args: {message: "fail"}}}, null, {isValid: false})
    assertEquals(logs.log, "fail");
})

Deno.test("ConditionActions - condition on item - pass step executed", async () => {
    await crs.intent.condition.perform({args: {condition: "$item.isValid == true"}, pass_step: {type: "console", action: "log", args: {message: "pass"}}}, null, null, {isValid: true})
    assertEquals(logs.log, "pass");
})

Deno.test("ConditionActions - condition on item - fail", async () => {
    await crs.intent.condition.perform({args: {condition: "$item.isValid == true"}, fail_step: {type: "console", action: "log", args: {message: "fail"}}}, null, null, {isValid: false})
    assertEquals(logs.log, "fail");
})

Deno.test("ConditionActions - pass_step string", async () => {
    const process = {
        steps: {
            log_success: {
                type: "console",
                action: "log",
                args: {
                    message: "pass"
                }
            }
        }
    }

    await crs.intent.condition.perform({args: {condition: "$context.isValid == true"}, pass_step: "log_success"}, {isValid: true}, process)
    assertEquals(logs.log, "pass");
})

Deno.test("ConditionActions - fail_step string", async () => {
    const process = {
        steps: {
            log_failure: {
                type: "console",
                action: "log",
                args: {
                    message: "fail"
                }
            }
        }
    }

    await crs.intent.condition.perform({args: {condition: "$context.isValid == true"}, fail_step: "log_failure"}, {isValid: false}, process)
    assertEquals(logs.log, "fail");
})

Deno.test("ConditionActions - binding expression", async () => {
    const bId = crsbinding.data.addObject("test");
    crsbinding.data.setProperty(bId, "value", 100);

    const process = {
        parameters: {
            bId: bId
        }
    }

    const success = await crs.intent.condition.perform({args: {condition: "$binding.value == 100"}}, null, process);
    assertEquals(success, true);
    crsbinding.data.removeObject(bId);
})
