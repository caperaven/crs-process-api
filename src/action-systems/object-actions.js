export class ObjectActions {
    static async perform(step, context, process, item) {
        return await this[step.action](step, context, process, item);
    }

    /**
     * It takes a list of properties and values, and sets the properties to the values
     * @param step - The step object from the process definition.
     * @param context - The context object that is passed to the process.
     * @param process - The process object
     * @param item - The item that is being processed.
     *
     * @param step.args.properties - The list of properties to set.
     * @param step.args.values - The list of values to set the properties to.
     * @param step.args.target - The target object to set the properties on.
     *
     * @returns {Promise<void>}
     *
     * @example <caption>javascript example</caption>
     * await crs.call("object", "set", {
     *      properties: ["$process.name", "$process.age"]
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "action": "object",
     *     "method": "set",
     *     "args": {
     *          "properties": ["$process.name", "$process.age"]
     *     }
     * }
     */
    static async set(step, context, process, item) {
        const properties = await crs.process.getValue(step.args.properties, context, process, item);

        const keys = Object.keys(properties);
        for (let property of keys) {
            const value = await crs.process.getValue(properties[property], context, process, item);
            property = formatProperty(property);
            await crs.process.setValue(property, value, context, process, item);
        }
    }

    /**
     * It takes a list of properties, gets the value of each property,
     * and returns the list of values
     * @param step - The step object that is being executed.
     * @param context - The context object that is passed to the process.
     * @param process - The process object
     * @param item - The item that is being processed.
     *
     * @param step.args.properties - The list of properties to get the values from.
     * @param step.args.target - The target object to set the properties on.*
     *
     * @returns {Promise<Array>} - The list of values.
     *
     * @example <caption>javascript example</caption>
     * const values = await crs.call("object", "get", {
     *      properties: ["$process.name", "$process.age"]
     *  }, context, process, item);
     *
     *  @example <caption>json example</caption>
     *  {
     *       "type": "object",
     *       "action": "get",
     *       "args": {
     *            "properties": ["$process.name", "$process.age"],
     *            "target": "$context.values"
     *        }
     *  }
     */
    static async get(step, context, process, item) {
        const properties = await crs.process.getValue(step.args.properties, context, process, item);
        const result = [];
        for (let property of properties) {
            property = formatProperty(property);
            const value = await crs.process.getValue(property, context, process, item);
            result.push(value);
        }

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    /**
     * > Delete the properties specified in the `properties` argument from the context,
     *  process, or item
     * @param step - The step object that is being executed.
     * @param context - The context object that is passed to the process.
     * @param process - The current process object
     * @param item - The item that is being processed.
     *
     * @param step.args.properties - The list of properties to delete.
     *
     * @returns {Promise<void>}
     *
     * @example <caption>javascript example</caption>
     * await crs.call("object", "delete", {
     *     properties: ["$process.name", "$process.age"]
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "object",
     *     "action": "delete",
     *     "args": {
     *         "properties": ["$process.name", "$process.age"]
     *      }
     * }
     */
    static async delete(step, context, process, item) {
        const properties = await crs.process.getValue(step.args.properties, context, process, item);

        for (let property of properties) {
            property = formatProperty(property);

            let target = context;

            if (property.indexOf("$process") != -1) {
                target = process;
            }

            if (property.indexOf("$item") != -1) {
                target = process;
            }

            await deleteOnPath(target, property);
        }
    }

    /**
     * Copy the value of the source object's property to the target object's property
     * @param step - the step object
     * @param context - The context object that is passed to the process.
     * @param process - the process object
     * @param item - The item that is being processed.
     *
     * @param step.args.source - The source object to copy the property from.
     * @param step.args.target - The target object to copy the property to.
     * @param step.args.properties - The property to copy.
     *
     * @returns {Promise<void>}
     *
     * @example <caption>javascript example</caption>
     * await crs.call("object", "copy_on_path", {
     *    source: "$context.obj1",
     *    target: "$context.obj2",
     *    properties: ["name", "age"]
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *       "type": "object",
     *       "action": "copy_on_path",
     *       "args": {
     *           "source":  "$context.obj1",
     *           "target":  "$context.obj2",
     *           "properties": ["name", "age"]
     *        }
     * }
     */
    static async copy_on_path(step, context, process, item) {
        const source = await crs.process.getValue(step.args.source, context, process, item);
        const target = await crs.process.getValue(step.args.target, context, process, item);
        const properties = await crs.process.getValue(step.args.properties, context, process, item);

        for (let property of properties) {
            property = property.split("/").join(".");
            await copyPath(source, target, property);
        }
    }

    /**
     * Create object literal on target defined.
     * @param step - The step object
     * @param context - The context object that is passed to the process.
     * @param process - The process object
     * @param item - The item that is being processed.
     *
     * @param step.args.target - The target object to store the new object.
     *
     * @returns {Promise<void>}
     *
     * @example <caption>javascript example</caption>
     * await crs.call("object", "create", {
     *    target: "$context.item",
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *      "type": "object",
     *      "action": "create",
     *      "args": {
     *           "target": "$context.item",
     *       }
     * }
     */
    static async create(step, context, process, item) {
        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, {}, context, process, item);
        }
    }

    /**
     * > Assigns the properties of one object to another (injection)
     * @param step - The step object from the process definition.
     * @param context - The context object that is passed to the process.
     * @param process - the process object
     * @param item - the current item being processed
     *
     * @param step.args.source - The source object to copy the properties from.
     * @param step.args.target - The target object to copy the properties to.
     *
     * @returns The target object with the source object properties added to it.
     *
     * @example <caption>javascript example</caption>
     *  const obj = await crs.call("object", "assign", {
     *     source: "$context.obj1",
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *      "type": "object",
     *      "action": "assign",
     *      "args": {
     *          "source": "$context.obj1",
     *          "target": "$context.obj2"
     *      }
     * }
     */
    static async assign(step, context, process, item) {
        const source = await crs.process.getValue(step.args.source, context, process, item);
        const target = await crs.process.getValue(step.args.target, context, process, item);
        return Object.assign(target, source);
    }

    /**
     * Create a new object and copy values from the source and target
     * @param step - The step object.
     * @param context - The context object that is passed to the process.
     * @param process - The process object
     * @param item - The item that is being processed.
     *
     * @param step.args.source - The source object to clone.
     * @param step.args.properties - The properties to clone.
     * @param step.args.target - The target object to copy the properties to.
     *
     * @returns The result of the clone operation.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("object", "clone", {
     *    source: "$context.obj1",
     *    properties: ["name", "age"]
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *    "type": "object",
     *    "action": "clone",
     *    "args": {
     *        "source": "$context.obj1",
     *        "properties": ["name", "age"],
     *        "target": "$context.result"
     *     }
     * }
     */
    static async clone(step, context, process, item) {
        const source = await crs.process.getValue(step.args.source, context, process, item);
        const properties = await crs.process.getValue(step.args.properties, context, process, item);

        if (properties == null) {
            const result = Object.assign({}, source);
            if (step.args.target != null) {
                await crs.process.setValue(step.args.target, result, context, process, item);
            }
            return result;
        }

        const result = {};

        for (let property of properties) {
            result[property] = source[property];
        }

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    /**
     * It takes a JavaScript object, converts it to a JSON string,
     * then converts it back to a JavaScript object
     * @param step - The step object from the process definition.
     * @param context - The context object that is passed to the process.
     * @param process - The process object
     * @param item - The item that is being processed.
     *
     * @param step.args.source - The source object to clone.
     * @param step.args.target - The target object to store the result.
     *
     * @returns The newValue is being returned.
     *
     * @example <caption>javascript example</caption>
     * const newValue =  await crs.call("object", "clone", {
     *     source: "$context.obj1",
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *    "type": "object",
     *    "action": "clone",
     *     "args": {
     *         "source": "$context.obj1",
     *         "target": "$context.result"
     *     }
     * }
     */
    static async json_clone(step, context, process, item) {
        const source = await crs.process.getValue(step.args.source, context, process, item);
        const json = JSON.stringify(source);
        const newValue = JSON.parse(json);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, newValue, context, process, item);
        }

        return newValue;
    }

    /**
     * It takes a source object, and a list of property paths,
     * and returns true if all of the properties exist on the source object
     * @param step - The step object that is being executed.
     * @param context - The context object that is passed to the process.
     * @param process - The process object
     * @param item - The item that is being processed.
     *
     * @param step.args.source - The source object to clone.
     * @param step.args.properties - The properties to check.
     * @param step.args.target - The target object to store the result.
     *
     * @returns A boolean value.
     *
     * @example <caption>javascript example</caption>
     * const isValid = await crs.call("object", "assert", {
     *    source: "$context.obj1",
     *    properties: ["path", "path"]
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "object",
     *     "action": "assert",
     *     "args": {
     *         "source": "$context.obj1",
     *         "properties": ["path", "path"],
     *         "target": "$context.result"
     *      }
     * }
     */
    static async assert(step, context, process, item) {
        let isValid = true;

        const source = await crs.process.getValue(step.args.source, context, process, item);

        if (source == null) return false;

        const paths = await crs.process.getValue(step.args.properties, context, process, item);

        for (const path of paths) {
            const value = await getValueOnPath(source, path);

            if (value == null) {
                isValid = false;
                break;
            }
        }

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, isValid, context, process, item);
        }

        return isValid;
    }
}

