export class StorageAction {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    static async set_value(step, context, process, item) {
        const key = await crs.process.getValue(step.args.key, context, process, item);
        const value = await crs.process.getValue(step.args.value, context, process, item);
        localStorage.setItem(key, value);
    }

    static async get_value(step, context, process, item) {
        const key = await crs.process.getValue(step.args.key, context, process, item);
        const result = localStorage.getItem(key);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result);
        }

        return result;
    }

    static async set_object(step, context, process, item) {
        const key = await crs.process.getValue(step.args.key, context, process, item);
        const value = await crs.process.getValue(step.args.value, context, process, item);
        const json = JSON.stringify(value);
        localStorage.setItem(key, json);
    }

    static async get_object(step, context, process, item) {
        const key = await crs.process.getValue(step.args.key, context, process, item);
        const value = localStorage.getItem(key);
        const result = JSON.parse(value);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result);
        }

        return result;
    }

    static async remove(step, context, process, item) {
        const key = await crs.process.getValue(step.args.key, context, process, item);
        localStorage.removeItem(key);
    }
}