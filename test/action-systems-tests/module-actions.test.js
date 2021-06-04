import {Modules} from "./../../third-party/crs-modules.js";
import {ModuleActions} from "./../../src/action-systems/module-actions.js";
import {loadBinding} from "./../mockups/crsbinding.mock.js";


beforeAll(async () => {
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
                    target: "@context.result",
                    context: "@context"
                }
            }
        }
    }

    await crs.process.run(context, process);
    expect(context.result).toEqual("Hello World - updated")
})