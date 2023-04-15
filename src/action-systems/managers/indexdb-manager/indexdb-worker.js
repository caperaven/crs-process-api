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
    #storeName;
    #db = null;
    #keyName = null;

    /**
     * @private
     * @field queue - when the database is busy add the action to the queue to process when it becomes available.
     * @type {[]}
     */
    #queue = []

    /**
     * @method connect - connect to the database
     * @returns {Promise} - promise that resolves to the connection object
     */
    connect(dbName, storeName, keyName = "index") {
        return new Promise((resolve, reject) => {
            this.#dbName = dbName;
            this.#storeName = storeName;
            this.#keyName = keyName;

            const request = self.indexedDB.open(this.#dbName, 1);
            let isNew = false;

            request.onerror = (event) => {
                reject(event.target.error);
            };

            request.onsuccess = async (event) => {
                this.#db = event.target.result;

                if (isNew == true) {
                    await this.#metaInit();
                }

                resolve();
            };

            request.onupgradeneeded = (event) => {
                isNew = true;
                const db = event.target.result;
                db.createObjectStore("meta");
                db.createObjectStore(this.#storeName);
            };
        });
    }

    /**
     * @method set - save details about the main table in the meta table
     * This is later used to
     * - get the total number of records
     * - get the fields in the table
     * - get the timestamp of the last update
     * - delete old databases based on the timestamp
     * - get the next id to use
     * @returns {Promise<*>}
     */
    #metaInit() {
        return this.#performTransaction((store) => {
            return store.add({ timestamp: Date.now(), count: 0, fields: [] }, this.#storeName);
        }, "readwrite", "meta");
    }

    /**
     * @method metaGet - get the metadata for the main table
     */
    #metaGet() {
        return this.#performTransaction((store) => {
            return store.get(this.#storeName);
        }, "readonly", "meta");
    }

    /**
     * @method metaUpdate - update the metadata for the main table
     * @param data
     */
    #metaUpdate(data) {
        return this.#performTransaction((store) => {
            return store.put(data, this.#storeName);
        }, "readwrite", "meta");
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
    #performTransaction(callback, mode = "readwrite", storeName = null) {
        return new Promise((resolve, reject) => {
            const transaction = this.#db.transaction([storeName || this.#storeName], mode);
            const store = transaction.objectStore(storeName || this.#storeName);

            const request = callback(store);

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    /**
     * @method set - set the records in the database
     * @param records
     */
    set(records) {
        return new Promise(async (resolve, reject) => {
            const meta = await this.#metaGet();
            const result = await this.setTimer(0, records, meta).catch(error => reject(error));

            meta.fields = Object.keys(records[0]);
            await this.#metaUpdate(meta);
            resolve(result);
        })
    }

    async setTimer(startIndex, data, meta) {
        let toIndex = startIndex + 100;
        if (toIndex > data.length) {
            toIndex = data.length
        }

        for (let i = startIndex; i < toIndex; i++) {
            await this.add(data[i], meta);
        }

        if (toIndex < data.length) {
            return new Promise(resolve => {
                requestAnimationFrame(() => this.setTimer(toIndex, data, meta).then(() => resolve()));
            });
        }
        else {
            return Promise.resolve();
        }
    }

    /**
     * @method create - create a new record in the database
     * @param {object} record - record to be created
     * @returns {Promise<void>}
     */
    add(record, meta) {
        return this.#performTransaction((store) => {
            const index = meta.count;
            meta.count += 1;
            meta.timestamp = Date.now();
            return store.add(record, index);
        });
    }

    /**
     * @method read - read a record from the database
     * @param {string} id - id of the record to be read
     * @returns {Promise<void>}
     */
    read(index) {
        return this.#performTransaction((store) => {
            return store.get(index);
        }, "readonly");
    }

    /**
     * @method update - update a record in the database
     * @returns {Promise<void>}
     */
    update(data) {
        return this.#performTransaction((store) => {
            return store.put(data);
        }, "readwrite")
    }

    /**
     * @method delete - delete a record from the database
     * @returns {Promise<void>}
     */
    delete(index) {
        return this.#performTransaction((store) => {
            return store.delete(index);
        }, "readwrite");
    }

    /**
     * @method clear - clear all records from the database
     * @returns {Promise<void>}
     */
    clear() {
        return this.#performTransaction((store) => {
            return store.clear();
        },  "readwrite");
    }

    /**
     * @method getAll - get all records from the database
     * @returns {Promise<void>}
     */
    getAll() {
        return this.#performTransaction((store) => {
            return store.getAll();
        }, "readonly");
    }

    /**
     * @methods getRecordsByIndex - get all the records for a given index
     * @param indexes
     * @returns {Promise<*>}
     */
    getRecordsByIndex(indexes) {
        const promises = indexes.map(index =>
            this.#performTransaction((store) => {
                return store.get(index);
            }, "readonly")
        );

        return Promise.all(promises);
    }

    /**
     * @method getPage - get a page of records from the database
     * @param page {number} - page number
     * @param pageSize {number} - page size
     * @returns {Promise<*>}
     */
    getPage(page, pageSize) {
        return this.#performTransaction((store) => {
            return store.getAll(null, pageSize, (page - 1) * pageSize);
        }, "readonly");
    }

    /**
     * @method getValues - get the values of the fields for the records
     * @param fields {array} - fields to be retrieved
     * @param indexes {array} - indexes of the records, if not provided, all records are retrieved
     * @returns {Promise<void>}
     */
    getValues(fields, indexes) {
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
        }, "readonly");
    }
}

class IndexDBManager {
    #store = {};

    #performAction(uuid, name, callback) {
        return new Promise(async (resolve, reject) => {
            if (this.#store[name] === undefined) {
                reject({
                    uuid: uuid,
                    result: false,
                    error: new Error(`Database ${name} is not connected`)
                })
            }

            await callback()
                .then((result) => {
                    resolve({
                        uuid: uuid,
                        result: true,
                        data: result
                    })
                })
                .catch((error) => {
                    reject({
                        uuid: uuid,
                        result: false,
                        error: error
                    });
                });
        });
    }

    connect(uuid, name, key) {
        return new Promise(async (resolve, reject) => {
            const instance = new Database();

            await instance.connect(name, name, key)
                .catch((error) => {
                    reject({
                        uuid: uuid,
                        result: false,
                        error: error
                    });
                });

            this.#store[name] = instance;

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

    set(uuid, name, records) {
        return this.#performAction(uuid, name, async () => {
            await this.#store[name].set(records);
        });
    }

    add(uuid, name, record) {
        return this.#performAction(uuid, name, async () => {
            await this.#store[name].add(record);
        });
    }

    clear(uuid, name) {
        return this.#performAction(uuid, name, async () => {
            await this.#store[name].clear();
        });
    }

    get(uuid, name, indexes) {
        return this.#performAction(uuid, name, async () => {
            return await this.#store[name].getRecordsByIndex(indexes);
        })
    }
}

self.manager = new IndexDBManager();

self.onmessage = async function(event) {
    const action = event.data.action;
    const args = event.data.args;
    const uuid = event.data.uuid;

    if (self.manager[action]) {
        await self.manager[action](uuid, ...args)
            .then(result => self.postMessage(result))
            .catch(error => self.postMessage({
                type: "error",
                message: error.message,
                stack: error.stack
            }));
    }
};