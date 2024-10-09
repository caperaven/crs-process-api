import { assertEquals } from "https://deno.land/std@0.148.0/testing/asserts.ts";
import {people} from "./data/simple-data.js";
import init, {group} from "../../../src/wasm/data_processing.js";

await init();

Deno.test("group - simple", () => {
    let result = group(people, ["details.lastName"]);

    assertEquals(result["root"]["children"]["Doe"]["rows"][0], 0);
    assertEquals(result["root"]["children"]["Doe"]["rows"][1], 1);
    assertEquals(result["root"]["children"]["Doe"]["rows"][2], 3);
    assertEquals(result["root"]["children"]["Smith"]["rows"][0], 2);
    assertEquals(result["root"]["children"]["none"]["rows"][0], 4);
})

Deno.test("group - simple", () => {
    let result = group(people, ["details.lastName", "details.firstName"]);

    assertEquals(result["root"]["child_count"], 3);
    assertEquals(result["root"]["children"]["Doe"]["child_count"], 2);
    assertEquals(result["root"]["children"]["Smith"]["child_count"], 1);

    assertEquals(result["root"]["children"]["Doe"]["children"]["Jane"]["rows"][0], 3);
    assertEquals(result["root"]["children"]["Doe"]["children"]["John"]["rows"][0], 0);
    assertEquals(result["root"]["children"]["Doe"]["children"]["John"]["rows"][1], 1);
    assertEquals(result["root"]["children"]["Smith"]["children"]["Christine"]["rows"][0], 2);
})

Deno.test("group - simple and partial", () => {
    let result = group(people, ["details.lastName"], [0, 1, 3]);

    assertEquals(result["root"]["children"]["Doe"]["rows"][0], 0);
    assertEquals(result["root"]["children"]["Doe"]["rows"][1], 1);
    assertEquals(result["root"]["children"]["Doe"]["rows"][2], 3);
})