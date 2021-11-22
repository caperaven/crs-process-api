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
        }
        else {
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

        const map = source.map(item => item[step.args.field]);
        const result = map.join(step.args.delimiter || ",");

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }
}