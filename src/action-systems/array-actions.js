/**
 * @class ArrayActions - This is a static class that contains the actions for manipulating arrays
 *
 * Features:
 * - add - add an item to an array
 * - remove - remove an item from an array
 * - transfer - transfer an item from one array to another
 * - field_to_csv - convert an array of objects to a csv string
 * - concat - concat two arrays
 * - change_values - change the values of an array
 * - get_value - get the value of an array at a given index
 * - map_objects - map an array of objects to an array of values
 * - get_records - get the records from an array of objects, given the page size and page number to return
 * - get_range - get a range (min and max) of values from an array
 * - calculate_paging - for the given array and how big a page size is, how many pages fit in the array
 * - map_assign_data - map an array of objects using a mapping definition to remap fields and add new fields.
 */
export class ArrayActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    /**
     * @method add - add an item to an array
     * @param step {object} - The step that contains the action to perform
     * @param context {object} - The context of the process
     * @param process {object} - The process
     * @param item {object} - Current item in a process loop
     *
     * @param step.args.target {Array} - target array to add to
     * @param step.args.value {*} - value to add to the array
     *
     * @returns {Promise<void>}
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("array", "add", {
     *    target: array,
     *    value: "value"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "array",
     *     "action": "add",
     *     "args": {
     *         "target": "@process.array",
     *         "value": "value"
     *     }
     * }
     */
    static async add(step, context, process, item) {
        const target = await crs.process.getValue(step.args.target, context, process, item);
        const value = await crs.process.getValue(step.args.value, context, process, item);

        if (target != null && value != null) {
            target.push(value);
        } else {
            console.error(`can't add to array - array is null:${target == null}, value is null:${value == null}`);
        }
    }

    /**
     * @method remove - removes a value from a defined array
     * @param step {object} - The step that contains the action to perform
     * @param context {object} - The context of the process
     * @param process {object} - The process
     * @param item {object} - Current item in a process loop
     *
     * @param step.args.target {Array} - target array to remove from
     * @param step.args.value {*} - value to remove from the array
     *
     * @returns {Promise<void>}
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("array", "remove", {
     *   target: array,
     *   value: "value"
     *   }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *    "type": "array",
     *    "action": "remove",
     *    "args": {
     *        "target": "@process.array",
     *        "value": "value"
     *    }
     * }
     */
    static async remove(step, context, process, item) {
        const target = await crs.process.getValue(step.args.target, context, process, item);
        const value = await crs.process.getValue(step.args.value, context, process, item);

        const index = target?.indexOf(value);
        if (target != null && value != null && index !== -1) {
            target.splice(index, 1);
        } else {
            console.error(`can't remove from array - array is null:${target == null}, value is null:${value == null}, value is not contained within target`);
        }
    }

    /**
     * @method transfer - This function transfers a value from one array to another
     * @param step {Object} - step to perform
     * @param context {Object} - context of the process
     * @param process {Object} - process to perform
     * @param item{Object} - item to perform the action on
     *
     * @param step.args.source {Array} - source array to remove from
     * @param step.args.target {Array} - target array to add to
     * @param step.args.value {*} - value to transfer from the source to the target
     *
     * @returns {Promise<void>}
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("array", "transfer", {
     *     source: array1,
     *     target: array2,
     *     value: "value"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *   "type": "array",
     *   "action": "transfer",
     *   "args": {
     *        "source": "@process.array1",
     *        "target": "@process.array2",
     *        "value": "value"
     *    }
     * }
     */
    static async transfer(step, context, process, item) {
        const source = await crs.process.getValue(step.args.source, context, process, item);
        const target = await crs.process.getValue(step.args.target, context, process, item);
        const value = await crs.process.getValue(step.args.value, context, process, item);

        await this.add({args: {target: target, value: value}}, context, process, item);
        await this.remove({args: {target: source, value: value}}, context, process, item)
    }

    /**
     * @method field_to_csv - This function takes an array of objects and exports csv text
     *
     * @param step {Object} - step to perform
     * @param context {Object} - context of the process
     * @param process {Object} - process to perform
     * @param item {Object} - item to perform the action on
     *
     * @param step.args.source {Array} - source array to convert
     * @param step.args.target {Array} - target array to add to
     * @param step.args.field {String} - field to convert to csv
     * @param step.args.fields {[string]} - fields to convert to csv
     * @param [step.args.delimiter = ' , '] {Symbol}  - delimiter to use in the csv
     *
     * @returns {Promise<void>}
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("array", "field_to_csv", {
     *    source: array,
     *    target: "@process.csv",
     *    field: "field"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "array",
     *     "action": "field_to_csv",
     *     "args": {
     *         "source": "@process.array",
     *         "target": "@process.csv",
     *         "field": "field"
     *     }
     * }
     */
    static async field_to_csv(step, context, process, item) {
        const source = await crs.process.getValue(step.args.source, context, process, item);

        if (source == null) {
            return console.error("fieldToCSV - target array does not exist");
        }

        let result;

        const delimiter = (await crs.process.getValue(step.args.delimiter, context, process, item)) || ",";

        if (step.args.field != null) {
            result = field_to_csv(source, step.args.field, delimiter);
        } else if (step.args.fields != null) {
            result = fields_to_csv(source, step.args.fields, delimiter);
        }

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    /**
     * @method concat - Create a new array that contains the content of the defined source arrays.
     *
     * @param step {Object} - step to perform
     * @param context {Object} - context of the process
     * @param process {Object} - process to perform
     * @param item {Object} - item to perform the action on
     *
     * @param step.args.sources {Array} - array of source arrays
     * @param step.args.target {string} - target array to add to
     *
     * @returns {Promise<*[]>}
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("array", "concat", {
     *    sources: [array1, array2],
     *    target: "@process.array"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "array",
     *     "action": "concat",
     *     "args": {
     *         "sources": ["@process.array1", "@process.array2"],
     *         "target": "@process.array"
     *     }
     * }
     */
    static async concat(step, context, process, item) {
        let result = [];

        const sources = await crs.process.getValue(step.args.sources, context, process, item);
        for (let source of sources) {
            let array = await crs.process.getValue(source, context, process, item);
            result = [...result, ...array];
        }

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    /**
     * @method change_values - Change the values of fields in a object array
     *
     * @param step {Object} - step to perform
     * @param context {Object}  - context of the process
     * @param process {Object}  - process to perform
     * @param item {Object}  - item to perform the action on
     *
     * @param step.args.source {string|[]} - source array to change
     * @param step.args.changes {Object} - object of changes to make with key being the field to change and value being the new value
     *
     * @returns {Promise<void>}
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("array", "change_values", {
     *     source: array,
     *     changes: {
     *       field1: "new value",
     *       field2: "@process.field"
     *     }
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "array",
     *     "action": "change_values",
     *     "args": {
     *         "source": "@process.array",
     *         "changes": {
     *         "field1": "new value",
     *         "field2": "@process.field"
     *     }
     * }
     */
    static async change_values(step, context, process, item) {
        const collection = await crs.process.getValue(step.args.source, context, process, item);
        const keys = Object.keys(step.args.changes);

        let obj = {};
        for (let key of keys) {
            obj[key] = await crs.process.getValue(step.args.changes[key], context, process, item);
        }

        for (let record of collection) {
            for (let key of keys) {
                record[key] = obj[key]
            }
        }
    }

    /**
     * @method get_value - For a given record at index provided, get the value of defined property
     *
     * @param step {Object}  - step to perform
     * @param context {Object}  - context of the process
     * @param process {Object} - process to perform
     * @param item {Object} - item to perform the action on
     *
     * @param step.args.source {string|[]} - source array to change
     * @param step.args.index {Number} - index of the record to get the value from
     * @param step.args.property {String} - property to get the value from
     * @param step.args.target {string} - target to store the value in
     *
     *
     * @returns {Promise<*>}
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("array", "get_value", {
     *     source: array,
     *     index: 0,
     *     property: "field"
     *     target: "@process.field"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "array",
     *     "action": "get_value",
     *     "args": {
     *         "source": "@process.array",
     *         "index": 0,
     *         "property": "field"
     *         "target": "@process.field"
     *     }
     * }
     */
    static async get_value(step, context, process, item) {
        const collection = await crs.process.getValue(step.args.source, context, process, item);
        let result = collection[step.args.index][step.args.field];

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    /**
     * @method map_objects - For an array of objects map an object field/s to a flat array of values
     *
     * @param step {Object} - step to perform
     * @param context {Object} - context of the process
     * @param process {Object} - process to perform
     * @param item {Object} - item to perform the action on
     *
     * @param step.args.source {string|[]} - source array to change
     * @param step.args.fields {[string]} - fields to map
     * @param step.args.target {String} - target array to add to
     *
     * @returns {Promise<*[]>}
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("array", "map_objects", {
     *    source: array,
     *    fields: ["field1", "field2"],
     *    target: "@process.array"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "array",
     *     "action": "map_objects",
     *     "args": {
     *         "source": "@process.array",
     *         "fields": ["field1", "field2"],
     *         "target": "@process.array"
     *     }
     * }
     */
    static async map_objects(step, context, process, item) {
        const collection = await crs.process.getValue(step.args.source, context, process, item) ?? [];
        const fields = step.args.fields ?? [];
        let result = [];

        for (const item of collection) {
            const res = await Promise.all(fields.map(f => crsbinding.utils.getValueOnPath(item, f)));
            result.push(...res);
        }

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    /**
     * @method get_records - Get records starting at a page number for a particular batch size
     *
     * @param step {Object} - step to perform
     * @param context {Object} - context of the process
     * @param process {Object} - process to perform
     * @param item {Object} - item to perform the action on
     *
     * @param step.args.source {string|[]} - source array to change
     * @param step.args.page_number {Number} - page number to start from
     * @param step.args.page_size {Number} - page size to get
     * @param step.args.fields {[string]} - fields to get
     * @param step.args.target {String} - target array to add to
     *
     * @returns {Promise<*>}
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("array", "get_records", {
     *    source: array,
     *    page_number: 0,
     *    page_size: 10,
     *    fields: ["field1", "field2"],
     *    target: "@process.array"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *    "type": "array",
     *    "action": "get_records",
     *    "args": {
     *       "source": "@process.array",
     *       "page_number": 0,
     *       "page_size": 10,
     *       "fields": ["field1", "field2"],
     *       "target": "@process.array"
     *    }
     * }
     */
    static async get_records(step, context, process, item) {
        const result = [];

        const data = await crs.process.getValue(step.args.source, context, process, item);
        const pageNumber = await crs.process.getValue(step.args.page_number, context, process, item);
        const pageSize = await crs.process.getValue(step.args.page_size, context, process, item);
        const fields = await crs.process.getValue(step.args.fields, context, process, item);

        for (let i = pageNumber; i < pageNumber + pageSize; i++) {
            if (data[i] == null) {
                break;
            }

            if (fields == null) {
                result.push(data[i]);
            } else {
                let obj = {};
                for (let field of fields) {
                    obj[field] = data[i][field];
                }
                result.push(obj);
            }
        }

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    /**
     * @method get_range - get the min and max values of the data for a given field.
     *
     * @param step {Object}  - step to perform
     * @param context {Object}  - context of the process
     * @param process {Object}  - process to perform
     * @param item {Object}  - item to perform the action on
     *
     * @param step.args.source {string|[]} - source array to change
     * @param step.args.field {String} - field to get the min and max values from
     * @param step.args.target {String} - target array to add to
     *
     * @returns {Promise<*>}
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("array", "get_range", {
     *   source: array,
     *   field: "field1",
     *   target: "@process.array"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "array",
     *     "action": "get_range",
     *     "args": {
     *         "source": "@process.array",
     *         "field": "field1",
     *         "target": "@process.array"
     *     }
     * }
     */
    static async get_range(step, context, process, item) {
        const data = await crs.process.getValue(step.args.source, context, process, item);
        const field = await crs.process.getValue(step.args.field, context, process, item);

        const result = {min: Number.MAX_VALUE, max: Number.MIN_VALUE};
        for (let row of data) {
            const value = row[field];
            if (value < result.min) {
                result.min = value;
            }
            if (value > result.max) {
                result.max = value;
            }
        }

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    /**
     * @method calculate_paging - Calculate the number of pages of an array for a given batch size
     *
     * @param step {Object} - step to perform
     * @param context {Object} - context of the process
     * @param process {Object} - process to perform
     * @param item {Object} - item to perform the action on
     *
     * @param step.args.source {string|[]} - source array to change
     * @param step.args.page_size {Number} - page size to get
     * @param step.args.target {String} - target array to add to
     *
     * @returns {Promise<*>}
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("array", "calculate_paging", {
     *    source: data,
     *    page_size: 10
     *    target: "$process.paging"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "array",
     *     "action": "calculate_paging",
     *     "args": {
     *         "source": "@process.array",
     *         "page_size": 10,
     *         "target": "@process.array"
     *     }
     * }
     */
    static async calculate_paging(step, context, process, item) {
        const data = await crs.process.getValue(step.args.source, context, process, item);
        const pageSize = await crs.process.getValue(step.args.page_size, context, process, item);

        const pageCount = Math.ceil(data.length / pageSize);
        let result = {
            row_count: data.length,
            page_count: pageCount
        }

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    /**
     * @method map_assign_data - Apply mappings to an array of objects, allowing you to assign data from one field to another
     * it also can add new fields and null existing fields. It returns the existing array with modifications made.
     * Note: all source items must have the same fields.
     *
     * @param step {object} - step to perform
     * @param context {object} - context of the process
     * @param process {object} - process to perform
     * @param item {object} - item to perform the action on
     *
     * @param step.args.source {string|[]} - source array to map and assign data to
     * @param step.args.mappings {object} - mappings to perform where key is the source field and value is the target field
     * @param step.args.target {string|[]} - target to save new array of objects to
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("array", "map_assign_data", {
     *   source: data,
     *   mappings: {
     *       "field1": "field5",
     *       "field2": "field6",
     *       "field3": null
     *   }
     *   target: "$process.result"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *   "type": "array",
     *   "action": "map_assign_data",
     *   "args": {
     *     "source": "@process.array",
     *     "mappings": {
     *       "field1": "field5",
     *       "field2": "field6",
     *       "field3": null
     *     },
     *     "target": "@process.array"
     *   }
     * }
     *
     * @returns {Array[{object}]} - array of objects
     */
    static async map_assign_data(step, context, process, item) {
        const data = await crs.process.getValue(step.args.source, context, process, item);
        const mappings = await crs.process.getValue(step.args.mappings, context, process, item);

        const keys = Object.keys(mappings);
        // get the keys of the first row, to improve performance this is done once
        const rowKeys = Object.keys(data[0] ?? {});

        for (const row of data) {
            for (let mappingKey of keys) {
                let mappingValue = mappings[mappingKey];
                mappingKey = await crs.process.getValue(mappingKey, context, process, item);
                mappingValue = await crs.process.getValue(mappingValue, context, process, item);

                // if the mappingValue is null, then we want to set the mappingKey field to null
                if (mappingValue == null) {
                    row[mappingKey] = null
                    continue;
                }

                // if the mappingValue is not in the row, then we want to set the mappingKey field to the mappingValue
                if (rowKeys.indexOf(mappingValue) == -1) {
                    row[mappingKey] = mappingValue;
                    continue;
                }

                // otherwise we want to do a normal mapping
                row[mappingKey] = row[mappingValue];
            }
        }

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, data, context, process, item);
        }

        return data;
    }
}

/**
 *  Convert an array of objects to a csv string
 * @param array {[object]} - array of objects
 * @param field {string} - field to get
 * @param delimiter {delimiter} - delimiter to use
 * @returns {Promise<*>}
 * @private
 *
 * @example
 * result = await field_to_csv(data, "name", ",");
 */
async function field_to_csv(array, field, delimiter) {
    const map = array.map(item => item[field]);
    return map.join(delimiter || ",");
}

/**
 * Convert an array of objects to a csv string
 * @param array {[object]} - array of objects
 * @param fields {[string]} - fields to get
 * @param delimiter {delimiter} - delimiter to use
 * @returns {Promise<*[]>}
 * @private
 *
 * @example
 * result = await fields_to_csv(data, ["name", "age"], ",");
 */
async function fields_to_csv(array, fields, delimiter) {
    let result = [];

    for (let row of array) {
        let values = [];

        for (let field of fields) {
            values.push(row[field]);
        }

        result.push(values.join(delimiter));
    }

    return result;
}

crs.intent.array = ArrayActions;