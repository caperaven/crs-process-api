/**
 * This class maintains a collection if size data used during virtualization operations.
 */
export class SizeManager {
    get size() {
        return this._size || 0;
    }

    constructor(updateCallback) {
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
        // @Andre:NOTE - when managing the total size use the this._size field as this.size is a readonly property - remove this comment once you understand
    }

    /**
     * Append item to the end of the array
     * @param items {array}
     */
    append(items) {

    }

    /**
     * Change the size of the item at that index
     * Update the size using the difference between the old value and new value
     * @param index {number}
     * @param size {number}
     */
    update(index, size, dataIndex) {

    }

    /**
     * Insert an item at a particular index
     * @param index {number}
     * @param size {number}
     * @param dataIndex {number}
     */
    insert(index, size, dataIndex) {

    }

    /**
     * Move an item in the array from the fromIndex to the toIndex
     * @param fromIndex {number}
     * @param toIndex {number}
     */
    move(fromIndex, toIndex) {

    }

    /**
     * Remove items from the collection starting at the index for the given count
     * @param index {number}
     * @param count {number}     */
    remove(index, count) {

    }

    /**
     * Recalculate the size by looking at all the items in the collection
     */
    recalculate() {
        // this._size = ... sum of items;
    }

    /**
     * Return the item in the collection at that index
     * @param index
     */
    at(index) {

    }
}