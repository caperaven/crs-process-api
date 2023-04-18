        const META_TABLE_NAME = "_meta";

/**
 * @class Database
 * This is a class that wraps indexdb operations for crud operations and filtering
 *
 * Fields in the store are:
 * - id - unique id for the record
 * - title - title of the record
 * - notes - notes for the record
 *
 * Methods:
 * - connect - create a data store if it does not exist and connect to the store for further operations
 * - disconnect -disconnect from the data store
 * - set - set the records in the data store
 * - add - add a new record in the data store
 * - read - read a record from the data store based on the id
 * - update - update a record in the data store based on the id
 * - delete - delete a record from the data store based on the id
 * - getAll - get all records from the data store
 * - getPage - get a page of records from the data store
 */
class Database {
    #dbName;
    #db = null;

    #getAvailableStoreQueue = [];

    #metaInit(newMetaData) {
        if (newMetaData.length === 0) return;

        return this.#performTransaction((store) => {
            let result;
            for (const meta of newMetaData) {
                result = store.put(meta, meta.storeName);
            }
            return result;
        }, "readwrite", META_TABLE_NAME);
    }

    /**
     * @method metaGet - get the metadata for the main table
     */
    #metaGet(storeName) {
        return this.#performTransaction((store) => {
            return store.get(storeName);
        }, "readonly", META_TABLE_NAME);

        return { count: 0 }
    }

    /**
     * @method metaUpdate - update the metadata for the main table
     * @param data
     */
    #metaUpdate(data, storeName) {
        return this.#performTransaction((store) => {
            return store.put(data, storeName);
        }, "readwrite", META_TABLE_NAME);
    }

    #metaZero(storeNames, count = true, timestamp = true) {
        return this.#performTransaction(async (store) => {
            for (const storeName of storeNames) {
                const request = store.get(storeName);

                const meta = await new Promise((resolve, reject) => {
                    request.onsuccess = (event) => {
                        resolve(event.target.result);
                    };

                    request.onerror = (event) => {
                        reject(event);
                    };
                })

                if (count) meta.count = 0;
                if (timestamp) meta.timestamp = null;
                store.put(meta, storeName)
            }

        }, "readwrite", META_TABLE_NAME);
    }


    connect(dbName, version, count, storeNames) {
        return new Promise((resolve, reject) => {
            this.#dbName = dbName;

            const newMegaData = [];
            const request = self.indexedDB.open(this.#dbName, version);

            request.onerror = (event) => {
                reject(event.target.error);
            };

            request.onsuccess = async (event) => {
                this.#db = event.target.result;
                await this.#metaInit(newMegaData);
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                if (db.objectStoreNames.contains(META_TABLE_NAME) === false) {
                    db.createObjectStore(META_TABLE_NAME);
                }

                if (count > 0) {
                    for (let i = 0; i < count; i++) {
                        let countString = i < 10 ? `0${i}` : i;
                        const storeName = `table_${countString}`
                        const objectStore = db.createObjectStore(storeName);
                        objectStore.createIndex("idIndex", "id", { unique: true });

                        newMegaData.push({
                            storeName,
                            timestamp: null,
                            count: 0
                        })
                    }
                }

                for (const storeName of storeNames) {
                    if (db.objectStoreNames.contains(storeName) === false) {
                        const objectStore = db.createObjectStore(storeName);
                        objectStore.createIndex("idIndex", "id", { unique: true });

                        newStores.push(storeName);

                        newMegaData.push({
                            storeName,
                            timestamp: null,
                            count: 0
                        })
                    }
                }
            };
        })
    }

    /**
     * @method disconnect - disconnect from the database
     * @returns {Promise<void>}
     */
    async disconnect() {
        if (this.#db) {
            this.#db.close();
            this.#db = null;
        }
    }

    /**
     * @method #performTransaction - perform a transaction on the database store
     * The callback does the actual work but this function takes care of all the generic stuff
     * @param callback {function} - callback function that does the actual work
     * @returns {Promise<unknown>}
     */
    #performTransaction(callback, mode = "readwrite", storeName) {
        return new Promise(async (resolve, reject) => {
            const transaction = this.#db.transaction([storeName], mode);

            transaction.onerror = (event) => {
                reject(event.target.error);
            };

            const store = transaction.objectStore(storeName);

            const request = await callback(store);

            if (request) {
                request.onsuccess = (event) => {
                    return resolve(event.target.result);
                };

                request.onerror = (event) => {
                    return reject(event.target.error);
                };
            }
            else {
                resolve();
            }
        });
    }

    markNextTableAsUsed() {
        return new Promise((resolve, reject) => {
            const transaction = this.#db.transaction([META_TABLE_NAME], "readwrite");

            transaction.onerror = (event) => {
                reject(event.target.error);
            };

            const store = transaction.objectStore(META_TABLE_NAME);
            const request = store.openCursor();

            request.onsuccess = async (event) => {
                let cursor = event.target.result;

                do {
                    const value = cursor.value;
                    const storeName = value.storeName;
                    const timeStamp = value.timestamp;

                    if (timeStamp == null) {
                        const meta = cursor.value;
                        meta.timestamp = new Date();
                        store.put(meta, storeName);
                        resolve(storeName);
                        break;
                    }
                } while (cursor.continue())
            }

            request.onerror = (event) => {
                reject(event.target.error);
            };
        })
    }

    getAvailableStore() {
        return new Promise(async (resolve, reject) => {
            const storeName = await this.markNextTableAsUsed().catch(error => reject(error));
            resolve(storeName);
        })
    }

    releaseStores(storeNames) {
        return new Promise(async (resolve, reject) => {
            if (Array.isArray(storeNames) === false) {
                storeNames = [storeNames];
            }

            await this.clear(storeNames, true, true).catch(error => reject(error));
        })
    }

    /**
     * @method set - set the records in the database
     * If you define a store we will add data to that store and assume you have that locked by a previous operation
     * If you want to clear the data first set the clear to true
     * If you don't define a store wil will lookup a store that is not in use and lock it for you
     * @param records
     */
    set(storeName, records, clear = false) {
        return new Promise(async (resolve, reject) => {
            storeName ||= await this.getAvailableStore().catch(error => reject(error));

            if (clear == true) {
                await this.clear([storeName], true, false).catch(error => reject(error));
            }

            // 1. get the meta data to update the count value
            const meta = await this.#metaGet(storeName).catch(error => reject(error));
            // 2. perform the set operation and update the count value

            await new Promise((resolve, reject) => {
                this.#performTransaction(async (store) => {
                    for (const record of records) {
                        await store.put(record, meta.count);
                        meta.count += 1;
                    }

                    resolve();
                }, "readwrite", storeName).catch(error => reject(error));
            })

            // 3. update the meta data for next time
            meta.timestamp = new Date();
            await this.#metaUpdate(meta, storeName).catch(error => reject(error));

            resolve(storeName);
        })
    }

    /**
     * @method create - create a new record in the database
     * @param {object} record - record to be created
     * @returns {Promise<void>}
     */
    add(storeName, record, meta) {
        return this.#performTransaction((store) => {
            const index = meta.count;
            meta.count += 1;
            return store.add(record, index);
        }, "readwrite", storeName);
    }

    /**
     * @method addWithIndex - add a record with a specific index
     * @param record - record to be added
     * @param index - index to be used
     * @returns {Promise<*>}
     */
    addWithIndex(storeName, record, index) {
        return this.#performTransaction((store) => {
            return store.add(record, index);
        }, "readwrite", storeName);
    }

    /**
     * @method read - read a record from the database
     * @param {string} id - id of the record to be read
     * @returns {Promise<void>}
     */
    get(storeName, index) {
        return this.#performTransaction((store) => {
            return store.get(index);
        }, "readonly", storeName);
    }

    /**
     * @method update - update a record in the database
     * @returns {Promise<void>}
     */
    update(storeName, data, key) {
        return this.#performTransaction((store) => {
            return store.put(data, key);
        }, "readwrite", storeName);
    }

    /**
     * @method delete - delete a record from the database
     * @returns {Promise<void>}
     */
    deleteIndexes(storeName, indexes) {
        return this.#performTransaction((store) => {
            if (Array.isArray(indexes) === false) {
                indexes = [indexes];
            }

            let result;
            for (const index of indexes) {
                result = store.delete(index);
            }

            return result;
        }, "readwrite", storeName);
    }

    /**
     * @method deleteRange - delete a range of records from the database
     * @param storeName - name of the store to delete from
     * @param start - start of the range
     * @param end - end of the range
     * @returns {Promise<*>}
     */
    deleteRange(storeName, start, end) {
        return this.#performTransaction((store) => {
            return store.delete(IDBKeyRange.bound(start, end));
        }, "readwrite", storeName);
    }

    /**
     * @method clear - clear all records from the database
     * @returns {Promise<void>}
     */
    async clear(storeNames, zeroCount = true, zeroTimestamp = true) {
        await this.#metaZero(storeNames, zeroCount, zeroTimestamp)

        const promises = [];

        for (let storeName of storeNames) {
            promises.push(
                this.#performTransaction((store) => {
                    return store.clear();
                },  "readwrite", storeName)
            )
        }

        return Promise.all(promises);
    }

    /**
     * @method getAll - get all records from the database
     * @returns {Promise<void>}
     */
    getAll(storeName) {
        return this.#performTransaction((store) => {
            return store.getAll();
        }, "readonly", storeName);
    }

    getBatch(storeName, startIndex, endIndex) {
        return new Promise((resolve, reject) => {
            const result = []
            const transaction = this.#db.transaction([storeName], "readonly");

            transaction.onerror = (event) => {
                reject(event.target.error);
            };

            const store = transaction.objectStore(storeName);
            const range = IDBKeyRange.bound(startIndex, endIndex, false, false);
            const request = store.openCursor(range);

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    result.push(cursor.value);
                    cursor.continue();
                }
                else {
                    resolve(result);
                }
            }

            request.onerror = (event) => {
                reject(event.target.error);
            }
        });
    }

    /**
     * @methods getRecordsByIndex - get all the records for a given index
     * @param indexes
     * @returns {Promise<*>}
     */
    getRecordsByIndex(storeName, indexes) {
        const promises = indexes.map(index =>
            this.#performTransaction((store) => {
                return store.get(index);
            }, "readonly", storeName)
        );

        return Promise.all(promises);
    }

    /**
     * @method getValues - get the values of the fields for the records
     * @param fields {array} - fields to be retrieved
     * @param indexes {array} - indexes of the records, if not provided, all records are retrieved
     * @returns {Promise<void>}
     */
    getValues(storeName, fields, indexes) {
        return this.#performTransaction((store) => {
            const request = store.getAll(indexes);
            request.onsuccess = (event) => {
                const records = event.target.result;
                const values = records.map(record => {
                    const value = {};
                    for (const field of fields) {
                        value[field] = record[field];
                    }
                    return value;
                });
                return values;
            };
        }, "readonly", storeName);
    }

    /**
     * This checks if the store has a particular key
     * @param key
     */
    hasKey(storeName, key) {
        return this.#performTransaction((store) => {
            return store.getKey(key);
        }, "readonly", storeName);
    }

    getById(storeName, ids) {
        return new Promise(async (resolve, reject) => {
            const transaction = this.#db.transaction([storeName], "readonly");

            transaction.onerror = (event) => {
                reject(event.target.error);
            };

            const store = transaction.objectStore(storeName);

            if (Array.isArray(ids) === false) {
                ids = [ids];
            }

            const index = store.index("idIndex");
            const result = [];

            for (const id of ids) {
                const model = await new Promise(resolve => {
                    const request = index.get(id);
                    request.onsuccess = (event) => {
                        resolve(event.target.result);
                    }
                })

                result.push(model);
            }

            resolve(result);
        });
    }
}

