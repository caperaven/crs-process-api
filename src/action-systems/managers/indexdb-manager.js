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
            if (event.data.type === "error") {
                returnPromise.reject(event.data.error);
            }
            else {
                returnPromise.resolve({
                    result: event.data.result,
                    data: event.data.data
                });
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
     * @param step.args.name {string} - name of the database to work with
     * @param step.args.records {array} - records to save
     * @returns {*}
     */
    async set(step, context, process, item) {
        const name = await crs.process.getValue(step.args.name, context, process, item);
        const records = await crs.process.getValue(step.args.records, context, process, item);
        return await this.#performWorkerAction("set", [name, records], crypto.randomUUID());
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
        return await this.#performWorkerAction("add", [name, record], crypto.randomUUID());
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
        return await this.#performWorkerAction("clear", [name], crypto.randomUUID());
    }

    /**
     * @method get_all - get all the record from a given database / table
     * @param name {string} - name of the database to work with
     * @returns {*}
     */
    async get_all(step, context, process, item) {
        const name = await crs.process.getValue(step.args.name, context, process, item);
        return await this.#performWorkerAction("get_all", [name], crypto.randomUUID());
    }

    async get(step, context, process, item) {
        const name = await crs.process.getValue(step.args.name, context, process, item);
        const indexes = await crs.process.getValue(step.args.indexes, context, process, item);
        return await this.#performWorkerAction("get", [name, indexes], crypto.randomUUID());
    }
}

crs.intent.idb = new IndexDBManager()