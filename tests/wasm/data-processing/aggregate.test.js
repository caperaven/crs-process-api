import {assertEquals} from "https://deno.land/std@0.148.0/testing/asserts.ts";
import init, {aggregate} from "../../../src/wasm/data_processing.js";

await init();

Deno.test("aggregate", () => {
    const result = aggregate([{value: 1}, {value: 2}, {value: 3}], ["value"]);

    assertEquals(result.value.min, 1);
    assertEquals(result.value.max, 3);
    assertEquals(result.value.ave, 2);
    assertEquals(result.value.sum, 6);
})