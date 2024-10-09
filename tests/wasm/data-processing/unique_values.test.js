import {assertEquals} from "https://deno.land/std@0.148.0/testing/asserts.ts";
import init, {unique_values} from "../../../src/wasm/data_processing.js";

await init();

Deno.test("unique values", () => {
    let result = unique_values([{value: 1}, {value: 2}, {value: 3}, {value: 3}, {value: null}], ["value"]);

    assertEquals(result["value"]["1"], 1);
    assertEquals(result["value"]["2"], 1);
    assertEquals(result["value"]["3"], 2);
    assertEquals(result["value"]["null"], 1);

    result = unique_values([{value: 1}, {value: 2}, {value: 3}, {value: 3}, {value: null}], ["value"], Uint32Array.from([0, 2]));
    assertEquals(result["value"]["1"], 1);
    assertEquals(result["value"]["3"], 1);
    assertEquals(result["value"]["2"], undefined);
    assertEquals(result["value"]["null"], undefined);
})