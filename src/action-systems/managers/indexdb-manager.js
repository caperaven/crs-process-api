import {Database} from "./indexdb-manager/database.js";

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
    /**
     * @private
     * @field store - contains all the current open database instances.
     * key - value dictionary where the key is the entity name and the value is the db instance to interact with
     */
    #store = {};

    async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    async connect(step, context, process, item) {
        const name = await crs.process.getValue(step.args.name, context, process, item);
        const key = await crs.process.getValue(step.args.key || "index", context, process, item);

        const instance = new Database();
        await instance.connect(name, name, key);
        this.#store[name] = instance;
    }

    async disconnect(step, context, process, item) {
        const name = await crs.process.getValue(step.args.name, context, process, item);
        await this.#store[name]?.disconnect();
        delete this.#store[name]
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
        return await this.#store[name].set(records);
    }

    /**
     * @method get_all - get all the record from a given database / table
     * @param name {string} - name of the database to work with
     * @returns {*}
     */
    async get_all(step, context, process, item) {
        const name = await crs.process.getValue(step.args.name, context, process, item);
        return await this.#store[name].getAll()
    }
}

crs.intent.idb = new IndexDBManager()