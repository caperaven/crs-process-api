/**
 * @class IndexDBManager - manages access and transactions with index db
 *
 *
 * Testing scenarios
 * - standard crud operations
 * - 2 arrays, put both to the same table at the same time
 * - 2 fetch calls to the data database
 * - add 100k records to two different databases at the same time
 * - how can we check disc quota but also query this to display it on screen
 */
export class IndexDBManager {
    #worker;
    #requests = {};

    constructor() {
        const workerUrl = new URL("./indexdb-manager/indexdb-worker.js", import.meta.url);
        this.#worker = new Worker(workerUrl);
        this.#worker.onmessage = this.onMessage.bind(this);

        // const cleanUrl = new URL("./indexdb-manager/indexdb-clean-worker.js", import.meta.url);
        // this.#cleanWorker = new Worker(cleanUrl);
    }

    dispose() {
        this.#worker.onmessage = null;
        this.#worker.terminate();
        this.#worker = null;
        this.#requests = null;
    }

    async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    /**
     * @method onMessage - handle the message from the worker
     * actions are performed in the worker using a uuid to identify the request
     * the promise is stored in the requests object and resolved when the worker returns the result
     * @param event
     */
    onMessage(event) {
        const returnPromise = this.#requests[event.data.uuid];

        try {
            if (event.data.success === false) {
                returnPromise.reject(event.data.error);
            }
            else {
                returnPromise.resolve(event.data);
            }
        }
        finally {
            delete this.#requests[event.data.uuid];
        }
    }

