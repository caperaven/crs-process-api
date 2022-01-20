export class SessionStorageAction {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    static async set_value(step, context, process, item) {
        const key = await crs.process.getValue(step.args.key, context, process, item);
        const value = await crs.process.getValue(step.args.value, context, process, item);
        sessionStorage.setItem(key, value);
    }

    static async get_value(step, context, process, item) {
        const key = await crs.process.getValue(step.args.key, context, process, item);
        const result = sessionStorage.getItem(key);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result);
        }

        return result;
    }

    static async set_object(step, context, process, item) {
        const key = await crs.process.getValue(step.args.key, context, process, item);
        const value = await crs.process.getValue(step.args.value, context, process, item);
        const json = JSON.stringify(value);
        sessionStorage.setItem(key, json);
    }

    static async get_object(step, context, process, item) {
        const key = await crs.process.getValue(step.args.key, context, process, item);
        const value = sessionStorage.getItem(key);
        const result = JSON.parse(value);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result);
        }

        return result;
    }

    static async remove(step, context, process, item) {
        const key = await crs.process.getValue(step.args.key, context, process, item);
        sessionStorage.removeItem(key);
    }
}