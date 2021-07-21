import {Modules} from "./../../third-party/crs-modules.js";
import {ModuleActions} from "./../../src/action-systems/module-actions.js";
import {loadBinding} from "./../mockups/crsbinding.mock.js";


beforeAll(async () => {
    await crs.modules.add("class", "./../test/modules/class.js");
    await crs.modules.add("default-class", "./../test/modules/default-class.js");
    await crs.modules.add("default-function", "./../test/modules/default-function.js");
    await crs.modules.add("utils", "./../test/modules/utils.js");
    await loadBinding();
    await import("./../../src/index.js");
})

test("module actions - call function", async () => {
    const context = {}
    const process = {
        steps: {
            start: {
                next_step: "updateMessage"
            },
            updateMessage: {
                type: "module",
                action: "call",
                args: {
                    module: "utils",
                    fnName: "updateMessage",
                    parameters: "Hello World",
                    target: "$context.result",
                    context: "$context"
                }
            }
        }
    }

    await crs.process.run(context, process);
    expect(context.result).toEqual("Hello World - updated")
})

test("module actions - call default function", async () => {
    const context = {}
    const process = {
        steps: {
            start: {
                next_step: "updateMessage"
            },
            updateMessage: {
                type: "module",
                action: "call",
                args: {
                    module: "default-function",
                    default: true,
                    target: "$context.result",
                    context: "$context"
                }
            }
        }
    }

    await crs.process.run(context, process);
    expect(context.result).toEqual("Hello From Default")
})

test("module actions - create class", async () => {
    const context = {}
    const process = {
        steps: {
            start: {
                next_step: "create"
            },
            create: {
                type: "module",
                action: "create_class",
                args: {
                    module: "class",
                    class: "MyClass",
                    target: "$context.instance"
                }
            }
        }
    }

    await crs.process.run(context, process);
    expect(context.instance.name).toEqual("MyClass")
})

test("module actions - create default class", async () => {
    const context = {}
    const process = {
        steps: {
            start: {
                next_step: "create"
            },
            create: {
                type: "module",
                action: "create_class",
                args: {
                    module: "default-class",
                    default: true,
                    target: "$context.instance"
                }
            }
        }
    }

    await crs.process.run(context, process);
    expect(context.instance.name).toEqual("Default")
})

test("module actions - get constant value", async () => {
    const context = {}
    const process = {
        steps: {
            start: {
                next_step: "get"
            },
            get: {
                type: "module",
                action: "get_constant",
                args: {
                    module: "utils",
                    name: "GlobalValue",
                    target: "$context.instance"
                }
            }
        }
    }

    await crs.process.run(context, process);
    expect(context.instance).toEqual("I am global");
})