    #performWorkerAction(action, args, uuid) {
        return new Promise(async (resolve, reject) => {
            this.#requests[uuid] = { resolve, reject };

            this.#worker.postMessage({
                action: action,
                args: args,
                uuid: uuid
            })
        })
    }

    /**
     * @method connect - connect to the database and create the stores
     * You control the version and what stores are created.
     * @param step {object} - the step that is being performed
     * @param context {object} - the context of the step
     * @param process {object} - the process that is being performed
     * @param item {object} - the item that is being processed
     *
     * @param step.args.name {string} - the name of the database
     * @param step.args.version {number} - the version of the database
     * @param step.args.count {number} - the number of stores to create - they will be called table_00, table_01, etc
     * @param step.args.storeNames {Array} - the names of the stores to create - use this if you have custom stores you want to create.
     * you will need to manage those manually as no meta will be kept for them.
     * @returns {Promise<unknown>}
     *
     * @example <caption>javascript</caption>
     * await crs.call("idb", "connect", {
     *      "name": "data-manager",
     *      "version": 1,
     *      "count": 2
     *      "storeNames": ["my_table_01", "my_table_02"]
     * });
     *
     * @example <caption>json</caption>
     * {
     *      "type": "idb",
     *      "action": "connect",
     *      "args": {
     *          "name": "data-manager",
     *          "version": 1,
     *          "count": 2
     *          "storeNames": ["my_table_01", "my_table_02"]
     *      }
     * }
     */
    async connect(step, context, process, item) {
        const name = await crs.process.getValue(step.args.name, context, process, item);
        const version = await crs.process.getValue(step.args.version, context, process, item);
        const count = await crs.process.getValue(step.args.count, context, process, item);
        const storeNames = await crs.process.getValue(step.args.storeNames, context, process, item);

        return await this.#performWorkerAction("connect", [name, version, count ?? 0, storeNames ?? []], crypto.randomUUID());
    }

    /**
     * @method disconnect - disconnect from the database
     * @param step {object} - the step that is being performed
     * @param context {object} - the context of the step
     * @param process {object} - the process that is being performed
     * @param item {object} - the item that is being processed
     *
     * @param step.args.name {string} - the name of the database
     * @returns {Promise<unknown>}
     *
     * @example <caption>javascript</caption>
     * await crs.call("idb", "disconnect", {
     *      "name": "data-manager"
     * });
     *
     * @example <caption>json</caption>
     * {
     *      "type": "idb",
     *      "action": "disconnect",
     *      "args": {
     *          "name": "data-manager"
     *      }
     * }
     */
    async disconnect(step, context, process, item) {
        const name = await crs.process.getValue(step.args.name, context, process, item);
        return await this.#performWorkerAction("disconnect", [name], crypto.randomUUID());
    }

    /**
     * @method get_available_store - get an available store from the database
     * @param step {object} - the step that is being performed
     * @param context {object} - the context of the step
     * @param process {object} - the process that is being performed
     * @param item {object} - the item that is being processed
     *
     * @param step.args.name {string} - the name of the database
     * @returns {Promise<unknown>}
     *
     * @example <caption>javascript</caption>
     * await crs.call("idb", "get_available_store", {
     *     "name": "data-manager"
     * });
     *
     * @example <caption>json</caption>
     * {
     *     "type": "idb",
     *     "action": "get_available_store",
     *     "args": {
     *          "name": "data-manager"
     *     }
     * }
     */
    async get_available_store(step, context, process, item) {
        const name = await crs.process.getValue(step.args.name, context, process, item);
        return await this.#performWorkerAction("getAvailableStore", [name], crypto.randomUUID());
    }

    /**
     * @method release_stores - release the stores back to the database for usage
     * @param step {object} - the step that is being performed
     * @param context {object} - the context of the step
     * @param process {object} - the process that is being performed
     * @param item {object} - the item that is being processed
     *
     * @param step.args.name {string} - the name of the database
     * @param step.args.stores {array} - the stores to release
     * @returns {Promise<unknown>}
     *
     * @example <caption>javascript</caption>
     * await crs.call("idb", "release_stores", {
     *      "name": "data-manager",
     *      "stores": ["table_01", "table_02"]
     * });
     *
     * @example <caption>json</caption>
     * {
     *      "type": "idb",
     *      "action": "release_stores",
     *      "args": {
     *          "name": "data-manager",
     *          "stores": ["table_01", "table_02"]
     *      }
     * }
     */
    async release_stores(step, context, process, item) {
        const name = await crs.process.getValue(step.args.name, context, process, item);
        const stores = await crs.process.getValue(step.args.stores, context, process, item);
        return await this.#performWorkerAction("releaseStores", [name, stores], crypto.randomUUID());
    }

    /**
     * @method set - add these records to the database
     *
     * @param step - step to process
     * @param context - context of the process
     * @param process - process to run
     * @param item - item to process
     *
     * @param step.args.name {string} - name of the database to work with
     * @param step.args.records {array} - records to save
     * @parma step.args.clear {boolean} - clear the database before saving
     *
     * @returns {*}
     *
     * @example <caption>javascript</caption>
     * await crs.call("idb", "set", {
     *     "name": "data-manager",
     *     "records": [...]
     *     "store": "table_01",
     *     "clear": true
     * });
     *
     * @example <caption>json</caption>
     * {
     *    "type": "idb",
     *    "action": "set",
     *    "args": {
     *        "name": "data-manager",
     *        "records": [...]
     *        "store": "table_01",
     *        "clear": true
     *    }
     * }
     *
     */
    async set(step, context, process, item) {
        const name = await crs.process.getValue(step.args.name, context, process, item);
        const records = await crs.process.getValue(step.args.records, context, process, item);
        const clear = await crs.process.getValue(step.args.clear ?? false, context, process, item);
        const store = await crs.process.getValue(step.args.store, context, process, item);

        return await this.#performWorkerAction("set", [name, store, records, clear], crypto.randomUUID());
    }

    /**
     * @method add - add a record to the database
     * @param step - step to process
     * @param context - context of the process
     * @param process - process to run
     * @param item - item to process
     *
     * @param step.args.name {string} - name of the database to work with
     * @param step.args.record {object} - record to save
     * @returns {Promise<*>}
     *
     * @example <caption>javascript</caption>
     * await crs.call("idb", "add", {
     *    "name": "data-manager",
     *    "record": {...}
     *    "store": "table_01"
     * });
     *
     * @example <caption>json</caption>
     * {
     *   "type": "idb",
     *   "action": "add",
     *   "args": {
     *      "name": "data-manager",
     *      "record": {...}
     *      "store": "table_01"
     *    }
     * }
     */
    async add(step, context, process, item) {
        const name = await crs.process.getValue(step.args.name, context, process, item);
        const record = await crs.process.getValue(step.args.record, context, process, item);
        const store = await crs.process.getValue(step.args.store, context, process, item);

        return await this.#performWorkerAction("add", [name, store, record], crypto.randomUUID());
    }

    /**
     * @method clear - clear the database tables
     * @param step - step to process
     * @param context - context of the process
     * @param process - process to run
     * @param item - item to process
     * @param step.args.name {string} - name of the database to work with
     * @param step.args.stores {array} - stores to clear
     * @param step.args.zeroCount {boolean} - zero the count - if unsure leave out defaults to true
     * @param step.args.zeroTimeline {boolean} - zero the timeline - if unsure leave out defaults to true
     * @returns {Promise<*>}
     */
    async clear(step, context, process, item) {
        const name = await crs.process.getValue(step.args.name, context, process, item);
        const stores = await crs.process.getValue(step.args.stores, context, process, item);
        const zeroCount = await crs.process.getValue(step.args.zeroCount ?? true, context, process, item);
        const zerTimeline = await crs.process.getValue(step.args.zeroTimeline ?? true, context, process, item);

        return await this.#performWorkerAction("clear", [name, stores, zeroCount, zerTimeline], crypto.randomUUID());
    }

    /**
     * @method get_all - get all the record from a given database / table
     * @param name {string} - name of the database to work with
     * @param store {string} - store to get the records from
     * @returns {*}
     *
     * @example <caption>javascript</caption>
     * await crs.call("idb", "get_all", {
     *   "name": "data-manager",
     *   "store": "table_01"
     * });
     *
     * @example <caption>json</caption>
     * {
     *      "type": "idb",
     *      "action": "get_all",
     *      "args": {
     *          "name": "data-manager",
     *          "store": "table_01"
     *      }
     * }
     */
    async get_all(step, context, process, item) {
        const name = await crs.process.getValue(step.args.name, context, process, item);
        const store = await crs.process.getValue(step.args.store, context, process, item);

        return await this.#performWorkerAction("getAll", [name, store], crypto.randomUUID());
    }

    /**
     * @method get - get a record from the database
     * This can be either a single index item or a array of indexes
     * @param step - step to process
     * @param context - context of the process
     * @param process - process to run
     * @param item - item to process
     *
     * @param step.args.name {string} - name of the database to work with
     * @param step.args.indexes {number|array} - indexes to get
     * @param step.args.store {string} - store to get the records from
     * @returns {Promise<unknown>}
     *
     * @example <caption>javascript</caption>
     * await crs.call("idb", "get", {
     *     "name": "data-manager",
     *     "indexes": [1,2,3],
     *     "store": "table_01"
     * });
     *
     * @example <caption>json</caption>
     * {
     *     "type": "idb",
     *     "action": "get",
     *     "args": {
     *          "name": "data-manager",
     *          "indexes": [1,2,3],
     *          "store": "table_01"
     *     }
     * }
     */
    async get(step, context, process, item) {
        const name = await crs.process.getValue(step.args.name, context, process, item);
        const indexes = await crs.process.getValue(step.args.indexes, context, process, item);
        const store = await crs.process.getValue(step.args.store, context, process, item);

        return await this.#performWorkerAction("get", [name, store, indexes], crypto.randomUUID());
    }

    /**
     * @method get_batch - get a sequential batch of records from the database
     * @param step - step to process
     * @param context - context of the process
     * @param process - process to run
     * @param item - item to process
     *
     * @param step.args.name {string} - name of the database to work with
     * @param step.args.startIndex {number} - index to start from
     * @param [step.args.endIndex] {number} - index to end at, use instead of count
     * @param [step.args.count] {number} - number of records to get, use instead of endIndex
     * @returns {Promise<void>}
     *
     * @example <caption>javascript</caption>
     * await crs.call("idb", "get_batch", {
     *    "name": "data-manager",
     *    "store": "table_01",
     *    "startIndex": 1,
     *    "endIndex": 10 // or "count": 10
     * });
     *
     * @example <caption>json</caption>
     * {
     *   "type": "idb",
     *   "action": "get_batch",
     *   "args": {
     *      "name": "data-manager",
     *      "store": "table_01",
     *      "startIndex": 1,
     *      "endIndex": 10 // or "count": 10
     *   }
     * }
     */
    async get_batch(step, context, process, item) {
        const name = await crs.process.getValue(step.args.name, context, process, item);
        const store = await crs.process.getValue(step.args.store, context, process, item);
        const startIndex = await crs.process.getValue(step.args.startIndex, context, process, item);
        const endIndex = await crs.process.getValue(step.args.endIndex, context, process, item);
        const count = await crs.process.getValue(step.args.count, context, process, item);

        return await this.#performWorkerAction("getBatch", [name, store, startIndex, endIndex, count], crypto.randomUUID());
    }

    /**
     * @method get_page - get a page of records from the database
     * This is similar to get_batch but uses page and pageSize instead of startIndex and endIndex
     * @param step {object} - step to process
     * @param context {object} - context of the process
     * @param process {object} - process to run
     * @param item {object} - item to process
     *
     * @param step.args.name {string} - name of the database to work with
     * @param step.args.store {string} - store to get the records from
     * @param step.args.page {number} - page to get
     * @param step.args.pageSize {number} - number of records that make up one page
     * @returns {Promise<unknown>}
     *
     * @example <caption>javascript</caption>
     * await crs.call("idb", "get_page", {
     *   "name": "data-manager",
     *   "store": "table_01",
     *   "page": 1,
     *   "pageSize": 10
     * });
     *
     * @example <caption>json</caption>
     * {
     *     "type": "idb",
     *     "action": "get_page",
     *     "args": {
     *         "name": "data-manager",
     *         "store": "table_01",
     *         "page": 1,
     *         "pageSize": 10
     *     }
     * }
     */
    async get_page(step, context, process, item) {
        const name = await crs.process.getValue(step.args.name, context, process, item);
        const store = await crs.process.getValue(step.args.store, context, process, item);
        const page = await crs.process.getValue(step.args.page, context, process, item);
        const pageSize = await crs.process.getValue(step.args.pageSize, context, process, item);
        const startIndex = (page - 1) * pageSize;

        return await this.#performWorkerAction("getBatch", [name, store, startIndex, null, pageSize], crypto.randomUUID());
    }

    /**
     * @method get_by_id - get a record from the database by its id
     * @param step {object} - step to process
     * @param context {object} - context of the process
     * @param process {object} - process to run
     * @param item {object} - item to process
     *
     * @param step.args.name {string} - name of the database to work with
     * @param step.args.store {string} - store to get the records from
     * @param step.args.id {any} - id field value of the record to get
     * @returns {Promise<unknown>}
     */
    async get_by_id(step, context, process, item) {
        const name = await crs.process.getValue(step.args.name, context, process, item);
        const store = await crs.process.getValue(step.args.store, context, process, item);
        const id = await crs.process.getValue(step.args.id, context, process, item);

        return await this.#performWorkerAction("getById", [name, store, id], crypto.randomUUID());
    }

    /**
     * @method get_by_index - get a record from the database by an id, thus the model should have a id property on it.
     * @param step {object} - step to process
     * @param context {object} - context of the process
     * @param process {object} - process to run
     * @param item {object} - item to process
     *
     * @param step.args.name {string} - name of the database to work with
     * @param step.args.store {string} - store to get the records from
     * @param step.args.models {object|array} - single model or array of models to update
     * @returns {Promise<unknown>}
     *
     * @example <caption>javascript</caption>
     * await crs.call("idb", "get_by_index", {
     *     "name": "data-manager",
     *     "store": "table_01",
     *     "models": [{id: 1, ...}, {id: 101, ...}]
     * });
     *
     * @example <caption>json</caption>
     * {
     *  "type": "idb",
     *  "action": "get_by_index",
     *  "args": {
     *     "name": "data-manager",
     *     "store": "table_01",
     *     "models": [{id: 1, ...}, {id: 101, ...}]
     *   }
     * }
     */
    async update_by_id(step, context, process, item) {
        const name = await crs.process.getValue(step.args.name, context, process, item);
        const store = await crs.process.getValue(step.args.store, context, process, item);
        const models = await crs.process.getValue(step.args.models, context, process, item);

        return await this.#performWorkerAction("updateById", [name, store, models], crypto.randomUUID());
    }

    /**
     * @method delete_old-db - delete old databases, this checks the meta database and deletes databases that exceed the defined duration
     * @param step {object} - step to process
     * @param context {object} - context of the process
     * @param process {object} - process to run
     * @param item {object} - item to process
     *
     * @param step.args.duration {number} - duration in milliseconds
     * @returns {Promise<unknown>}
     *
     * @example <caption>javascript</caption>
     * await crs.call("idb", "delete_old_db", {
     *    "duration": 604800000 // 7 days
     * });
     *
     * @example <caption>json</caption>
     * {
     *     "type": "idb",
     *     "action": "delete_old_db",
     *     "args": {
     *        "duration": 604800000
     *     }
     * }
     */
    async delete_old_db(step, context, process, item) {
        const duration = await crs.process.getValue(step.args.duration, context, process, item);
        return await this.#performWorkerAction("deleteOldDatabase", [duration], crypto.randomUUID());
    }

    /**
     * @method delete_db - delete a database from the indexedDB
     * @param step {object} - step to process
     * @param context {object} - context of the process
     * @param process {object} - process to run
     * @param item {object} - item to process
     *
     * @param step.args.name {string} - name of the database to delete
     * @returns {Promise<unknown>}
     *
     * @example <caption>javascript</caption>
     * await crs.call("idb", "delete_db", {
     *      "name": "data-manager"
     * });
     *
     * @example <caption>json</caption>
     * {
     *    "type": "idb",
     *    "action": "delete_db",
     *    "args": {
     *        "name": "data-manager"
     *    }
     * }
     */
    async delete_db(step, context, process, item) {
        const name = await crs.process.getValue(step.args.name, context, process, item);
        return await this.#performWorkerAction("deleteDatabase", [name], crypto.randomUUID());
    }

    /**
     * @method delete_by_id - delete a record from the database by its id
     * @param step {object} - step to process
     * @param context {object} - context of the process
     * @param process {object} - process to run
     * @param item {object} - item to process
     *
     * @param step.args.name {string} - name of the database to work with
     * @param step.args.store {string} - store to get the records from
     * @param step.args.ids {any} - id field value of the record to get
     * @returns {Promise<unknown>}
     *
     * @example <caption>javascript</caption>
     * await crs.call("idb", "delete_by_id", {
     *    "name": "data-manager",
     *    "store": "table_01",
     *    "ids": [1, 101]
     * });
     *
     * @example <caption>json</caption>
     * {
     *     "type": "idb",
     *     "action": "delete_by_id",
     *     "args": {
     *         "name": "data-manager",
     *         "store": "table_01",
     *         "ids": [1, 101]
     *     }
     * }
     */
    async delete_by_id(step, context, process, item) {
        const name = await crs.process.getValue(step.args.name, context, process, item);
        const store = await crs.process.getValue(step.args.store, context, process, item);
        const ids = await crs.process.getValue(step.args.ids, context, process, item);

        return await this.#performWorkerAction("deleteById", [name, store, ids], crypto.randomUUID());
    }
}

crs.intent.idb = new IndexDBManager()