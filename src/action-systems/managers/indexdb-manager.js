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
    #store;

    async perform(step, context, process, item) {

    }


    /**
     * @method set - add these records to the database
     * @param name {string} - name of the database to work with
     * @param records {array} - records to save
     * @param returnFirstPage {boolean} - if true, while you are saving this, return the first page for me while continuing to add it in the background
     * @returns {*}
     */
    set(name, records, returnFirstPage = false) {
        // todo: convert this to a process.
        return this.#store[name].set(records);
    }

    /**
     * @method get_all - get all the record from a given database / table
     * @param name {string} - name of the database to work with
     * @returns {*}
     */
    get_all(name) {
        return this.#store[name].getAll()
    }
}