import {init} from "./../../mockups/validations-mock-loader.js";
import {validateStepTest} from "./provider-utils";

beforeAll(async () => {
    await init();
})

test("dom-actions - validate - call_on_element", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "dom",
                    action: "call_on_element",
                    args: {
                        element: "#element",
                        action: "fn",
                        parameters: [],
                        target: "$context.target"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "dom", "test", "start", [
        '"element" must have a value',
        '"action" must have a value',
        '"parameters" must have a value',
        '"target" must have a value'
    ])
})

test("dom-actions - validate - get_property", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "dom",
                    action: "get_property",
                    args: {
                        element: "#element",
                        property: "prop",
                        target: "$context.target"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "dom", "test", "start", [
        '"element" must have a value',
        '"property" must have a value',
        '"target" must have a value'
    ])
})

test("dom-actions - validate - set_properties", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "dom",
                    action: "set_properties",
                    args: {
                        element: "#element",
                        properties: {}
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "dom", "test", "start", [
        '"element" must have a value',
        '"properties" must have a value'
    ])
})

test("dom-actions - validate - set_attribute", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "dom",
                    action: "set_attribute",
                    args: {
                        element: "#element",
                        attr: "data-id",
                        value: "test"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "dom", "test", "start", [
        '"element" must have a value',
        '"attr" must have a value',
        '"value" must have a value'
    ])
})

test("dom-actions - validate - get_attribute", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "dom",
                    action: "get_attribute",
                    args: {
                        element: "#element",
                        attr: "data-id",
                        target: "$context.target"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "dom", "test", "start", [
        '"element" must have a value',
        '"attr" must have a value',
        '"target" must have a value'
    ])
})

test("dom-actions - validate - add_class", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "dom",
                    action: "add_class",
                    args: {
                        element: "#element",
                        value: "class1"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "dom", "test", "start", [
        '"element" must have a value',
        '"value" must have a value'
    ])
})

test("dom-actions - validate - remove_class", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "dom",
                    action: "remove_class",
                    args: {
                        element: "#element",
                        value: "class1"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "dom", "test", "start", [
        '"element" must have a value',
        '"value" must have a value'
    ])
})

test("dom-actions - validate - set_style", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "dom",
                    action: "set_style",
                    args: {
                        element: "#element",
                        style: "background",
                        value: "red"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "dom", "test", "start", [
        '"element" must have a value',
        '"style" must have a value',
        '"value" must have a value'
    ])
})

test("dom-actions - validate - set_styles", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "dom",
                    action: "set_styles",
                    args: {
                        element: "#element",
                        styles: {
                            background: "red"
                        }
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "dom", "test", "start", [
        '"element" must have a value',
        '"styles" must have a value'
    ])
})

test("dom-actions - validate - get_style", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "dom",
                    action: "get_style",
                    args: {
                        element: "#element",
                        styles: {
                            background: "red"
                        },
                        target: "$context.target"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "dom", "test", "start", [
        '"element" must have a value',
        '"styles" must have a value',
        '"target" must have a value'
    ])
})

test("dom-actions - validate - set_text", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "dom",
                    action: "set_text",
                    args: {
                        element: "#element",
                        value: "test"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "dom", "test", "start", [
        '"element" must have a value',
        '"value" must have a value'
    ])
})

test("dom-actions - validate - get_text", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "dom",
                    action: "get_text",
                    args: {
                        element: "#element",
                        target: "$context.target"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "dom", "test", "start", [
        '"element" must have a value',
        '"target" must have a value'
    ])
})

test("dom-actions - validate - create_element", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "dom",
                    action: "create_element",
                    args: {
                        parent: "#element",
                        tag_name: "$context.target"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "dom", "test", "start", [
        '"parent" must have a value',
        '"tag_name" must have a value'
    ])
})

test("dom-actions - validate - remove_element", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "dom",
                    action: "remove_element",
                    args: {
                        parent: "#element"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "dom", "test", "start", [
        '"parent" must have a value'
    ])
})

