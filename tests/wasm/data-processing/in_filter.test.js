import { assertEquals } from "https://deno.land/std@0.148.0/testing/asserts.ts";
import init, {in_filter} from "../../../src/wasm/data_processing.js";

await init();

Deno.test("in_filter - equals on path", () => {
    let result = in_filter({ "field": "person.age", "operator": "eq", "value": 20 }, { person: { age: 20 } }, false);
    assertEquals(result, true);
})

Deno.test("in_filter - equals", () => {
    // true - test
    let result = in_filter({ "field": "value", "operator": "eq", "value": 10 }, { value: 10 }, false);
    assertEquals(result, true);

    // false - test
    result = in_filter({ "field": "value", "operator": "eq", "value": 20 }, { value: 10 }, false);
    assertEquals(result, false);
})

Deno.test("in_filter - equals case sensitive", () => {
    let result = in_filter( {"field": "value", "operator": "eq", "value": "Hello"}, { value: "Hello" }, true);
    assertEquals(result, true);

    result = in_filter( {"field": "value", "operator": "eq", "value": "hello"}, { value: "Hello" }, true);
    assertEquals(result, false);

    result = in_filter( {"field": "value", "operator": "eq", "value": "hello"}, { value: "Hello" }, false);
    assertEquals(result, true);
})

Deno.test("in_filter - not equals", () => {
    // true - test
    let result = in_filter({ "field": "value", "operator": "neq", "value": 20 }, { value: 10 }, false);
    assertEquals(result, true);

    // false - test
    result = in_filter({ "field": "value", "operator": "neq", "value": 10 }, { value: 10 }, false);
    assertEquals(result, false);
})

Deno.test("in_filter - greater than", () => {
    // true - test
    let result = in_filter({ "field": "value", "operator": "gt", "value": 5 }, { value: 10 }, false);
    assertEquals(result, true);

    // false - test
    result = in_filter({ "field": "value", "operator": "gt", "value": 15 }, { value: 10 }, false);
    assertEquals(result, false);
})

Deno.test("in_filter - greater or equal", () => {
    // true - test
    let result = in_filter({ "field": "value", "operator": "ge", "value": 5 }, { value: 10 }, false);
    assertEquals(result, true);

    // equal - test
    result = in_filter({ "field": "value", "operator": "ge", "value": 10 }, { value: 10 }, false);
    assertEquals(result, true);

    // false - test
    result = in_filter({ "field": "value", "operator": "ge", "value": 15 }, { value: 10 }, false);
    assertEquals(result, false);
})

Deno.test("in_filter - less than", () => {
    // true - test
    let result = in_filter({ "field": "value", "operator": "lt", "value": 50 }, { value: 10 }, false);
    assertEquals(result, true);

    // false - test
    result = in_filter({ "field": "value", "operator": "lt", "value": 5 }, { value: 10 }, false);
    assertEquals(result, false);
})

Deno.test("in_filter - greater or equal", () => {
    // true - test
    let result = in_filter({ "field": "value", "operator": "le", "value": 50 }, { value: 10 }, false);
    assertEquals(result, true);

    // equal - test
    result = in_filter({ "field": "value", "operator": "le", "value": 10 }, { value: 10 }, false);
    assertEquals(result, true);

    // false - test
    result = in_filter({ "field": "value", "operator": "le", "value": 5 }, { value: 10 }, false);
    assertEquals(result, false);
})

Deno.test("in_filter - is null", () => {
    let result = in_filter({ "field": "value", "operator": "is_null" }, { value: null }, false);
    assertEquals(result, true);

    result = in_filter({ "field": "value", "operator": "is_null" }, { value: 10 }, false);
    assertEquals(result, false);
})

Deno.test("in_filter - is null", () => {
    let result = in_filter({ "field": "value", "operator": "not_null" }, { value: 10 }, false);
    assertEquals(result, true);

    result = in_filter({ "field": "value", "operator": "not_null" }, { value: null }, false);
    assertEquals(result, false);
})

Deno.test("in_filter - in", () => {
    let result = in_filter({ "field": "value", "operator": "in", value: ["a", "b", "c"]}, { value: "a" }, false);
    assertEquals(result, true);

    result = in_filter({ "field": "value", "operator": "in", value: ["a", "b", "c"]}, { value: "d" }, false);
    assertEquals(result, false);
})

Deno.test("in_filter - between", () => {
    let result = in_filter({ "field": "value", "operator": "between", value: ["a", "c"]}, { value: "b" }, false);
    assertEquals(result, true);

    result = in_filter({ "field": "value", "operator": "between", value: ["a", "c"]}, { value: "d" }, false);
    assertEquals(result, false);

    result = in_filter({ "field": "value", "operator": "between", value: ["10", "20"] }, { value: "15" }, false);
    assertEquals(result, true);

    result = in_filter({ "field": "value", "operator": "between", value: ["10", "20"]}, { value: "30" }, false);
    assertEquals(result, false);
})

Deno.test("in_filter - starts with", () => {
    let result = in_filter({ "field": "value", "operator": "starts_with", value: "hello"}, { value: "hello world" }, false);
    assertEquals(result, true);

    result = in_filter({ "field": "value", "operator": "starts_with", value: "world"}, { value: "hello world" }, false);
    assertEquals(result, false);
})

Deno.test("in_filter - ends with", () => {
    let result = in_filter({ "field": "value", "operator": "ends_with", value: "hello"}, { value: "hello world" }, false);
    assertEquals(result, false);

    result = in_filter({ "field": "value", "operator": "ends_with", value: "world"}, { value: "hello world" }, false);
    assertEquals(result, true);
})

Deno.test("in_filter - like", () => {
    let result = in_filter({"field": "value", "operator": "like", value: "%hello"}, {value: "hello world"}, false);
    assertEquals(result, true);

    result = in_filter({"field": "value", "operator": "like", value: "hello%"}, {value: "hello world"}, false);
    assertEquals(result, false);

    result = in_filter({"field": "value", "operator": "like", value: "world%"}, {value: "hello world"}, false);
    assertEquals(result, true);

    result = in_filter({"field": "value", "operator": "like", value: "%hello%"}, {value: "hello world"}, false);
    assertEquals(result, true);
})