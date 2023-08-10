import {beforeAll, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import {assertEquals, assert} from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";

await init();

beforeAll(async () => {
    await import("./../../src/action-systems/system-actions.js");
});

describe("system actions tests", () => {
    describe("copy to clipboard", () => {
        it("should copy to clipboard without modifying", async () => {
            // Arrange
            let clipboardText = "";
            // NOTE: Do not modify the formatting of the below line we have tabs and a new line character
            const source = `Test1   Test2   Test3   
            Test4   Test5   Test6`;
            globalThis.navigator.clipboard = {
                writeText: async (text) => {
                    clipboardText = text;
                }
            }
            // Act
            await crs.call("system", "copy_to_clipboard", {
                source,
                shouldStringify: false
            });
            // Assert
            assertEquals(clipboardText, source);
        });

        it("should copy to clipboard and stringify", async () => {
            // Arrange
            let clipboardText = "";
            const source = `Test1   Test2   Test3   
            Test4   Test5   Test6`;
            globalThis.navigator.clipboard = {
                writeText: async (text) => {
                    clipboardText = text;
                }
            }
            // Act
            await crs.call("system", "copy_to_clipboard", {
                source
            });
            // Assert
            assertEquals(clipboardText, JSON.stringify(source));
        });
    });
});

