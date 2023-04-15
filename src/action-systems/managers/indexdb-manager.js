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
    }

    dispose() {
        this.#worker.onmessage = null;
        this.#worker.terminate();
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

    async create(step, context, process, item) {
        const name = await crs.process.getValue(step.args.name, context, process, item);
        const version = await crs.process.getValue(step.args.version, context, process, item);
        const storeNames = await crs.process.getValue(step.args.storeNames, context, process, item);

        return await this.#performWorkerAction("create", [name, version, storeNames], crypto.randomUUID());
    }

    async connect(step, context, process, item) {
        const name = await crs.process.getValue(step.args.name, context, process, item);
        const key = await crs.process.getValue(step.args.key || "index", context, process, item);

        return await this.#performWorkerAction("connect", [name, key], crypto.randomUUID());
    }

    async disconnect(step, context, process, item) {
        const name = await crs.process.getValue(step.args.name, context, process, item);
        return await this.#performWorkerAction("disconnect", [name], crypto.randomUUID());
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
     */
    async add(step, context, process, item) {
        const name = await crs.process.getValue(step.args.name, context, process, item);
        const record = await crs.process.getValue(step.args.record, context, process, item);
        const store = await crs.process.getValue(step.args.store, context, process, item);

        return await this.#performWorkerAction("add", [name, store, record], crypto.randomUUID());
    }

    /**
     * @method clear - clear the database
     * @param step - step to process
     * @param context - context of the process
     * @param process - process to run
     * @param item - item to process
     * @param step.args.name {string} - name of the database to work with
     * @returns {Promise<*>}
     */
    async clear(step, context, process, item) {
        const name = await crs.process.getValue(step.args.name, context, process, item);
        const store = await crs.process.getValue(step.args.store, context, process, item);

        return await this.#performWorkerAction("clear", [name, store], crypto.randomUUID());
    }

    /**
     * @method get_all - get all the record from a given database / table
     * @param name {string} - name of the database to work with
     * @returns {*}
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
     * @returns {Promise<unknown>}
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
     */
    async get_batch(step, context, process, item) {
        const name = await crs.process.getValue(step.args.name, context, process, item);
        const store = await crs.process.getValue(step.args.store, context, process, item);
        const startIndex = await crs.process.getValue(step.args.startIndex, context, process, item);
        const endIndex = await crs.process.getValue(step.args.endIndex, context, process, item);
        const count = await crs.process.getValue(step.args.count, context, process, item);

        return await this.#performWorkerAction("getBatch", [name, store, startIndex, endIndex, count], crypto.randomUUID());
    }

    async get_page(step, context, process, item) {
        const name = await crs.process.getValue(step.args.name, context, process, item);
        const store = await crs.process.getValue(step.args.store, context, process, item);
        const page = await crs.process.getValue(step.args.page, context, process, item);
        const pageSize = await crs.process.getValue(step.args.pageSize, context, process, item);
        const startIndex = (page - 1) * pageSize;

        return await this.#performWorkerAction("getBatch", [name, store, startIndex, null, pageSize], crypto.randomUUID());
    }
}

crs.intent.idb = new IndexDBManager()