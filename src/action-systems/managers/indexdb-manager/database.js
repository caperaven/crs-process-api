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
export class Database {
    #dbName = 'notes';
    #storeName = 'notes';
    #db = null;
    #keyName = null;

    #setTimerHandler = this.setTimer.bind(this);

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

            request.onerror = (event) => {
                reject(event.target.error);
            };

            request.onsuccess = (event) => {
                this.#db = event.target.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                db.createObjectStore(this.#storeName, { autoIncrement: true });
            };
        });
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
    #performTransaction(callback, mode = "readwrite") {
        return new Promise((resolve, reject) => {
            const transaction = this.#db.transaction([this.#storeName], mode);
            const store = transaction.objectStore(this.#storeName);

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
        return this.#performTransaction((store) => {
            let result;
            for (const record of records) {
                result = store.add(record)
            }
            return result;
        });
    }

    /**
     * @method create - create a new record in the database
     * @param {object} record - record to be created
     * @returns {Promise<void>}
     */
    add(record) {
        return this.#performTransaction((store) => {
            return store.add(record);
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
        });
    }

    /**
     * @method update - update a record in the database
     * @returns {Promise<void>}
     */
    update(data) {
        return this.#performTransaction((store) => {
            return store.put(data);
        })
    }

    /**
     * @method delete - delete a record from the database
     * @returns {Promise<void>}
     */
    delete(index) {
        return this.#performTransaction((store) => {
            return store.delete(index);
        });
    }

    /**
     * @method clear - clear all records from the database
     * @returns {Promise<void>}
     */
    clear() {
        return this.#performTransaction((store) => {
            return store.clear();
        });
    }

    /**
     * @method getAll - get all records from the database
     * @returns {Promise<void>}
     */
    getAll() {
        return this.#performTransaction((store) => {
            return store.getAll();
        });
    }

    /**
     * @methods getRecordsByIndex - get all the records for a given index
     * @param indexes
     * @returns {Promise<*>}
     */
    getRecordsByIndex(indexes) {
        return this.#performTransaction((store) => {
            return store.getAll(indexes);
        });
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
        });
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
        });
    }
}