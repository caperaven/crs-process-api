export class ArrayActions {
    static async perform(step, context, process) {
        await this[step.action](step, context, process);
    }

    static async add(step, context, process) {
        const target = await crs.process.getValue(step.args.target, context, process);
        const value = await crs.process.getValue(step.args.value, context, process);

        if (target != null && value != null) {
            target.push(value);
        }
        else {
            console.error(`can't add to array - array is null:${target == null}, value is null:${value == null}`);
        }
    }

    static async field_to_svg(step, context, process) {
        const source = await crs.process.getValue(step.args.source, context, process);

        if (source == null) {
            return console.error("fieldToCSV - target array does not exist");
        }

        const map = source.map(item => item[step.args.field]);
        const result = map.join(step.args.delimiter || ",");

        await crs.process.setValue(step.args.target, result, context, process);
    }
}