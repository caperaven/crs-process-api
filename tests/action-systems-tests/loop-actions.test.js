import {assertEquals, assertNotEquals} from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";

await init();

Deno.test("Loop Actions - test sequence of loops", async () => {
    // This test is to make sure that the sequence of the loop steps executes in order.

    // Arrange
    const loopArray = [
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
            items: loopArray
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


Deno.test("Loop Actions - test loop with conditions", async () => {
    // This test is to make sure that the sequence of the loop steps executes in order.

    // Arrange
    const loopArray = [
        {
            value: []
        }
    ];


    const process = {
        data: {
            items: loopArray,
            condition: true
        },
        steps: {
            start: {
                type: "loop",
                args: {
                    source: "$data.items",
                    steps: {
                        start: {
                            type: "condition",
                            args: {
                                condition: "$process.data.condition == true",
                            },
                            pass_step: "add_to_array",
                        },
                        add_to_array: {
                            type: "array",
                            action: "add",
                            args: {
                                target: "$item.value",
                                value: 1
                            },
                            next_step: "add_second"
                        },
                    }
                },
                next_step: "end"
            },
            end: {
                type: "object",
                action: "set",
                args: {
                    properties: {
                        "$process.result": "$data.items[0]"
                    }
                }
            }
        }
    }


    // Act
    const result = await crs.process.run({}, process);

    assertEquals(result.value.length, 1, "Add loop step should have been executed");
});

Deno.test("Loop Actions - test loop with switch", async () => {
    // This test is to make sure that the sequence of the loop steps executes in order.

    // Arrange
    const loopArray = [
        {
            value: []
        }
    ];


    const process = {
        data: {
            items: loopArray,
            myValue: "asset"
        },
        steps: {
            start: {
                type: "loop",
                args: {
                    source: "$data.items",
                    steps: {
                        start: {
                            type: "switch",
                            args: {
                                check: "$data.myValue",
                                cases: {
                                    "asset": "add_to_array",
                                }
                            }
                        },
                        add_to_array: {
                            type: "array",
                            action: "add",
                            args: {
                                target: "$item.value",
                                value: 1
                            },
                            next_step: "add_second"
                        },
                    }
                },
                next_step: "end"
            },
            end: {
                type: "object",
                action: "set",
                args: {
                    properties: {
                        "$process.result": "$data.items[0]"
                    }
                }
            }
        }
    }


    // Act
    const result = await crs.process.run({}, process);

    assertEquals(result.value.length, 1, "Add loop step should have been executed");
});

Deno.test("Loop Actions - test loop with validation requires", async () => {
    // This test is to make sure that the sequence of the loop steps executes in order.

    // Arrange
    const loopArray = [
        {
            value: []
        }
    ];


    const process = {
        data: {
            items: loopArray,
            myValue: "asset"
        },
        steps: {
            start: {
                type: "loop",
                args: {
                    source: "$data.items",
                    steps: {
                        start: {
                            type: "switch",
                            args: {
                                check: "$data.myValue",
                                cases: {
                                    "asset": "add_to_array",
                                }
                            }
                        },
                        add_to_array: {
                            type: "array",
                            action: "add",
                            args: {
                                target: "$item.value",
                                value: 1
                            },
                            next_step: "add_second"
                        },
                    }
                },
                next_step: "end"
            },
            end: {
                type: "object",
                action: "set",
                args: {
                    properties: {
                        "$process.result": "$data.items[0]"
                    }
                }
            }
        }
    }


    // Act
    const result = await crs.process.run({}, process);

    assertEquals(result.value.length, 1, "Add loop step should have been executed");
});
