const META_TABLE_NAME = "_meta";
const META_DB_NAME = "meta_database";
const VERSION = 1;

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
                updateMetaDB(dbName);
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

                        // We are setting the unique to false as the ids are not always unique.
                        // The id can be duplicated in the table to support some scenarios e.g. cross-reference
                        objectStore.createIndex("idIndex", "id", {unique: false});

                        newMegaData.push({
                            storeName,
                            timestamp: null,
                            count: 0
                        })
                    }
                }

                for (const storeName of storeNames) {
                    if (db.objectStoreNames.contains(storeName) === false) {
                        const objectStore = db.createObjectStore(storeName)

                        // We are setting the unique to false as the ids are not always unique.
                        // The id can be duplicated in the table to support some scenarios e.g. cross-reference
                        objectStore.createIndex("idIndex", "id", {unique: false});

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
                    updateMetaDB(this.#dbName);
                    return resolve(event.target.result);
                };

                request.onerror = (event) => {
                    return reject(event.target.error);
                };
            } else {
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

            this.clear(storeNames, true, true).then(()=> resolve()).catch(error => reject(error));
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
                }, "readwrite", storeName)
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
                } else {
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
                index.get(id).onsuccess = (event) => {
                    if(event.target.result == null) return; // don't add undefined to the result
                    result.push(event.target.result);
                }
            }

            transaction.oncomplete = () => {
                resolve(result);
            }
        });
    }

    updateById(storeName, models) {
        return new Promise(async (resolve, reject) => {
            if (Array.isArray(models) === false) {
                models = [models];
            }

            const transaction = this.#db.transaction([storeName], "readwrite");

            transaction.onerror = (event) => {
                reject(event.target.error);
            };

            const store = transaction.objectStore(storeName);

            const index = store.index("idIndex");

            for (const model of models) {
                const request = index.getAllKeys(model.id);
                request.onsuccess = (event) => {
                    for (const key of event.target.result) {
                        store.put(model, key);
                    }
                }
            }

            transaction.oncomplete = () => {
                resolve();
            }
        });
    }

    deleteById(storeName, ids) {
        return new Promise(async (resolve, reject) => {
            const transaction = this.#db.transaction([storeName], "readwrite");

            transaction.onerror = (event) => {
                reject(event.target.error);
            };

            const store = transaction.objectStore(storeName);
            const index = store.index("idIndex");

            if (Array.isArray(ids) === false) {
                ids = [ids];
            }

            for (const id of ids) {
                const request = index.getAllKeys(id);
                request.onsuccess = (event) => {
                    for (const key of event.target.result) {
                        store.delete(key);
                    }
                }
            }

            transaction.oncomplete = () => {
                resolve();
            }
        });
    }

    delete_by_index(storeName, indexes) {
        return new Promise(async (resolve, reject) => {
            const transaction = this.#db.transaction([storeName], "readwrite");

            transaction.onerror = (event) => {
                reject(event.target.error);
            };

            const store = transaction.objectStore(storeName);

            if (Array.isArray(indexes) === false) {
                indexes = [indexes];
            }

            for (const index of indexes) {
                store.delete(index);
            }

            transaction.oncomplete = () => {
                resolve();
            }
        });
    }

    getOldDatbaseNames() {
        return new Promise((resolve, reject) => {
            const transaction = self.db.transaction([META_TABLE_NAME], "readonly");
            transaction.onerror = (event) => { console.error(event.target.error) };

            const store = transaction.objectStore(META_TABLE_NAME);
            const request = store.openCursor();

            const toRemove = [];
            const now = Date.now();

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    do {
                        const dbTime = cursor.value.timestamp;
                        if (now - dbTime > duration) {
                            toRemove.push(cursor.key);
                        }
                    } while (cursor.continue());
                }
                resolve();
            }
        });
    }

    changeByIndex(storeName, index, changes) {
        return new Promise(async (resolve, reject) => {
            const transaction = this.#db.transaction([storeName], "readwrite");

            transaction.onerror = (event) => {
                reject(event.target.error);
            };

            const store = transaction.objectStore(storeName);

            if (Array.isArray(index) === false) {
                index = [index];
            }

            const keys = Object.keys(changes);

            for (const i of index) {
                const request = store.get(i);
                request.onsuccess = (event) => {
                    const record = event.target.result;
                    for (const key in keys) {
                        record[key] = changes[key];
                    }
                    store.put(record);
                }
            }

            transaction.oncomplete = () => {
                resolve();
            }
        });
    }

    changeById(storeName, id, changes) {
        return new Promise(async (resolve, reject) => {
            const transaction = this.#db.transaction([storeName], "readwrite");

            transaction.onerror = (event) => {
                reject(event.target.error);
            };

            const store = transaction.objectStore(storeName);

            const request = store.get(id);
            request.onsuccess = (event) => {
                const record = event.target.result;
                for (const key in changes) {
                    record[key] = changes[key];
                }
                store.put(record);
            }

            transaction.oncomplete = () => {
                resolve();
            }
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

    disconnect(uuid, names) {
        return this.#performAction(uuid, name, async () => {
            if (Array.isArray(names) === false) {
                names = [names];
            }

            for (const name of names) {
                delete this.#store[name];
            }
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

    updateById(uuid, name, store, models) {
        return this.#performAction(uuid, name, async () => {
            return await this.#store[name].updateById(store, models);
        });
    }

    deleteOldDatabase(uuid, duration) {
        return new Promise(async (resolve, reject) => {
            let toRemove = await getOldDatabases(duration).catch((error) => reject(error));

            // Nothing to delete
            if (toRemove.length === 0) {
                resolve({
                    uuid: uuid,
                    success: true,
                    data: null
                });
            }

            toRemove = toRemove.filter(item => this.#store[item] == null);

            // // close all open connections to the databases we want to delete
            // for (const name of toRemove) {
            //     if (this.#store[name] != null) {
            //         this.#store[name].disconnect();
            //         delete this.#store[name];
            //     }
            // }

            const wasRemoved = [];

            // first delete all the databases and low what you deleted.
            // delete those you can and console log errors you could not.
            for (const name of toRemove) {
                // there is no external transaction to listen too but, we want to park here until we are done
                await new Promise(resolve => {
                    const deleteDatabaseRequest = indexedDB.deleteDatabase(name);

                    deleteDatabaseRequest.onsuccess = () => {
                        wasRemoved.push(name);
                        resolve();
                    }

                    deleteDatabaseRequest.onerror = (event) => {
                        console.error(event.target.error)
                    }
                })
            }

            const transaction = self.metaDB.transaction([META_TABLE_NAME], "readwrite");
            const store = transaction.objectStore(META_TABLE_NAME);

            for (const name of wasRemoved) {
                store.delete(name);
            }

            transaction.oncomplete = () => {
                resolve({
                    uuid: uuid,
                    result: true
                })
            }
        })
    }

    deleteDatabase(uuid, name) {
        return new Promise((resolve, reject) => {
            // 1. make sure database is disconnected
            if (this.#store[name] != null) {
                this.#store[name].disconnect();
                delete this.#store[name];
            }

            // 2. delete the database
            const deleteDatabaseRequest = indexedDB.deleteDatabase(name);

            deleteDatabaseRequest.onerror = (event) => {
                reject({
                    uuid: uuid,
                    success: false,
                    error: event.target.error
                });
            }

            deleteDatabaseRequest.onsuccess = () => {
                const transaction = self.metaDB.transaction([META_TABLE_NAME], "readwrite");
                const store = transaction.objectStore(META_TABLE_NAME);
                const request = store.delete(name);

                request.onsuccess = () => {
                    resolve({
                        uuid: uuid,
                        success: true,
                        data: null
                    });
                }

                request.onerror = (event) => {
                    reject({
                        uuid: uuid,
                        success: false,
                        error: event.target.error
                    });
                }
            }
        })
    }
    
    deleteById(uuid, name, store, id) {
        return this.#performAction(uuid, name, async () => {
            return await this.#store[name].deleteById(store, id);
        });
    }
}

