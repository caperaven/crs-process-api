import {assertEquals} from "https://deno.land/std@0.148.0/testing/asserts.ts";
import init, {fuzzy_filter, init_panic_hook} from "./../../../src/bin/data_processing.js";
await init();

Deno.test("fuzzy filter", () => {
    init_panic_hook();

    const result = fuzzy_filter([
        { value: "a" , value2: "aa" },
        { value: "b" , value2: "b"},
        { value: "c" , value2: "aa"},
        { value: "a" , value2: "c"},
        { value: "b" , value2: "aa"}
    ], { "fields": ["value", "value2"], "value": "a" });

    assertEquals(result.length, 4);
    assertEquals(result, [0, 2, 3, 4]);
})

Deno.test("fuzzy filter - no match", () => {
    init_panic_hook();

    const result = fuzzy_filter([
        { value: "a" , value2: "aa" },
        { value: "b" , value2: "b"},
        { value: "c" , value2: "aa"},
        { value: "a" , value2: "c"},
        { value: "b" , value2: "aa"}
    ], { "fields": ["value", "value2"], "value": "z" });

    assertEquals(result.length, 0);
    assertEquals(result, []);
});

Deno.test("fuzzy filter - partial match", () => {
    init_panic_hook();

    const result = fuzzy_filter([
        { value: "hello" , value2: "world" },
        { value: "foo" , value2: "bar"},
        { value: "baz" , value2: "qux"},
        { value: "hello" , value2: "foo"},
        { value: "bar" , value2: "baz"}
    ], { "fields": ["value", "value2"], "value": "o" });

    assertEquals(result.length, 3);
    assertEquals(result, [0, 1, 3]);
});

Deno.test("fuzzy filter - case insensitive match", () => {
    init_panic_hook();

    const result = fuzzy_filter([
        { value: "Hello" , value2: "World" },
        { value: "foo" , value2: "bar"},
        { value: "Baz" , value2: "Qux"},
        { value: "hello" , value2: "foo"},
        { value: "bar" , value2: "baz"}
    ], { "fields": ["value", "value2"], "value": "HELLO" });

    assertEquals(result.length, 2);
    assertEquals(result, [0, 3]);
});

Deno.test("fuzzy filter - numeric match", () => {
    init_panic_hook();

    const result = fuzzy_filter([
        { value: "123" , value2: "456" },
        { value: "789" , value2: "012"},
        { value: "345" , value2: "678"},
        { value: "901" , value2: "234"},
        { value: "567" , value2: "890"}
    ], { "fields": ["value", "value2"], "value": "3" });

    assertEquals(result.length, 3);
    assertEquals(result, [0, 2, 3]);
});
