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

        // const target = await crs.process.getValue(step.args.target, process.context, process);
        // const value = await crs.process.getValue(step.args.value, context, process);
        //
        // if (value != null && target != null) {
        //     target.push(value);
        // }
        // else {
        //     console.error(`can't add to array - array is null:${target == null}, value is null:${value == null}`);
        // }
    }
}