export class ArrayActions {
    static async perform(step, item, process) {
        this[step.action](step, item, process);
    }

    static async add(step, item, process) {
        const target = await crs.process.getValue(step.args.target, process.context, process);
        const value = await crs.process.getValue(step.args.value, item, process);

        if (value != null && target != null) {
            target.push(value);
        }
        else {
            console.error(`can't add to array - array is null:${target == null}, value is null:${value == null}`);
        }
    }
}