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

        if (step.args.field != null) {
            result = field_to_csv(source, step.args.field, step.args.delimiter);
        } else if (step.args.fields != null) {
            result = fields_to_csv(source, step.args.fields, step.args.delimiter);
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

        for (let source of step.args.sources) {
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