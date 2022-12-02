export class ArrayActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    /**
     * This function adds an value to an defined array
     * @returns {Promise<void>}
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

    static async transfer(step, context, process, item) {
        const source = await crs.process.getValue(step.args.source, context, process, item);
        const target = await crs.process.getValue(step.args.target, context, process, item);
        const value = await crs.process.getValue(step.args.value, context, process, item);

        await this.add({args: {target: target, value: value}}, context, process, item);
        await this.remove({args: {target: source, value: value}}, context, process, item)
    }

    /**
     * This function takes an array of objects and exports csv text
     * @returns {Promise<void>}
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
     * Create a new array that contains the content of the defined source arrays.
     * @returns {Promise<*[]>}
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
     * Change the values of fields in a object array
     * @returns {Promise<void>}
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
     * For a given record at index provided, get the value of defined property
     * @returns {Promise<*>}
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
     * For an array of objects map an object field/s to a flat array of values
     * @returns {Promise<*[]>}
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
     * Get records starting at a page number for a particular batch size
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
            }
            else {
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
     * get the min and max values of the data for a given field.
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
     * Calculate the number of pages of an array for a given batch size
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
}

async function field_to_csv(array, field, delimiter) {
    const map = array.map(item => item[field]);
    return map.join(delimiter || ",");
}

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