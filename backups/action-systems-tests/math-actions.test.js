import {loadBinding} from "../mockups/crsbinding.mock.js";

const logs = {
    log: null
}

beforeAll(async () => {
    await loadBinding();
    await import("./../../src/index.js");
    global.console = {
        log: (msg) => logs.log = msg,
    }
})

test("MathActions - add", async () => {
    const process = {
        steps: {
            start: {
                next_step: "add"
            },
            add: {
                type: "math",
                action: "add",
                args: {
                    value1: 10,
                    value2: 11,
                    target: "$process.result",
                    log: "$process.result"
                }
            }
        }
    }

    const result = await crs.process.run(null, process);
    expect(result).toEqual(21);
    expect(logs.log).toEqual(21);
})

test("MathActions - subtract", async () => {
    const process = {
        steps: {
            start: {
                next_step: "subtract"
            },
            subtract: {
                type: "math",
                action: "subtract",
                args: {
                    value1: 10,
                    value2: 11,
                    target: "$process.result"
                }
            }
        }
    }

    const result = await crs.process.run(null, process);
    expect(result).toEqual(-1);
})

test("MathActions - multiply", async () => {
    const process = {
        functions: {},
        steps: {
            start: {
                next_step: "multiply"
            },
            multiply: {
                type: "math",
                action: "multiply",
                args: {
                    value1: 10,
                    value2: 1,
                    target: "$process.result"
                }
            }
        }
    }

    const result = await crs.process.run(null, process);
    expect(result).toEqual(10);
})

test("MathActions - divide", async () => {
    const process = {
        steps: {
            start: {
                next_step: "divide"
            },
            divide: {
                type: "math",
                action: "divide",
                args: {
                    value1: 10,
                    value2: 1,
                    target: "$process.result"
                }
            }
        }
    }

    const result = await crs.process.run(null, process);
    expect(result).toEqual(10);
})

test("MathActions - sin", async () => {
    const process = {
        steps: {
            start: {
                next_step: "sin"
            },
            sin: {
                type: "math",
                action: "sin",
                args: {
                    value: [90],
                    target: "$process.result"
                }
            }
        }
    }

    const result = await crs.process.run(null, process);
    expect(result).toEqual(0.8939966636005579);
})

test("MathActions - max", async () => {
    const process = {
        data: {
            max: 0
        },
        steps: {
            start: {
                next_step: "max"
            },
            max: {
                type: "math",
                action: "max",
                args: {
                    value: ["$process.data.max", 90],
                    target: "$process.data.max"
                },
                next_step: "max2"
            },
            max2: {
                type: "math",
                action: "max",
                args: {
                    value: ["$process.data.max", 100],
                    target: "$process.result"
                },
            }
        }
    }

    const result = await crs.process.run(null, process);
    expect(result).toEqual(100);
})