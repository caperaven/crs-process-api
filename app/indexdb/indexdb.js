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

        let result = await db.get_from_index("people", [0, 1]);
        console.log(result);

        result = await db.get_all("people");
        console.log(result);

        await db.clear("people");
        console.log("clear done");

        // await db.delete_record(store, index);
        // await db.update_record(store, index, model);
        // await db.add_record(store, model);
        //
        // await db.delete_by_key(store, keyName, keyValue);
        // await db.update_by_key(store, keyName, model);

        db = db.close();
    }
}

class Database {
    static open(name, version, tables) {
        return new Promise(resolve => {
            let request = window.indexedDB.open(name, version || 1, tables);
            let db;

            request.onsuccess = event => {
                request.onsuccess = null;
                db = request.result;
                let result = new Database();
                result.db = db;
                resolve(result);
            }

            request.onupgradeneeded = event => {
                request.onupgradeneeded = null;
                db = event.target.result;

                if (tables != null) {
                    const keys = Object.keys(tables);
                    for (const key of keys) {
                        db.createObjectStore(key, tables[key]);
                    }
                }

                let transaction = event.target.transaction;
                transaction.oncomplete = event => {
                    transaction.oncomplete = null;

                    let result = new Database();
                    result.db = db;
                    resolve(result);

                    transaction = null;
                }
            }
        })
    }

    static delete(name) {
        window.indexedDB.deleteDatabase(name);
    }

    close() {
        this.db.close();
        this.db = null;
        return null;
    }

    dump(store, records) {
        return new Promise(async resolve => {
            await this.clear();

            let transaction = this.db.transaction([store], "readwrite");
            let store_obj = transaction.objectStore(store);

            for (let i = 0; i < records.length; i++) {
                store_obj.add(records[i], i);
            }

            transaction.oncomplete = event => {
                transaction.oncomplete = null;
                store = null;
                transaction = null;
                resolve();
            }

            transaction.commit();
        })
    }

    get_from_index(store, keys) {
        return new Promise(resolve => {
            let transaction = this.db.transaction([store], "readonly");
            let objectStore = transaction.objectStore(store);

            let request = objectStore.openCursor();
            let result = [];

            request.onsuccess = event => {
                let cursor = event.target.result;

                if (cursor == null) {
                    request.onsuccess = null;
                    return resolve(result);
                }

                if (keys.indexOf(cursor.primaryKey) != -1) {
                    result.push(cursor.value);
                }

                cursor.continue();
            }
        })
    }

    get_all(store) {
        return new Promise(resolve => {
            let transaction = this.db.transaction([store], "readonly");
            let objectStore = transaction.objectStore(store);

            let request = objectStore.getAll();
            request.onsuccess = event => {
                request.onsuccess = null;
                resolve(event.target.result);
            }
        })
    }

    clear(store) {
        return new Promise(resolve => {
            let transaction = this.db.transaction([store], "readwrite");
            let objectStore = transaction.objectStore(store);

            let request = objectStore.clear();
            request.onsuccess = event => {
                request.onsuccess = null;
                resolve();
            }
        })
    }
}