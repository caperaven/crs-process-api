export const schema = {
    id: "dom-example",

    main: {
        data: {
        },
        steps: {
            start: { next_step: "create" },
            create: {
                type: "process",
                action: "create_ui",
                args: {
                    schema: "dom-example"
                },
                next_step: "set_attributes"
            },
            set_attributes: {
                type: "dom",
                action: "set_attribute",
                args: {
                    query: "#element1",
                    attr: "data-value",
                    value: 10
                },
                next_step: "get_attribute"
            },
            get_attribute: {
                type: "dom",
                action: "get_attribute",
                args: {
                    query: "#element1",
                    attr: "data-value",
                    target: "@process.data.value"
                },
                next_step: "set_text"
            },
            set_text: {
                type: "dom",
                action: "set_text",
                args: {
                    query: "#element3",
                    value: "@process.data.value"
                },
                next_step: "set_style"
            },
            set_style: {
                type: "dom",
                action: "set_style",
                args: {
                    query: "#element3",
                    style: "background",
                    value: "#ff0090"
                },
                next_step: "get_background"
            },
            get_background: {
                type: "dom",
                action: "get_style",
                args: {
                    query: "#element3",
                    style: "background",
                    target: "@process.data.color"
                },
                next_step: "set_colorText"
            },
            set_colorText: {
                type: "dom",
                action: "set_text",
                args: {
                    query: "#element4",
                    value: "@process.data.color"
                }
            },
        }
    },

    create_ui: {
        steps: {
            start: { next_step: "create1" },

            create1: {
                type: "dom",
                action: "create_element",
                args: {
                    id: "element1",
                    parentQuery: "#container",
                    tagName: "div",
                    textContent: "Element 1"
                },
                next_step: "create2"
            },

            create2: {
                type: "dom",
                action: "create_element",
                args: {
                    id: "element2",
                    parentQuery: "#container",
                    tagName: "div",
                    textContent: "Element 2"
                },
                next_step: "create3"
            },

            create3: {
                type: "dom",
                action: "create_element",
                args: {
                    id: "element3",
                    parentQuery: "#container",
                    tagName: "div",
                    textContent: "Element 3"
                },
                next_step: "create4"
            },

            create4: {
                type: "dom",
                action: "create_element",
                args: {
                    id: "element4",
                    parentQuery: "#container",
                    tagName: "div",
                    textContent: "Element 4"
                }
            }
        }
    }
}