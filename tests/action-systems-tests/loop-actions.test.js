import {assertEquals, assertNotEquals} from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";

await init();

Deno.test("Loop Actions - test sequence of loops", async () => {
    // This test is to make sure that the sequence of the loop steps executes in order.

    // Arrange
    const items = [
        {
            value: []
        },
        {
            value: []
        },
        {
            value: []
        }
    ];


    const process = {
        data: {
            items: items
        },
        steps: {
            start: {
                type: "loop",
                args: {
                    source: "$data.items",
                    steps: {
                        start: {
                            type: "array",
                            action: "add",
                            args: {
                                target: "$item.value",
                                value: 1
                            },
                            next_step: "add_second"
                        },
                        add_third: {
                            type: "array",
                            action: "add",
                            args: {
                                target: "$item.value",
                                value: 3
                            }
                        },
                        add_second: {
                            type: "array",
                            action: "add",
                            args: {
                                target: "$item.value",
                                value: 2
                            },
                            next_step: "add_third"
                        }
                    }
                },
                next_step: "end"
            },
            end: {
                type: "object",
                action: "set",
                args: {
                    properties: {
                        "$process.result": "$data.items"
                    }
                }
            }
        }
    }

    // Act
    const result = await crs.process.run({}, process);

    // Assert
    for (const item of result) {
        assertEquals(item.value.length, 3, "All loop steps should have been executed");
        assertEquals(item.value[0], 1, "The start step should have been executed first");
        assertEquals(item.value[1], 2, "The add_second step should have been executed second");
        assertEquals(item.value[2], 3, "The add_third step should have been executed third");
    }
});