/**
 * It takes a property name and returns a JavaScript expression that evaluates to the value of that property
 * @param property - The property to be formatted.
 * @returns a string that is the property name with the $context. prefix added.
 */
function formatProperty(property) {
    if (property.indexOf("$") == -1) {
        property = `$context.${property}`
    }
    return property.split("/").join(".");
}

/**
 * It takes an object, a path, and a value, and sets the value on the object at the path
 * @param obj - The object to set the value on.
 * @param path - The path to the property you want to set.
 * @param value - The value to set on the path.
 */
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

/**
 * It takes an object and a path, and returns the value at the end of the path
 * @param obj - The object to get the value from.
 * @param path - The path to the property you want to get.
 * @returns The value of the property at the end of the path.
 */
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

/**
 * It takes an object and a path, and deletes the property at the end of the path
 * @param obj - The object to delete the property from.
 * @param path - The path to the property to delete.
 * @returns the value of the property at the end of the path.
 */
async function deleteOnPath(obj, path) {
    if (obj == null) return;
    const parts = path.split("$context.").join("").split(".").join("/").split("/");
    let target = obj;

    const collection = [obj];
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        if (target[part] == null) return;

        target = target[part];
        collection.push(target);
    }

    const index = parts.length -1;
    const property = parts[index];
    target = collection[index];

    if (Array.isArray(target)) {
        target.splice(Number(property), 1);
    }
    else {
        delete target[property];
    }
}

/**
 * It copies the value of a path from one object to another
 * @param source - The source object to copy from
 * @param target - The target object to copy the value to.
 * @param path - The path to the value you want to copy.
 * @returns A function that takes three arguments: source, target, and path.
 */
async function copyPath(source, target, path) {
    const value = await getValueOnPath(source, path);

    if (value == null) return;

    const newValue = await crs.call("object", "json_clone", {
        source: value
    })

    await setValueOnPath(target, path, newValue);
}

crs.intent.object = ObjectActions;