import { assertEquals } from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {ElementMock} from "../mockups/element-mock.js";
import {init} from "./../mockups/init.js";

await init();

Deno.test("compile actions - if", async () => {
    let result = await crs.call("compile", "if_value", {exp: "value == 10 ? true : false"});
    let trueValue = await result({value: 10});
    let falseValue = await result({value: 20});

    assertEquals(trueValue, true);
    assertEquals(falseValue, false);

    result = await crs.call("compile", "if_value", {exp: "value == 10 ? true"});
    trueValue = await result({value: 10});
    falseValue = await result({value: 20});

    assertEquals(trueValue, true);
    assertEquals(falseValue, undefined);
})

Deno.test("compile - case_value", async () => {
    let result = await crs.call("compile", "case_value", {exp: "value < 10: 'yes', value < 20: 'ok', default: 'no'"});
    let value1 = await result({value: 5});
    let value2 = await result({value: 15});
    let value3 = await result({value: 25})

    assertEquals(value1, 'yes');
    assertEquals(value2, 'ok');
    assertEquals(value3, 'no');

    result = await crs.call("compile", "case_value", {exp: "value < 10: 'yes', value < 20: 'ok'"});
    value1 = await result({value: 5});
    value2 = await result({value: 15});
    value3 = await result({value: 25})

    assertEquals(value1, 'yes');
    assertEquals(value2, 'ok');
    assertEquals(value3, undefined);
})