function getOldDatabases(duration) {
    return new Promise(async (resolve, reject) => {
        //const databases = await indexedDB.databases();
        const toRemove = [];
        const transaction = self.metaDB.transaction([META_TABLE_NAME], "readonly");
        const store = transaction.objectStore(META_TABLE_NAME);
        const now = new Date();

        const cursorRequest = store.openCursor();

        cursorRequest.onsuccess = async (event) => {
            let cursor = event.target.result;

            while(cursor) {
                const dbName = cursor.key;
                const dbDate = cursor.value.timestamp;

                if (now - dbDate > duration) {
                    toRemove.push(dbName);
                }

                cursor = cursor.continue();
            }
        }

        transaction.oncomplete = () => {
            resolve(toRemove);
        }
    })
}

function connectMetaDB() {
    return new Promise((resolve, reject) => {
        const request = self.indexedDB.open(META_DB_NAME, VERSION);

        request.onerror = (event) => {
            reject(event.target.error);
        };

        request.onsuccess = async (event) => {
            self.metaDB = event.target.result;
            resolve();
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore(META_TABLE_NAME);
        };
    })
}

function updateMetaDB(dbName) {
    const transaction = self.metaDB.transaction([META_TABLE_NAME], "readwrite");

    transaction.onerror = (event) => { console.error(event.target.error) };

    const store = transaction.objectStore(META_TABLE_NAME);
    store.put({ timestamp: new Date() }, dbName);
}

const actionsToPerformOnLoad = [];

connectMetaDB().then(() => {
    self.manager = new IndexDBManager();

    for (const action of actionsToPerformOnLoad) {
        self.onmessage(action);
    }
}).catch((error) => console.error(error));

self.onmessage = async function (event) {
    if (self.manager == null) {
        actionsToPerformOnLoad.push(event);
        return;
    }

    const action = event.data.action;
    const args = event.data.args;
    const uuid = event.data.uuid;

    if (self.manager[action]) {
        await self.manager[action](uuid, ...args)
            .then(result => self.postMessage(result))
            .catch(error => self.postMessage(error));
    }
};