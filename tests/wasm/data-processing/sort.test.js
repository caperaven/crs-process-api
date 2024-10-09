import { assertEquals } from "https://deno.land/std@0.148.0/testing/asserts.ts";
import {data, data2, people} from "./data/simple-data.js"
import init, {sort} from "../../../src/wasm/data_processing.js";

await init();

function printResults(result, collection) {
    for (let i = 0; i < result.length; i++) {
        const index = result[i];
        console.log(collection[index]);
    }
}

Deno.test("sort - on path", () => {
    let result = sort(people, ["details.firstName", "details.age:dec"]);

    assertEquals(result[0], 4);
    assertEquals(result[1], 2);
    assertEquals(result[2], 3);
    assertEquals(result[3], 1);
    assertEquals(result[4], 0);

    // printResults(result, people);
})

Deno.test("sort - simple", () => {
    let result = sort(data, ["value:asc"]);

    assertEquals(result[0], 1);
    assertEquals(result[1], 4);
    assertEquals(result[2], 0);
    assertEquals(result[3], 2);
    assertEquals(result[4], 3);

    //printResults(result, data);
})

Deno.test("sort - simple dec", () => {
    let result = sort(data, ["value:dec"]);

    assertEquals(result[0], 3);
    assertEquals(result[1], 2);
    assertEquals(result[2], 0);
    assertEquals(result[3], 4);
    assertEquals(result[4], 1);

    // printResults(result, data);
})

Deno.test("sort - mixed asc -> asc", () => {
    let result = sort(data2, ["v1", "v2"]);

// console.log(result);
// printResults(result, data2);

    assertEquals(result[0], 6);
    assertEquals(result[1], 1);
    assertEquals(result[2], 0);
    assertEquals(result[3], 3);
    assertEquals(result[4], 4);
    assertEquals(result[5], 5);
    assertEquals(result[6], 2);
})

Deno.test("sort - mixed asc -> dec", () => {
    let result = sort(data2, ["v1", "v2:dec"]);

    assertEquals(result[0], 6);
    assertEquals(result[1], 0);
    assertEquals(result[2], 1);
    assertEquals(result[3], 4);
    assertEquals(result[4], 3);
    assertEquals(result[5], 2);
    assertEquals(result[6], 5);

    //printResults(result, data2);
})