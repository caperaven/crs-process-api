import {init} from "./../../mockups/validations-mock-loader.js";
import {validateStepTest} from "./provider-utils";

beforeAll(async () => {
    await init();
})

test("CssGridProvider - validate - init", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "cssgrid",
                    action: "init",
                    args: {
                        element: "#element"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "cssgrid", "test", "start", [
        '"element" must have a value'
    ])
})

test("CssGridProvider - validate - set_columns", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "cssgrid",
                    action: "set_columns",
                    args: {
                        element: "#element",
                        columns: "1fr 1fr"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "cssgrid", "test", "start", [
        '"element" must have a value',
        '"columns" must have a value',
    ])
})

test("CssGridProvider - validate - set_rows ", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "cssgrid",
                    action: "set_rows",
                    args: {
                        element: "#element",
                        rows: "1fr 1fr"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "cssgrid", "test", "start", [
        '"element" must have a value',
        '"rows" must have a value',
    ])
})

test("CssGridProvider - validate - add_columns  ", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "cssgrid",
                    action: "add_columns",
                    args: {
                        element: "#element",
                        width: "100px"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "cssgrid", "test", "start", [
        '"element" must have a value',
        '"width" must have a value',
    ])
})

test("CssGridProvider - validate - remove_columns", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "cssgrid",
                    action: "remove_columns",
                    args: {
                        element: "#element"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "cssgrid", "test", "start", [
        '"element" must have a value'
    ])
})

test("CssGridProvider - validate - set_column_width", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "cssgrid",
                    action: "set_column_width",
                    args: {
                        element: "#element",
                        position: 1,
                        width: "1fr"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "cssgrid", "test", "start", [
        '"element" must have a value',
        '"position" must have a value',
        '"width" must have a value'
    ])
})

test("CssGridProvider - validate - add_rows", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "cssgrid",
                    action: "add_rows",
                    args: {
                        element: "#element",
                        height: "1fr 1fr"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "cssgrid", "test", "start", [
        '"element" must have a value',
        '"height" must have a value',
    ])
})

test("CssGridProvider - validate - remove_columns", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "cssgrid",
                    action: "remove_columns",
                    args: {
                        element: "#element"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "cssgrid", "test", "start", [
        '"element" must have a value'
    ])
})

test("CssGridProvider - validate - remove_rows", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "cssgrid",
                    action: "remove_rows",
                    args: {
                        element: "#element"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "cssgrid", "test", "start", [
        '"element" must have a value'
    ])
})

test("CssGridProvider - validate - set_row_height", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "cssgrid",
                    action: "set_row_height",
                    args: {
                        element: "#element",
                        position: 1,
                        height: "1fr"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "cssgrid", "test", "start", [
        '"element" must have a value',
        '"position" must have a value',
        '"height" must have a value'
    ])
})

test("CssGridProvider - validate - set_regions", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "cssgrid",
                    action: "set_regions",
                    args: {
                        element: "#element",
                        areas: []
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "cssgrid", "test", "start", [
        '"element" must have a value',
        '"areas" must have a value'
    ])
})

test("CssGridProvider - validate - column_count", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "cssgrid",
                    action: "column_count",
                    args: {
                        element: "#element"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "cssgrid", "test", "start", [
        '"element" must have a value'
    ])
})

test("CssGridProvider - validate - row_count", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "cssgrid",
                    action: "row_count",
                    args: {
                        element: "#element"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "cssgrid", "test", "start", [
        '"element" must have a value'
    ])
})