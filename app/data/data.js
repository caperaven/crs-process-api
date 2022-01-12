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
                { "field": "site", "operator": "==", "value": "Site 1" },
                { "field": "value", "operator": "gt", "value": 10    }
            ]
        }}, this);

        console.table(this.data);

        for (let record of result) {
            console.log(this.data[record]);
        }
    }

    async sortData() {
        const result = await crs.intent.data.sort( { args: {
            source: "$context.data",
            sort: [
                { "name": "site", "direction": "dec" },
                { "name": "value", "direction": "asc" }
            ]
        }}, this)

        for (const item of result) {
            console.log(this.data[item]);
        }
    }

    async aggData() {
        const result = await crs.intent.data.aggregate( { args: {
            source: "$context.data",
            aggregate: {
                "min": "value",
                "max": "value",
                "ave": "value",
                "sum": "value2"
            }
        }}, this)

        console.log(result);
        console.table(this.data);
    }

    async aggGroup() {
        await crs.intent.data.debug();

        let group = await crs.intent.data.group({ args: {
            source: "$context.data",
            fields: ["site", "value"]
        }}, this);

        let result = await crs.intent.data.aggregateGroup({ args: {
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

        const site1 = await crs.intent.data.aggregateGroup({ args: {
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
        const result = await crs.intent.data.iso8601_to_string({args: {value: "PT100H30M10S"}});
        console.log(result);
    }

    async create_db() {
        await crs.intent.db.open({args: {
            db: "test_db",
            version: 1,
            tables: {
                people: {
                    parameters: {
                        keyPath: "id",
                        autoIncrement: true
                    },
                    indexes: {
                        id: { unique: true }
                    }
                }
            }
        }});
    }

    async delete_db() {
        await crs.intent.db.delete({args: {db: "test_db"}});
    }

    async save_record() {
        await crs.intent.db.set_record({
            args: {
                db: "test_db",
                table: "people",
                record: {
                    firstName : "John",
                    lastName : "Smith"
                }
            }
        });
    }

    async add_multiple() {
        await crs.intent.db.add_records({
            args: {
                db: "test_db",
                table: "people",
                records: [
                    {
                        firstName : "Person 1",
                        lastName : "Smith",
                        age: 20
                    },
                    {
                        firstName : "Person 2",
                        lastName : "Johnson",
                        age: 30
                    },
                    {
                        firstName : "Person 3",
                        lastName : "Rover",
                        age: 40
                    }
                ]
            }
        });
    }

    async delete_record() {
        await crs.intent.db.delete_record({
            args: {
                db: "test_db",
                table: "people",
                key: 1
            }
        });
    }

    async clear_table() {
        await crs.intent.db.clear_table({
            args: {
                db: "test_db",
                table: "people"
            }
        });
    }

    async get_record() {
        let result = await crs.intent.db.get_record({
            args: {
                db: "test_db",
                table: "people",
                key: 1
            }
        });

        console.log(result);
    }

    async get_all() {
        let result = await crs.intent.db.get_all({
            args: {
                db: "test_db",
                table: "people"
            }
        });

        console.log(result);
    }

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
}

async function createData(count) {
    let result = [];
    for (let i = 0; i < count; i++) {
        let value = await crs.intent.random.integer({args: {min: 0, max: 100}});
        let value2 = await crs.intent.random.integer({args: {min: -10, max: 10}});

        let site;
        if (value < 20) {
            site = "Site 1";
        }
        else if (value < 60) {
            site = "Site 2"
        }
        else {
            site = "Site 3"
        }

        result.push({
            id      : i,
            code    : `Code ${i}`,
            value   : value,
            value2  : value2,
            site    : site
        })
    }
    return result;
}