test("dom-actions - validate - clear_element", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "dom",
                    action: "clear_element",
                    args: {
                        element: "#element"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "dom", "test", "start", [
        '"element" must have a value'
    ])
})

test("dom-actions - validate - show_widget_dialog", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "dom",
                    action: "show_widget_dialog",
                    args: {
                        id: "element",
                        html: "$template.process-dialog",
                        url: "$fn.getTemplate"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "dom", "test", "start", [
        '"id" must have a value',
        '"html" must have a value',
        '"url" must have a value'
    ])
})

test("dom-actions - validate - show_form_dialog", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "dom",
                    action: "show_form_dialog",
                    args: {
                        id: "element",
                        html: "$template.process-dialog",
                        url: "$fn.getTemplate",
                        error_store: "errors"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "dom", "test", "start", [
        '"id" must have a value',
        '"html" must have a value',
        '"url" must have a value',
        '"error_store" must have a value'
    ])
})

test("dom-actions - validate - set_widget", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "dom",
                    action: "set_widget",
                    args: {
                        query: "element",
                        context: "$context",
                        html: "$template.process-dialog",
                        url: "$fn.getTemplate"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "dom", "test", "start", [
        '"query" must have a value',
        '"context" must have a value',
        '"html" must have a value',
        '"url" must have a value'
    ])
})

test("dom-actions - validate - clear_widget", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "dom",
                    action: "clear_widget",
                    args: {
                        element: "#element"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "dom", "test", "start", [
        '"element" must have a value'
    ])
})

test("dom-actions - validate - move_element", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "dom",
                    action: "move_element",
                    args: {
                        element: "#element",
                        target: "$context.target"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "dom", "test", "start", [
        '"element" must have a value',
        '"target" must have a value'
    ])
})

test("dom-actions - validate - move_element_down", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "dom",
                    action: "move_element_down",
                    args: {
                        element: "#element"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "dom", "test", "start", [
        '"element" must have a value'
    ])
})

test("dom-actions - validate - move_element_up", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "dom",
                    action: "move_element_up",
                    args: {
                        element: "#element"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "dom", "test", "start", [
        '"element" must have a value'
    ])
})

test("dom-actions - validate - filter_children", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "dom",
                    action: "filter_children",
                    args: {
                        element: "#element",
                        filter: ""
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "dom", "test", "start", [
        '"element" must have a value',
        '"filter" must have a value'
    ])
})

test("dom-actions - validate - open_tab", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "dom",
                    action: "open_tab",
                    args: {
                        url: "https://something.com",
                        parameters: []
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "dom", "test", "start", [
        '"url" must have a value',
        '"parameters" must have a value'
    ])
})

test("dom-actions - validate - clone_for_movement", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "dom",
                    action: "clone_for_movement",
                    args: {
                        element: "#element",
                        parent: "#parent"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "dom", "test", "start", [
        '"element" must have a value',
        '"parent" must have a value'
    ])
})

test("dom-actions - validate - elements_from_template", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "dom",
                    action: "elements_from_template",
                    args: {
                        template_id: "#element",
                        data: [],
                        parent: "#parent"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "dom", "test", "start", [
        '"template_id" must have a value',
        '"data" must have a value',
        '"parent" must have a value'
    ])
})

test("dom-actions - validate - update_cells", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "dom",
                    action: "update_cells",
                    args: {
                        template_id: "#element",
                        data: [],
                        parent: "#parent"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "dom", "test", "start", [
        '"template_id" must have a value',
        '"data" must have a value',
        '"parent" must have a value'
    ])
})

test("dom-actions - validate - create_inflation_template", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "dom",
                    action: "create_inflation_template",
                    args: {
                        element: "#element",
                        source: [],
                        tag_name: "div"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "dom", "test", "start", [
        '"element" must have a value',
        '"source" must have a value',
        '"tag_name" must have a value'
    ])
})

test("dom-actions - validate - get_element", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "dom",
                    action: "get_element",
                    args: {
                        element: "#element",
                        target: "#target"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "dom", "test", "start", [
        '"element" must have a value',
        '"target" must have a value'
    ])
})