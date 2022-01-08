export const schema = {
    id: "move-element",

    move_to_list: {
        steps: {
            start: {
                type: "dom",
                action: "move_element",
                args: {
                    query: "#item2",
                    target: "#list2"
                }
            }
        }
    },

    move_in_deck: {
        steps: {
            start: {
                type: "dom",
                action: "move_element",
                args: {
                    query: "#item2",
                    target: "#item1",
                    position: "after"
                }
            }
        }
    },

    move_to_first: {
        steps: {
            start: {
                type: "dom",
                action: "move_element",
                args: {
                    query: "#item2",
                    target: "#item1",
                    position: "before"
                }
            }
        }
    },

    move_to_last: {
        steps: {
            start: {
                type: "dom",
                action: "move_element",
                args: {
                    query: "#item2",
                    target: "#item5",
                    position: "after"
                }
            }
        }
    },

    move_down: {
        steps: {
            start: {
                type: "dom",
                action: "move_element_down",
                args: {
                    query: "#item2"
                }
            }
        }
    },

    move_up: {
        steps: {
            start: {
                type: "dom",
                action: "move_element_up",
                args: {
                    query: "#item2"
                }
            }
        }
    }
}