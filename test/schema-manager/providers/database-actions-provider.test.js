import {init} from "./../../mockups/validations-mock-loader.js";
import {validateStepTest} from "./provider-utils";

beforeAll(async () => {
    await init();
})

test("db-actions - validate - add_record", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "db",
                    action: "add_record",
                    args: {
                        db: "db",
                        store: "store",
                        model: {}
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "db", "test", "start", [
        '"db" must have a value',
        '"store" must have a value',
        '"model" must have a value',
    ])
})

test("db-actions - validate - calculate_paging", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "db",
                    action: "calculate_paging",
                    args: {
                        db: "db",
                        store: "store",
                        page_size: 1,
                        target: "$context.target"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "db", "test", "start", [
        '"db" must have a value',
        '"store" must have a value',
        '"page_size" must have a value',
        '"target" must have a value'
    ])
})

test("db-actions - validate - clear", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "db",
                    action: "clear",
                    args: {
                        db: "db",
                        store: "store"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "db", "test", "start", [
        '"db" must have a value',
        '"store" must have a value'
    ])
})

test("db-actions - validate - close", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "db",
                    action: "close",
                    args: {
                        db: "db"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "db", "test", "start", [
        '"db" must have a value'
    ])
})

test("db-actions - validate - create_data_dump", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "db",
                    action: "create_data_dump",
                    args: {
                        name: "db",
                        tables: {},
                        store: "test",
                        records: [],
                        target: "$context.target"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "db", "test", "start", [
        '"name" must have a value',
        '"tables" must have a value',
        '"store" must have a value',
        '"records" must have a value',
        '"target" must have a value'
    ])
})

test("db-actions - validate - get_from_index", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "db",
                    action: "get_from_index",
                    args: {
                        db: "db",
                        store: "test",
                        keys: [],
                        target: "$context.target"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "db", "test", "start", [
        '"db" must have a value',
        '"store" must have a value',
        '"keys" must have a value',
        '"target" must have a value'
    ])
})

test("db-actions - validate - get_all", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "db",
                    action: "get_all",
                    args: {
                        db: "db",
                        store: "test",
                        target: "$context.target"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "db", "test", "start", [
        '"db" must have a value',
        '"store" must have a value',
        '"target" must have a value'
    ])
})

test("db-actions - validate - clear", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "db",
                    action: "clear",
                    args: {
                        db: "db",
                        store: "test"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "db", "test", "start", [
        '"db" must have a value',
        '"store" must have a value'
    ])
})

test("db-actions - validate - delete_record", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "db",
                    action: "delete_record",
                    args: {
                        db: "db",
                        store: "test",
                        key: []
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "db", "test", "start", [
        '"db" must have a value',
        '"store" must have a value',
        '"key" must have a value',
    ])
})

test("db-actions - validate - update_record", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "db",
                    action: "update_record",
                    args: {
                        db: "db",
                        store: "test",
                        key: [],
                        model: {}
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "db", "test", "start", [
        '"db" must have a value',
        '"store" must have a value',
        '"key" must have a value',
        '"model" must have a value',
    ])
})

test("db-actions - validate - add_record", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "db",
                    action: "add_record",
                    args: {
                        db: "db",
                        store: "test",
                        model: {}
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "db", "test", "start", [
        '"db" must have a value',
        '"store" must have a value',
        '"model" must have a value',
    ])
})

test("db-actions - validate - get_batch", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "db",
                    action: "get_batch",
                    args: {
                        db: "db",
                        store: "test",
                        start: 1,
                        end: 2,
                        target: "$context.target"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "db", "test", "start", [
        '"db" must have a value',
        '"store" must have a value',
        '"start" must have a value',
        '"end" must have a value',
        '"target" must have a value'
    ])
})

test("db-actions - validate - get_values", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "db",
                    action: "get_values",
                    args: {
                        db: "db",
                        store: "test",
                        field: "field1",
                        target: "$context.target"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "db", "test", "start", [
        '"db" must have a value',
        '"store" must have a value',
        '"field" must have a value',
        '"target" must have a value'
    ])
})

test("db-actions - validate - calculate_paging", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "db",
                    action: "calculate_paging",
                    args: {
                        db: "db",
                        store: "test",
                        page_size: 10,
                        target: "$context.target"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "db", "test", "start", [
        '"db" must have a value',
        '"store" must have a value',
        '"page_size" must have a value',
        '"target" must have a value'
    ])
})

test("db-actions - validate - get_page", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "db",
                    action: "calculate_paging",
                    args: {
                        db: "db",
                        store: "test",
                        page_size: 10,
                        target: "$context.target"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "db", "test", "start", [
        '"db" must have a value',
        '"store" must have a value',
        '"page_size" must have a value',
        '"target" must have a value'
    ])
})

test("db-actions - validate - get_range", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "db",
                    action: "get_range",
                    args: {
                        db: "db",
                        store: "test",
                        field: "field",
                        target: "$context.target"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "db", "test", "start", [
        '"db" must have a value',
        '"store" must have a value',
        '"field" must have a value',
        '"target" must have a value'
    ])
})

test("db-actions - validate - get_values", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "db",
                    action: "get_values",
                    args: {
                        db: "db",
                        store: "test",
                        field: "field",
                        target: "$context.target"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "db", "test", "start", [
        '"db" must have a value',
        '"store" must have a value',
        '"field" must have a value',
        '"target" must have a value'
    ])
})

test("db-actions - validate - open", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "db",
                    action: "open",
                    args: {
                        name: "test",
                        version: 1,
                        tables: {},
                        target: "$context.target"
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "db", "test", "start", [
        '"name" must have a value',
        '"version" must have a value',
        '"tables" must have a value',
        '"target" must have a value'
    ])
})

test("db-actions - validate - update_record", async () => {
    const schema = {
        test: {
            steps: {
                start: {
                    type: "db",
                    action: "update_record",
                    args: {
                        db: "db",
                        store: "test",
                        key: 1,
                        model: {}
                    }
                }
            }
        }
    }

    await validateStepTest(schema, "db", "test", "start", [
        '"db" must have a value',
        '"store" must have a value',
        '"key" must have a value',
        '"model" must have a value'
    ])
})