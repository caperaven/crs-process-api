import { assertEquals } from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {ElementMock} from "../mockups/element-mock.js";
import {init} from "./../mockups/init.js";

await init();

Deno.test("compile actions - if", async () => {
    const result = await crs.call("compile", "if_value", {exp: "value == 10 ? true : false"});
    const trueValue = result({value: 10});
    const falseValue = result({value: 20});

    assertEquals(trueValue, true);
    assertEquals(falseValue, false);
})