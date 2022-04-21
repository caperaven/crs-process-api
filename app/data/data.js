import "./../../src/action-systems/data-actions.js";

export default class Data extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
    }

    async buildData() {
        this.data = await createData(10);
        console.log("data loaded done");
    }

    async groupData() {
        const result = await crs.intent.data.group({ args: {
            source: "$context.data",
            fields: ["site", "value"]
        }}, this);

        console.log(result);
    }

    async filterData() {
        const result = await crs.intent.data.filter({ args: {
            source: "$context.data",
            filter: [
                { "field": "site", "operator": "==", "value": "site 1" },
                { "field": "value", "operator": "gt", "value": 10    }
            ],
            case_sensitive: false
        }}, this);

        console.table(this.data);

        for (let record of result) {
            console.log(this.data[record]);
        }
    }

    async filterPath() {
        const result = await crs.intent.data.filter({ args: {
                source: "$context.data",
                filter: [
                    { "field": "person.age", "operator": ">", "value": 50 }
                ],
                case_sensitive: false
            }}, this);

        console.table(this.data);

        for (let record of result) {
            console.log(this.data[record]);
        }
    }

    async inFilter() {
        let result = await crs.intent.data.in_filter({ args: {
            source: {site: "Site 1", value: 15},
            filter: [
                { "field": "site", "operator": "==", "value": "site 1" },
                { "field": "value", "operator": "gt", "value": 10    }
            ],
            case_sensitive: false
        }}, this);

        console.log(result);

        result = await crs.intent.data.in_filter({ args: {
                source: {site: "Site 1", value: 5},
                filter: [
                    { "field": "site", "operator": "==", "value": "site 1" },
                    { "field": "value", "operator": "gt", "value": 10    }
                ],
                case_sensitive: false
            }}, this);

        console.log(result);
    }

    async sortData() {
        const result = await crs.intent.data.sort( { args: {
            source: "$context.data",
            sort: [
                { "name": "site", "direction": "dec" },
                { "name": "value", "direction": "asc" }
            ]
        }}, this)

        const print = [];
        for (const item of result) {
            print.push(this.data[item]);
        }
        console.table(print);
    }

    async sortDuration() {
        const data = [
            {value: "PT010H40M00S"},
            {value: "PT001H00M00S"},
            {value: "PT000H10M00S"},
            {value: "PT010H00M00S"},
        ]

        const result = await crs.intent.data.sort( { args: {
                source: data,
                sort: [
                    { "name": "value", "direction": "asc" }
                ]
            }}, this)

        const print = [];
        for (const item of result) {
            print.push(data[item]);
        }
        console.table(print);
    }

    async aggData() {
        const result = await crs.intent.data.aggregate( { args: {
            source: "$context.data",
            aggregate: {
                "min": "value",
                "max": "value",
                "ave": "value",
                "sum": "value2",
                "count": "duration",
                "min:duration": "duration",
                "max:duration": "duration",
                "ave:duration": "duration"
            }
        }}, this)

        console.log(result);
        console.table(this.data);
    }

    async unique() {
        await crs.intent.data.debug();

        let result = await crs.intent.data.unique_values({args: {
                source: "$context.data",
                fields: [{"name": "site"}, {"name": "value2", "type": "number"}]
        }}, this);

        console.log(result);
    }

    async aggGroup() {
        let group = await crs.intent.data.group({ args: {
            source: "$context.data",
            fields: ["site", "value"]
        }}, this);

        let result = await crs.intent.data.aggregate_group({ args: {
            source: "$context.data",
            group: group,
            aggregate: {
                "min": "value",
                "max": "value",
                "ave": "value",
                "sum": "value2"
            }
        }}, this);

        console.log(result);
        group = result.root.children["Site 1"];

        const site1 = await crs.intent.data.aggregate_group({ args: {
                source: "$context.data",
                group: group,
                aggregate: {
                    "min": "value",
                    "max": "value",
                    "ave": "value",
                    "sum": "value2"
                }
            }}, this);

        result.root.children["Site 1"] = site1;
        console.log(result);
    }

    async convertDuration() {
        const result = await crs.intent.data.iso8601_to_string({args: {value: "P0DT0H9M30.200954S"}});
        console.log(result);
    }

    async convertDurationBatch() {
        let result = await crs.intent.data.iso8601_batch({args: {value: ["P0DT0H9M30.200954S", "P10DT0H9M"]}});
        console.log(result);

        result = await crs.intent.data.iso8601_batch({args: {
            value: [
                {
                    value: "P0DT0H9M30.200954S",
                    count: 2
                },
                {
                    value: "P10DT0H9M",
                    count: 3
                }
            ],
            field: "value"
        }});

        console.log(result);
    }

    async assertObj() {
        let result = await crs.intent.data.assert_equal({ args: {
                source: {person: {name: "John"}},
                expr: {"field": "person.name", "operator": "==", "value": "John"}
            }})

        console.log(result);

        result = await crs.intent.data.assert_equal({ args: {
                source: {person: {name: "John"}},
                expr: {"field": "person.name", "operator": "==", "value": "Jane"}
            }})

        console.log(result);
    }

    // -------- INDEX DB ------- //

    async batches_db() {
        const data = await createData(100, this._dataId);

        let db = await crs.intent.db.create_data_dump({args: {
                name: "batch_db",
                version: 1,
                tables: {
                    data: {
                        indexes: {
                            id: { unique: true }
                        }
                    }
                },
                store: "data",
                records: data
            }});

        let batch = await crs.intent.db.get_batch({ args: {
            db: db,
            store: "data",
            start: 0,
            end: 9
        }})

        console.log(batch);

        batch = await crs.intent.db.get_batch({ args: {
                db: db,
                store: "data",
                start: 10,
                end: 19
            }})

        console.log(batch);

        db.close();
    }

    async get_values() {
        const data = await createData(100, this._dataId);

        let db = await crs.intent.db.create_data_dump({args: {
                name: "batch_db",
                version: 1,
                tables: {
                    data: {
                        indexes: {
                            id: { unique: true }
                        }
                    }
                },
                store: "data",
                records: data
            }});

        const result = await crs.intent.db.get_values({ args: {
            db: db,
            store: "data",
            fields: ["code", "number"]
        }});

        console.log(result);
    }

    async create_page_data() {
        const data = await createData(100, this._dataId);

        let db = await crs.intent.db.create_data_dump({args: {
                name: "batch_db",
                version: 1,
                tables: {
                    data: {
                        indexes: {
                            id: { unique: true }
                        }
                    }
                },
                store: "data",
                records: data
            }});

        db.close();
    }

    async calculate_paging() {
        const db = await crs.intent.db.open({args: {
            name: "batch_db"
        }})

        const result = await crs.intent.db.calculate_paging({ args: {
                db: db,
                store: "data",
                page_size: 10
            }});

        console.log(result);

        for (let page of [0, 1, 2]) {
            const page1 = await crs.intent.db.get_page({args: {
                db: db,
                store: "data",
                page_size: 10,
                page_number: page,
                fields: ["id", "code", "number"]
            }})
            console.table(page1);
        }

        const range = await crs.intent.db.get_range({ args: {
                db: db,
                store: "data",
                field: "number"
            }})

        console.log(range);
    }

    async create_db() {
        this.db = await crs.intent.db.open({args: {
            name: "test_db",
            version: 1,
            tables: {
                people: {
                    indexes: {
                        id: { unique: true }
                    }
                }
            }
        }});
    }

    async open_db() {
        this.db = await crs.intent.db.open({args: {
            name: "test_db",
            version: 1,
        }});
    }

    async delete_db() {
        await crs.intent.db.delete({args: {name: "test_db"}});
    }

    async close_db() {
        this.db = await crs.intent.db.close({args: {db: this.db}});
    }

    async dump_db() {
        await crs.intent.db.dump({args: {db: this.db, store: "people", records: [
            {
                name: "John"
            },
            {
                name: "Jane"
            }
        ]}})
    }

    async get_from_index_db() {
        let result = await crs.intent.db.get_from_index({args: {db: this.db, store: "people", keys: [0, 1]}});
        console.table(result);
    }

    async get_all_db() {
        let result = await crs.intent.db.get_all({ args: {db: this.db, store: "people"}});
        console.log(result);
    }

    async clear_db() {
        await crs.intent.db.clear({ args: {db: this.db, store: "people"}});
    }

    async delete_record_db() {
        await crs.intent.db.delete_record({args: {db: this.db, store: "people", key: 0}});
    }

    async update_record_db() {
        await crs.intent.db.update_record({args: {db: this.db, store: "people", key: 1, model: {name: "Updated"}}});
    }

    async add_record_db() {
        await crs.intent.db.add_record({args: {db: this.db, store: "people", model: {name: "Added"}}});
    }

    // -------- STORE ------- //

    async save_value() {
        await crs.intent.storage.set_value({
            args: {
                key: "name",
                value: "John Doe"
            }
        })
    }

    async get_value() {
        const result = await crs.intent.storage.get_value({args: {key: "name"}});
        alert(result);
    }

    async save_object() {
        await crs.intent.storage.set_object({args: {
            key: "person",
            value: {
                firstName: "John",
                lastName: "Doe"
            }
        }})
    }

    async get_object() {
        const result = await crs.intent.storage.get_object({args: {key: "person"}});
        console.log(result);
    }

    async session_save_value() {
        await crs.intent.session.set_value({
            args: {
                key: "name",
                value: "John Doe"
            }
        })
    }

    async session_get_value() {
        const result = await crs.intent.session.get_value({args: {key: "name"}});
        alert(result);
    }

    async session_save_object() {
        await crs.intent.session.set_object({args: {
                key: "person",
                value: {
                    firstName: "John",
                    lastName: "Doe"
                }
            }})
    }

    async session_get_object() {
        const result = await crs.intent.session.get_object({args: {key: "person"}});
        console.log(result);
    }

    async create_tables() {
        const db = await crs.intent.db.open({args: {
            name: "test_db",
            version: 1,
            tables: {
                test1: {
                    indexes: {
                        id: { unique: true }
                    }
                },
                test2: {
                    indexes: {
                        id: { unique: true }
                    }
                }
            },
            add_timestamp: true
        }});

        await db.dump("test1", [
            { id: 0, code: "Code 0" },
            { id: 1, code: "Code 1" },
            { id: 2, code: "Code 2" }
        ]);

        await db.dump("test2", [
            { id: 0, code: "Code 5" },
            { id: 1, code: "Code 6" },
            { id: 2, code: "Code 7" }
        ])
    }

    async delete_old() {
        crs.call("db", "delete_old", {days: 0.00005})
    }
}

async function createData(count) {
    let result = [];
    for (let i = 0; i < count; i++) {
        let value = await crs.intent.random.integer({args: {min: 0, max: 100}});
        let value2 = await crs.intent.random.integer({args: {min: -10, max: 10}});
        let age = await crs.intent.random.integer({args: {min: 20, max: 60}});

        let site;
        let duration;
        if (value < 20) {
            site = "Site 1";
            duration = "PT1H"
        }
        else if (value < 60) {
            site = "Site 2"
            duration = "PT3H20M"
        }
        else {
            site = "Site 3"
            duration = "PT20S"
        }

        result.push({
            id       : i,
            code     : `Code ${i}`,
            value    : value,
            value2   : i % 3 ? null : value2,
            person   : {
                age  : age
            },
            site     : site,
            duration : duration
        })
    }
    return result;
}

