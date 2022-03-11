export class ObjectActions {
    static async perform(step, context, process, item) {
        return await this[step.action](step, context, process, item);
    }

    /**
     * Set a property value on a object as defined in the step
     * @param step
     * @param context
     * @param process
     * @param item
     * @returns {Promise<void>}
     */
    static async set(step, context, process, item) {
        if (step.args.properties != null) {
            const keys = Object.keys(step.args.properties);
            for (let key of keys) {
                await globalThis.crs.process.setValue(`${step.args.target}.${key}`, step.args.properties[key], context, process, item);
            }
            return;
        }

        return await globalThis.crs.process.setValue(step.args.target, step.args.value, context, process, item);
    }

    static async set_on_path(step, context, process, item) {
        if (step.args.paths != null) {
            const paths = await crs.process.getValue(step.args.paths, context, process, item);
            for (const pathItem of paths) {
                const path = (await crs.process.getValue(pathItem.path, context, process, item)).split(".").join("/");
                const obj = await crs.process.getValue(pathItem.target, context, process, item);
                const value = await crs.process.getValue(pathItem.value, context, process, item);
                await setValueOnPath(obj, path, value);
            }
        }
        else {
            const path = (await crs.process.getValue(step.args.path, context, process, item)).split(".").join("/");
            const obj = await crs.process.getValue(step.args.target, context, process, item);
            const value = await crs.process.getValue(step.args.value, context, process, item);
            await setValueOnPath(obj, path, value);
        }
    }

    /**
     * Get a property value as defined in the step
     * @param step
     * @param context
     * @param process
     * @param item
     * @returns {Promise<string|*>}
     */
    static async get(step, context, process, item) {
        const result = await globalThis.crs.process.getValue(step.args.source, context, process, item);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    static async get_on_path(step, context, process, item) {
        let result;
        if (step.args.paths != null) {
        }
        else {
            const path = await crs.process.getValue(step.args.path);
            const source = await crs.process.getValue(step.args.source);
            result = await getValueOnPath(source, path);
        }

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    /**
     * Delete the defined properties from a object
     * @returns {Promise<void>}
     */
    static async delete(step, context, process, item) {
        const object = await crs.process.getValue(step.args.target, context, process, item);

        if (object != null) {
            for (let property of step.args.properties || []) {
                delete object[property];
            }
        }
    }

    /**
     * Create object literal on target defined.
     * @param step
     * @param context
     * @param process
     * @param item
     * @returns {Promise<void>}
     */
    static async create(step, context, process, item) {
        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, {}, context, process, item);
        }
    }

    /**
     * Assign values from one object to another (injection)
     * @param step
     * @param context
     * @param process
     * @param item
     * @returns {Promise<void>}
     */
    static async assign(step, context, process, item) {
        const source = await crs.process.getValue(step.args.source, context, process, item);
        const target = await crs.process.getValue(step.args.target, context, process, item);
        return Object.assign(target, source);
    }

    /**
     * Create a new object and copy values from the source
     * @param step
     * @param context
     * @param process
     * @param item
     * @returns {Promise<Object>}
     */
    static async clone(step, context, process, item) {
        const source = await crs.process.getValue(step.args.source, context, process, item);

        if (step.args.fields == null) {
            const result = Object.assign({}, source);
            if (step.args.target != null) {
                await crs.process.setValue(step.args.target, result, context, process, item);
            }
            return result;
        }

        const result = {};

        for (let field of step.args.fields) {
            result[field] = source[field];
        }

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }
}

async function setValueOnPath(obj, path, value) {
    const parts = path.split(".").join("/").split("/");
    const property = parts[parts.length - 1];

    let target = obj;
    for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        const nextPart = parts[i + 1];
        const isArray = isNaN(nextPart) == false;

        if (isArray == true) {
            parts[i + 1] = Number(nextPart);
        }

        if (target[part] == null) {
            target[part] = isArray ? [] : {};
        }

        target = target[part];
    }

    target[property] = value;
}

async function getValueOnPath(obj, path) {
    const parts = path.split(".").join("/").split("/");
    const property = parts[parts.length - 1];

    let target = obj;

    for (let i = 0; i < parts.length - 1; i++) {
        if (target == null) {
            return null;
        }

        if (Array.isArray(target)) {
            target = target[Number(parts[i])];
        }
        else {
            target = target[parts[i]];
        }
    }

    if (target == null) return null;
    return target[property];
}
