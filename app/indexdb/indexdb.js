export default class Input extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();

        Database.delete("test_database");

        let db = await Database.open("test_database", 1, {
                people: null
            }
        );

        await db.dump("people", [
            {
                firstName: "John",
                lastName: "Doe"
            },
            {
                firstName: "Jane",
                lastName: "Doe"
            }
        ]);

        await db.add_record("people", {
            firstName: "Joe",
            lastName: "Doe"
        });

        await db.update_record("people", 1, {
            firstName: "Jane_1",
            lastName: "Doe_1"
        });

        await db.delete_record("people", 0);

        let result = await db.get_from_index("people", [0, 1]);
        console.log(result);

        result = await db.get_all("people");
        console.log(result);

        // await db.clear("people");
        // console.log("clear done");

        // await db.delete_record(store, index);
        // await db.update_record(store, index, model);
        // await db.add_record(store, model);
        //
        // await db.delete_by_key(store, keyName, keyValue);
        // await db.update_by_key(store, keyName, model);

        db = db.close();
    }
}