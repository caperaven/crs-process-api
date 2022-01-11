import init, {init_panic_hook, filter_data, group_data, sort_data, iso8601_to_string} from "./../../src/bin/data.js";

init();

export default class Data extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
    }

    async buildData() {
        this.data = await createData(10);
        console.log("data loaded done");
    }

    async groupData() {
        let json = JSON.stringify(this.data);
        let fields = JSON.stringify(["site", "value"]);

        let start = performance.now();
        let result = group_data(fields, json);
        let end = performance.now();
        console.log(`group time: ${end - start} milliseconds`);
        console.log(result);


        let group = crs.intent.perspective.group({args: {
            data: "$context.data",
            fields: ["site", "value"]
        }}, context);
    }

    async filterData() {
        let json = JSON.stringify(this.data);

        let intent = JSON.stringify([
            { "field": "site", "operator": "==", "value": "Site 1" },
            { "field": "value", "operator": "==", "value": 1 },
        ]);

        let start = performance.now();
        let result = filter_data(intent, json);
        let end = performance.now();

        console.log(`filter time: ${end - start} milliseconds - result: ${result.length}`);

        for (let i = 0; i < 10; i++) {
            let index = result[i];
            console.log(this.data[index]);
        }
    }

    async sortData() {
        init_panic_hook();
        let json = JSON.stringify(this.data);

        let intent = JSON.stringify([
            { "name": "site", "direction": "asc" },
            { "name": "value", "direction": "asc" }
        ])

        let result = sort_data(intent, json, []);

        for (const item of result) {
            console.log(this.data[item]);
        }
    }

    async convertDuration() {
        console.log(iso8601_to_string("PT100H30M10S"));
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
            site    : site
        })
    }
    return result;
}