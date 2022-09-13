/**
 * This class maintains a collection if size data used during virtualization operations.
 */
export class SizeManager {
    get size() {
        return this._size;
    }

    /**
     * constructor
     * @param updateCallback {function} this is called when size or indexing changes
     */
    constructor(updateCallback) {
        this._size = 0;
        this._updateCallback = updateCallback;
        this._collection = [];
    }

    dispose() {
        this._updateCallback = null;
        this._collection = null;
    }

    /**
     * Replace the existing collection with a new collection.
     * The array must have a set of items each having the same size but the data-index flows from 0 to count
     * @param size {number}
     * @param count {number}
     */
    fill(size, count) {
        this._collection = [];
        for (let i = 0; i < count; i++) {
            this._collection.push({
                size: size,
                dataIndex: i
            })
        }

        this._size = size * count;
        this._updateCallback();
    }

    /**
     * Append item to the end of the array
     * @param items {array}
     */
    append(items) {
        this._collection.push(...items);

        this._size += calculateSize(items);

        this._updateCallback();
    }

    /**
     * Change the size of the item at that index
     * Update the size using the difference between the old value and new value
     * dataIndex parameter is optional, if provided update it if note leave alone
     * @param index {number}
     * @param size {number}
     */
    update(index, size, dataIndex) {
        let oldValue = this._collection[index].size;
        const sizeDifference = size - oldValue;

        this._size = this._size + sizeDifference;

        this._collection[index].size = size;
        this._collection[index].dataIndex = dataIndex;

        this._updateCallback();
    }

    /**
     * Insert an item at a particular index
     * Create an object to insert into the index given and use the size and dataIndex provided to create the item and at it to the collection
     * @param index {number}
     * @param size {number}
     * @param dataIndex {number}
     */
    insert(index, size, dataIndex) {
        this._collection.splice(index, 0, {size: size, dataIndex: dataIndex});

        this._size = this._size + size;
        this._updateCallback();
    }

    /**
     * Move an item in the array from the fromIndex to the toIndex
     * @param fromIndex {number}
     * @param toIndex {number}
     */
    move(fromIndex, toIndex) {
        let item = this._collection[fromIndex];
        this._collection.splice(fromIndex, 1);
        this._collection.splice(toIndex,0, item);

        this._updateCallback();
    }

    /**
     * Remove items from the collection starting at the index for the given count
     * @param index {number}
     * @param count {number}     */
    remove(index, count) {
        this._size = this._size - this._collection[index].size;

        this._collection.splice(index, count);

        this._updateCallback();
    }

    /**
     * Recalculate the size by looking at all the items in the collection
     */

    recalculate() {
        return this._size = calculateSize(this._collection);
    }

    /**
     * Return the item in the collection at that index
     * @param index
     */
    at(index) {
        return this._collection.at(index)
    }
}

function calculateSize(collection) {
    let total = 0;
    collection.forEach(item => {
        total = total + item.size;
    });

    return total;
}