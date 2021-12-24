/**
 * https://www.w3.org/TR/IndexedDB/
 */

const DBAccess = Object.freeze({
    READ_WRITE: "readwrite"
})

export class DatabaseActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    static async open(step, context, process, item) {
        const dbName = await crs.process.getValue(step.args.db, context, process, item);
        return open_db(dbName, step.args.version, step.args.tables);
    }

    static async delete(step, context, process, item) {
        const dbName = await crs.process.getValue(step.args.db, context, process, item);
        window.indexedDB.deleteDatabase(dbName);
    }

    static async set_record(step, context, process, item) {
        const store = await get_store(step, context, process, item);
        store.put(step.args.record);
    }

    static async delete_record(step, context, process, item) {
        const store = await get_store(step, context, process, item);
        store.delete(step.args.key);
    }

    static async clear_table(step, context, process, item) {
        const store = await get_store(step, context, process, item);
        store.clear();
    }

    static async get_record(step, context, process, item) {
        return new Promise(async (resolve, reject) => {
            const store = await get_store(step, context, process, item);
            const res = store.get(step.args.key);

            res.onsuccess = event => {
                res.onsuccess = null;
                const value = event.target.result;
                resolve(value);
            };
        })
    }

    static async get_all(step, context, process, item) {
        return new Promise(async resolve => {
            const store = await get_store(step, context, process, item);
            const request = store.getAll();

            request.onsuccess = event => {
                request.onsuccess = null;
                resolve(event.target.result);
            }
        })
    }
}

function open_db(dbName, version, tables) {
    return new Promise(resolve => {
        let dbr = window.indexedDB.open(dbName, version || 1);

        if (tables != null) {
            dbr.onupgradeneeded = event => {
                dbr.onupgradeneeded = null;
                const db = event.target.result;

                for (let storeName of Object.keys(tables)) {
                    const table = tables[storeName];
                    const store = db.createObjectStore(storeName, table.parameters);

                    if (table.indexes != null) {
                        for (let indexName of Object.keys(table.indexes)) {
                            let option = table.indexes[indexName];
                            store.createIndex(`by_${indexName}`, indexName, option);
                        }
                    }
                }

                resolve(db);
            }
        }

        dbr.onsuccess = event => {
            dbr.onsuccess = null;
            resolve(event.target.result);
        }
    })
}

function get_store(step, context, process, item) {
    return new Promise(async resolve => {
        const dbName = await crs.process.getValue(step.args.db, context, process, item);
        const table = await crs.process.getValue(step.args.table, context, process, item);

        const db = await open_db(dbName, step.args.version);
        const tx = db.transaction(table, DBAccess.READ_WRITE);
        const store = tx.objectStore(table);

        resolve(store);
    })
}