/**
 * @class IndexDBManager - manages the database connection managers
 * This does not directly work with the index db, but manages a store of database instances using the Database class
 * It acts a mediator and also deals with error handling and promise resolution
 * The methods for the most part matches the Database class methods
 * For descriptions on what the methods do, please refer to the Database class
 */
class IndexDBManager {
    #store = {};

    #performAction(uuid, name, callback) {
        return new Promise(async (resolve, reject) => {
            if (this.#store[name] === undefined) {
                reject({
                    uuid: uuid,
                    success: false,
                    error: new Error(`Database ${name} is not connected`)
                })
            }

            await callback()
                .then((result) => {
                    resolve({
                        uuid: uuid,
                        success: true,
                        data: result
                    })
                })
                .catch((error) => {
                    reject({
                        uuid: uuid,
                        success: false,
                        error: error
                    });
                });
        });
    }

    connect(uuid, dbName, version, count, storeNames) {
        return new Promise(async (resolve, reject) => {
            // Database already set so nothing more to do
            if (this.#store[dbName] !== undefined) {
                resolve({
                    uuid: uuid,
                    result: true
                })
            }

            const instance = new Database();

            await instance.connect(dbName, version, count, storeNames)
                .catch((error) => {
                    reject({
                        uuid: uuid,
                        result: false,
                        error: error
                    });
                });

            this.#store[dbName] = instance;

            resolve({
                uuid: uuid,
                result: true
            })
        });
    }

    disconnect(uuid, name) {
        return this.#performAction(uuid, name, async () => {
            delete this.#store[name];
        })
    }

    getAvailableStore(uuid, name) {
        return this.#performAction(uuid, name, async () => {
            return await this.#store[name].getAvailableStore();
        })
    }

    releaseStores(uuid, name, stores) {
        return this.#performAction(uuid, name, async () => {
            return await this.#store[name].releaseStores(stores);
        })
    }

    set(uuid, name, store, records, clear) {
        return this.#performAction(uuid, name, async () => {
            return await this.#store[name].set(store, records, clear);
        });
    }

    add(uuid, name, store, record) {
        return this.#performAction(uuid, name, async () => {
            return await this.#store[name].add(store, record);
        });
    }

    clear(uuid, name, store, zeroCount, zeroTimestamp) {
        return this.#performAction(uuid, name, async () => {
            return await this.#store[name].clear(store, zeroCount, zeroTimestamp);
        });
    }

    get(uuid, name, store, indexes) {
        return this.#performAction(uuid, name, async () => {
            if (Array.isArray(indexes) === false) {
                return await this.#store[name].get(store, indexes);
            }

            return await this.#store[name].getRecordsByIndex(store, indexes);
        })
    }

    getAll(uuid, name, store) {
        return this.#performAction(uuid, name, async () => {
            return await this.#store[name].getAll(store);
        });
    }

    getBatch(uuid, name, store, startIndex, endIndex, count) {
        return this.#performAction(uuid, name, async () => {
            endIndex ||= startIndex + count - 1;
            return await this.#store[name].getBatch(store, startIndex, endIndex);
        });
    }

    deleteIndexes(uuid, name, store, indexes) {
        return this.#performAction(uuid, name, async () => {
            return await this.#store[name].deleteIndexes(store, indexes);
        });
    }

    deleteRange(uuid, name, store, startIndex, endIndex) {
        return this.#performAction(uuid, name, async () => {
            return await this.#store[name].deleteRange(store, startIndex, endIndex);
        });
    }

    getById(uuid, name, store, id) {
        return this.#performAction(uuid, name, async () => {
            return await this.#store[name].getById(store, id);
        });
    }
}

self.manager = new IndexDBManager();
self.metaDB = new Database();

self.onmessage = async function(event) {
    const action = event.data.action;
    const args = event.data.args;
    const uuid = event.data.uuid;

    if (self.manager[action]) {
        await self.manager[action](uuid, ...args)
            .then(result => self.postMessage(result))
            .catch(error => self.postMessage(error));
    }
};