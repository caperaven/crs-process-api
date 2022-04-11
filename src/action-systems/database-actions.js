/**
 * https://www.w3.org/TR/IndexedDB/
 */

export class DatabaseActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    static async open(step, context, process, item) {
        const dbName = await crs.process.getValue(step.args.name, context, process, item);
        const version = await crs.process.getValue(step.args.version, context, process, item);
        const tables = await crs.process.getValue(step.args.tables, context, process, item);

        const instance = Database.open(dbName, version || 1, tables);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.table, instance, context, process, item);
        }

        return instance;
    }

    static async close(step, context, process, item) {
        const db = await crs.process.getValue(step.args.db, context, process, item);

        db.close();
        if (typeof step.args.db == "string") {
            await crs.process.setValue(step.args.db, null, context, process, item);
        }

        return null;
    }

    static async delete(step, context, process, item) {
        const dbName = await crs.process.getValue(step.args.name, context, process, item);
        Database.delete(dbName)
    }

    static async dump(step, context, process, item) {
        const db = await crs.process.getValue(step.args.db, context, process, item);
        const store = await crs.process.getValue(step.args.store, context, process, item);
        const records = await crs.process.getValue(step.args.records, context, process, item);

        await db.dump(store, records);
    }

    static async get_from_index(step, context, process, item) {
        const db = await crs.process.getValue(step.args.db, context, process, item);
        const store = await crs.process.getValue(step.args.store, context, process, item);
        const keys = await crs.process.getValue(step.args.keys, context, process, item);

        let result = await db.get_from_index(store, keys);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    static async get_all(step, context, process, item) {
        const db = await crs.process.getValue(step.args.db, context, process, item);
        const store = await crs.process.getValue(step.args.store, context, process, item);

        let result = await db.get_all(store);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    static async clear(step, context, process, item) {
        const db = await crs.process.getValue(step.args.db, context, process, item);
        const store = await crs.process.getValue(step.args.store, context, process, item);

        await db.clear(store);
    }

    static async delete_record(step, context, process, item) {
        const db = await crs.process.getValue(step.args.db, context, process, item);
        const store = await crs.process.getValue(step.args.store, context, process, item);
        const key = await crs.process.getValue(step.args.key, context, process, item);

        await db.delete_record(store, key);
    }

    static async update_record(step, context, process, item) {
        const db = await crs.process.getValue(step.args.db, context, process, item);
        const store = await crs.process.getValue(step.args.store, context, process, item);
        const key = await crs.process.getValue(step.args.key, context, process, item);
        const model = await crs.process.getValue(step.args.model, context, process, item);

        await db.update_record(store, key, model);
    }

    static async add_record(step, context, process, item) {
        const db = await crs.process.getValue(step.args.db, context, process, item);
        const store = await crs.process.getValue(step.args.store, context, process, item);
        const model = await crs.process.getValue(step.args.model, context, process, item);

        await db.add_record(store, model);
    }

    static async get_batch(step, context, process, item) {
        const db = await crs.process.getValue(step.args.db, context, process, item);
        const store = await crs.process.getValue(step.args.store, context, process, item);
        const start = await crs.process.getValue(step.args.start, context, process, item);
        const end = await crs.process.getValue(step.args.end, context, process, item);

        let result = await db.get_batch(store, start, end);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    static async get_values(step, context, process, item) {
        const db = await crs.process.getValue(step.args.db, context, process, item);
        const store = await crs.process.getValue(step.args.store, context, process, item);
        const fields = await crs.process.getValue(step.args.fields, context, process, item);
        const keys = await crs.process.getValue(step.args.keys, context, process, item);

        let result = await db.get_values(store, fields, keys);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    static async calculate_paging(step, context, process, item) {
        const db = await crs.process.getValue(step.args.db, context, process, item);
        const store = await crs.process.getValue(step.args.store, context, process, item);
        const pageSize = await crs.process.getValue(step.args.page_size, context, process, item);

        let result = await db.calculate_paging(store, pageSize);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    static async get_page(step, context, process, item) {
        const db = await crs.process.getValue(step.args.db, context, process, item);
        const store = await crs.process.getValue(step.args.store, context, process, item);
        const pageSize = await crs.process.getValue(step.args.page_size, context, process, item);
        const pageNumber = await crs.process.getValue(step.args.page_number, context, process, item);
        const fields = await crs.process.getValue(step.args.fields, context, process, item);

        let result = await db.get_page(store, pageSize, pageNumber, fields);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    static async get_range(step, context, process, item) {
        const db = await crs.process.getValue(step.args.db, context, process, item);
        const store = await crs.process.getValue(step.args.store, context, process, item);
        const field = await crs.process.getValue(step.args.field, context, process, item);

        let result = await db.get_range(store, field);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }
}

class Database {
    constructor() {
        this.next_key = {}
    }

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
                        const store = db.createObjectStore(key, tables[key].parameters);

                        const indexes = tables[key].indexes;
                        if (indexes != null) {
                            const indexKeys = Object.keys(indexes);
                            for (let index of indexKeys) {
                                store.createIndex(`ind_${index}`, index, indexes[index]);
                            }
                        }
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

    get_next_key(store) {
        let result = this.next_key[store];
        result = result + 1;
        this.next_key[store] = result;
        return result;
    }

    close() {
        this.db.close();
        this.db = null;
        this.next_key = null;
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

            this.next_key[store] = records.length;

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
                    transaction = null;
                    objectStore = null;
                    request = null;
                    return resolve(result);
                }

                if (keys.indexOf(cursor.primaryKey) != -1) {
                    result.push(cursor.value);
                }

                cursor.continue();
            }
        })
    }

    get_values(store, fields, keys) {
        return new Promise(resolve => {
            let transaction = this.db.transaction([store], "readonly");
            let objectStore = transaction.objectStore(store);

            let request = objectStore.openCursor();
            let result = [];

            request.onsuccess = event => {
                let cursor = event.target.result;

                if (cursor == null) {
                    request.onsuccess = null;
                    transaction = null;
                    objectStore = null;
                    request = null;
                    return resolve(result);
                }

                if (keys) {
                    if (keys.indexOf(cursor.primaryKey) != -1) {
                        let obj = cloneProperties(cursor.value, fields);
                        result.push(obj);
                    }
                }
                else {
                    let obj = cloneProperties(cursor.value, fields);
                    result.push(obj);
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
                transaction = null;
                objectStore = null;
                return resolve(event.target.result);
            }
        });
    }

    clear(store) {
        return new Promise(resolve => {
            if (this.db.objectStoreNames.contains(store) == false) {
                return resolve();
            }

            let transaction = this.db.transaction([store], "readwrite");
            let objectStore = transaction.objectStore(store);

            let request = objectStore.clear();
            request.onsuccess = event => {
                request.onsuccess = null;
                transaction = null;
                objectStore = null;
                return resolve();
            }
        });
    }

    delete_record(store, key) {
        return new Promise(resolve => {
            let transaction = this.db.transaction([store], "readwrite");
            let objectStore = transaction.objectStore(store);

            let request = objectStore.delete(key);
            request.onsuccess = event => {
                request.onsuccess = null;
                transaction = null;
                objectStore = null;
                return resolve();
            }
        });
    }

    update_record(store, key, model) {
        return new Promise(resolve => {
            let transaction = this.db.transaction([store], "readwrite");
            let objectStore = transaction.objectStore(store);

            let request = objectStore.put(model, key);
            request.onsuccess = event => {
                request.onsuccess = null;
                transaction = null;
                objectStore = null;
                return resolve();
            }
        });
    }

    add_record(store, model) {
        return new Promise(resolve => {
            let transaction = this.db.transaction([store], "readwrite");
            let objectStore = transaction.objectStore(store);

            let request = objectStore.add(model, this.get_next_key(store));
            request.onsuccess = event => {
                request.onsuccess = null;
                transaction = null;
                objectStore = null;
                return resolve();
            }
        });
    }

    get_batch(store, start, end) {
        return new Promise(resolve => {
            let transaction = this.db.transaction([store], "readwrite");
            let objectStore = transaction.objectStore(store);

            let result = [];
            const keyRangeValue = IDBKeyRange.bound(start, end);
            const request = objectStore.openCursor(keyRangeValue);
            request.onsuccess = event => {
                const cursor = event.target.result;

                if (cursor) {
                    result.push(cursor.value);
                    cursor.continue();
                }
                else {
                    request.onsuccess = null;
                    return resolve(result);
                }
            }
        })
    }

    calculate_paging(store, pageSize) {
        return new Promise(resolve => {
            let transaction = this.db.transaction([store], "readonly");
            let objectStore = transaction.objectStore(store);
            const countRequest = objectStore.count();

            countRequest.onsuccess = () => {
                const count = countRequest.result;
                let pageCount = Math.ceil(count / pageSize || 1);

                if (count > 0 && pageCount == 0) {
                    pageCount = 1;
                }

                countRequest.onsuccess = null;

                return resolve({
                    record_count: count,
                    page_count : pageCount
                })
            }
        })
    }

    get_page(store, pageSize, pageNumber, fields) {
        const start = pageNumber * pageSize;
        const end = start + pageSize - 1; // zero index means we need to remove 1

        if (fields == null) {
            return this.get_batch(store, start, end);
        }
        else {
            let keys = [];
            for (let i = start; i <= end; i++) {
                keys.push(i);
            }

            return this.get_values(store, fields, keys);
        }
    }

    get_range(store, field) {
        return new Promise(resolve => {
            const range = {min: Number.MAX_VALUE, max: Number.MIN_VALUE};

            let transaction = this.db.transaction([store], "readonly");
            let objectStore = transaction.objectStore(store);

            let request = objectStore.openCursor();

            request.onsuccess = event => {
                let cursor = event.target.result;

                if (cursor == null) {
                    request.onsuccess = null;
                    transaction = null;
                    objectStore = null;
                    request = null;
                    return resolve(range);
                }

                const value = cursor.value[field];

                if (value < range.min) {
                    range.min = value;
                }

                if (value > range.max) {
                    range.max = value;
                }

                cursor.continue();
            }
        })
    }
}

function cloneProperties(source, properties) {
    let result = {};

    for (let property of properties) {
        result[property] = source[property];
    }

    return result;
}
