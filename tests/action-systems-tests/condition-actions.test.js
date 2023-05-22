import { beforeAll, beforeEach, describe, it } from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assertNotEquals} from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";

await init();

beforeAll(async () => {
    await import("./../../src/action-systems/condition-actions.js");
})

const logs = {
    log: null,
    error: null
}

globalThis.console = {
    log: (msg) => logs.log = msg,
    error: (msg) => logs.error = msg
}

describe("condition tests", async () => {
    async function performCondition(exp, context, process, item, passStep, failStep) {
        return await crs.intent.condition.perform({
            args: {
                condition: exp,
                target: "$context.result"
            },
            pass_step: passStep,
            fail_step: failStep
        }, context, process, item);
    }

    let process;
    let context;
    let item;
    let passStep;
    let failStep;

    beforeEach(async () => {
        logs.log = null;
        logs.error = null;

        context = {isValid: true};

        process = {
            prefixes: {
                "$text": "$process.text",
                "$data": "$process.data",
                "$parameters": "$process.parameters",
                "$bId": "$process.parameters.bId",
                "$global": "globalThis"
            }
        }

        item = {value: 10};

        passStep = {
            type: "console",
            action: "log",
            args: {
                message: "pass"
            }
        }

        failStep = {
            type: "console",
            action: "error",
            args: {
                message: "fail"
            }
        }
    })

    it("$context - simple check", async () => {
        assertEquals(logs.log, null);
        assertEquals(logs.error, null);

        let result = await performCondition("$context.isValid == true", context, process, item, passStep, failStep);
        assertEquals(result, true);
        assertEquals(logs.log, "pass");
        assertEquals(context.result, true);

        context.isValid = false;
        result = await performCondition("$context.isValid == true", context, process, item, passStep, failStep);
        assertEquals(result, false);
        assertEquals(logs.error, "fail");
        assertEquals(context.result, false);
    })

    it ("$process - simple check", async () => {
        assertEquals(logs.log, null);
        assertEquals(logs.error, null);

        process.data = {value: 10};
        let result = await performCondition("$process.data.value == 10", context, process, item, passStep, failStep);
        assertEquals(result, true);
        assertEquals(logs.log, "pass");
        assertEquals(context.result, true);

        process.data = {value: 20};
        result = await performCondition("$process.data.value == 10", context, process, item, passStep, failStep);
        assertEquals(result, false);
        assertEquals(logs.error, "fail");
        assertEquals(context.result, false);
    })

    it ("$item - simple check", async () => {
        assertEquals(logs.log, null);
        assertEquals(logs.error, null);

        let result = await performCondition("$item.value == 10", context, process, item, passStep, failStep);
        assertEquals(result, true);
        assertEquals(logs.log, "pass");
        assertEquals(context.result, true);

        item.value = 20;
        result = await performCondition("$item.value == 10", context, process, item, passStep, failStep);
        assertEquals(result, false);
        assertEquals(logs.error, "fail");
        assertEquals(context.result, false);
    })

    it ("$binding - simple check", async () => {
        assertEquals(logs.log, null);
        assertEquals(logs.error, null);

        const bId = crs.binding.data.addObject("test");
        await crs.binding.data.setProperty(bId, "value", 10);
        process.parameters ||= {bId: bId};

        let result = await performCondition("$binding.value == 10", context, process, item, passStep, failStep);
        assertEquals(result, true);
        assertEquals(logs.log, "pass");
        assertEquals(context.result, true);

        result = await performCondition("$binding.value == 20", context, process, item, passStep, failStep);
        assertEquals(result, false);
        assertEquals(logs.error, "fail");
        assertEquals(context.result, false);
    })

    it ("$binding - complex check", async () => {
        assertEquals(logs.log, null);
        assertEquals(logs.error, null);

        const bId = crs.binding.data.addObject("test");
        await crs.binding.data.setProperty(bId, "value", {property: [10]});
        process.parameters ||= {bId: bId};

        let result = await performCondition("$binding.value.property.length == 1 && $context.isValid == true", context, process, item, passStep, failStep);
        assertEquals(result, true);
        assertEquals(logs.log, "pass");
        assertEquals(context.result, true);

        result = await performCondition("$binding.value.property.length == 2 && $context.isValid == true", context, process, item, passStep, failStep);
        assertEquals(result, false);
        assertEquals(logs.error, "fail");
        assertEquals(context.result, false);
    })

    it ("$binding - complex check with multiple binding", async () => {
        assertEquals(logs.log, null);
        assertEquals(logs.error, null);

        const bId = crs.binding.data.addObject("test");
        await crs.binding.data.setProperty(bId, "value", {property: [10]});
        await crs.binding.data.setProperty(bId, "active", true);

        process.parameters ||= {bId: bId};

        let result = await performCondition("$binding.value.property.length == 1 && $binding.active == true && $context.isValid == true", context, process, item, passStep, failStep);
        assertEquals(result, true);
        assertEquals(logs.log, "pass");
        assertEquals(context.result, true);

        result = await performCondition("$binding.value.property.length == 2 && $binding.active == true && $context.isValid == true", context, process, item, passStep, failStep);
        assertEquals(result, false);
        assertEquals(logs.error, "fail");
        assertEquals(context.result, false);
    })

    it ("mixed context", async () => {
        assertEquals(logs.log, null);
        assertEquals(logs.error, null);

        let result = await performCondition("$context.isValid == true && $item.value == 10", context, process, item, passStep, failStep);
        assertEquals(result, true);
        assertEquals(logs.log, "pass");
        assertEquals(context.result, true);

        item.value = 20;
        result = await performCondition("$context.isValid == true && $item.value == 10", context, process, item, passStep, failStep);
        assertEquals(result, false);
        assertEquals(logs.error, "fail");
        assertEquals(context.result, false);
    })

    it ("prefix context", async () => {
        process.data = {value: 10}
        let result = await performCondition("$data.value == 10", context, process, item, passStep, failStep);
        assertEquals(result, true);
        assertEquals(logs.log, "pass");
        assertEquals(context.result, true);

        result = await performCondition("$data.value == 20", context, process, item, passStep, failStep);
        assertEquals(result, false);
        assertEquals(logs.error, "fail");
        assertEquals(context.result, false);
    })
})
