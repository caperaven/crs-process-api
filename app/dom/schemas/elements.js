export const schema = {
    id: "dom-example",

    main: {
        data: {
        },
        steps: {
            start: { next_step: "clear" },

            clear: {
                type: "dom",
                action: "clear_element",
                args: {
                    element: "#container"
                },
                next_step: "create"
            },

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
                    element: "#element1",
                    attr: "data-value",
                    value: 10
                },
                next_step: "get_attribute"
            },
            get_attribute: {
                type: "dom",
                action: "get_attribute",
                args: {
                    element: "#element1",
                    attr: "data-value",
                    target: "$process.data.value"
                },
                next_step: "set_text"
            },
            set_text: {
                type: "dom",
                action: "set_text",
                args: {
                    element: "#element3",
                    value: "$process.data.value"
                },
                next_step: "set_style"
            },
            set_style: {
                type: "dom",
                action: "set_style",
                args: {
                    element: "#element3",
                    style: "background",
                    value: "#ff0090"
                },
                next_step: "get_background"
            },
            get_background: {
                type: "dom",
                action: "get_style",
                args: {
                    element: "#element3",
                    style: "background",
                    target: "$process.data.color"
                },
                next_step: "set_colorText"
            },
            set_colorText: {
                type: "dom",
                action: "set_text",
                args: {
                    element: "#element4",
                    value: "$process.data.color"
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
                    parent: "#container",
                    tag_name: "div",
                    text_content: "Element 1",
                    classes: ["class1", "class2"]
                },
                next_step: "create2"
            },

            create2: {
                type: "dom",
                action: "create_element",
                args: {
                    id: "element2",
                    parent: "#container",
                    tag_name: "div",
                    text_content: "Element 2"
                },
                next_step: "create3"
            },

            create3: {
                type: "dom",
                action: "create_element",
                args: {
                    id: "element3",
                    parent: "#container",
                    tag_name: "div",
                    text_content: "Element 3"
                },
                next_step: "create4"
            },

            create4: {
                type: "dom",
                action: "create_element",
                args: {
                    id: "element4",
                    parent: "#container",
                    tag_name: "div",
                    text_content: "Element 4"
                }
            }
        }
    },

    clear: {
        steps: {
            start: {
                type: "dom",
                action: "clear_element",
                args: {
                    element: "#container"
                }
            }
        }
    },

    clone: {
        steps: {
            start: {
                type: "dom",
                action: "clone_for_movement",
                args: {
                    element: "#clickClone",
                    parent: "#cloneTarget",
                    position: {x: 300, y: 0}
                }
            }
        }
    },

    composite: {
        steps: {
            start: {
                type: "dom",
                action: "create_element",
                args: {
                    id: "composite",
                    parent: "#container",
                    tag_name: "div",
                    children: [
                        {
                            id: "cbSelect",
                            tag_name: "input",
                            attributes: {
                                "type": "checkbox",
                                "data-id": "1"
                            }
                        },
                        {
                            tag_name: "span",
                            text_content: "Hello World"
                        }
                    ]
                }
            }
        }
    }
}