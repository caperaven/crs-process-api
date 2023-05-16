import { assertEquals } from "https://deno.land/std@0.148.0/testing/asserts.ts";
import {people} from "./data/simple-data.js";
import init, {get_perspective} from "./../../../src/bin/data_processing.js";

await init();

Deno.test("group - simple", () => {
    const people = [
        { "id": 1, "name": "John", "lastName": "Doe", "age": 10 },
        { "id": 2, "name": "Andrew", "lastName": "Smith", "age": 20 },
        { "id": 3, "name": "Suzy", "lastName": "Doe", "age": 12 }
    ]

    let result = get_perspective(people, {
        filter: { field: "lastName", operator: "eq", value: "Doe" },
    });

    console.log(result);
})