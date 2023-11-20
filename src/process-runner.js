/**
 * Main entry for running processes
 */
export class ProcessRunner {
    /**
     * Run a entire process and all it's steps
     * @param context {Object} context object $context
     * @param process {Object} process object $process
     * @returns {Promise<Object>} returns the process.data object
     */
    static run(context, process, item, text, prefixes) {
        return new Promise(async (resolve, reject) => {
            process = JSON.parse(JSON.stringify(process));
            process.data = process.data || {};
            process.context = context;
            process.functions = {};
            process.text = text;
            process.expCache = {};

            populatePrefixes(prefixes, process);

            if (process.bindable == true) {
                if (crs.intent.binding == null) {
                    await crs.modules.get("binding");
                }

                await crs.intent.binding.create_context(null, context, process, null);
            }

            await crsbinding.events.emitter.emit("process-starting", process);

            crsbinding.idleTaskManager.add(async () => {
                let result;

                await validateParameters(context, process, item).catch(error => {
                    process.aborted = true;
                    reject({ process:process.name, step: process.currentStep, error: error });
                });

                await this.runStep(process.steps.start, context, process, item)
                    .then(async () => {
                        result = process.result;
                        await this.cleanProcess(process);
                    })
                    .then(() => resolve(result))
                    .catch(error => {
                        process.aborted = true;
                        reject({ process:process.name, step: process.currentStep, error: error })
                    })
            })
        })
    }

    /**
     * Run a process step definition.
     * Used internally and externally
     * @param step {Object} step definition
     * @param context {Object} context object $context
     * @param process {Object} process object $process
     * @param item {Object} items object $item
     * @returns {Promise<void>}
     */
    static async runStep(step, context= null, process= null, item= null, steps = null) {
        if (step == null) return;

        await setBinding("binding_before", step, context, process, item)

        let result;
        if (step.type != null) {
            if (crs.intent[step.type] == null) {
                await crs.modules.get(step.type);
            }

            result = await crs.intent[step.type].perform(step, context, process, item, steps);
        }

        if (step.args?.log != null) {
            const value = await this.getValue(step.args.log, context, process, item);
            console.log(value);
        }

        await setBinding("binding_after", step, context, process, item)

        if (process?.aborted !== true && step.aborted !== true) {
            steps ||= process?.steps;

            const nextStep = steps?.[step.alt_next_step || step.next_step];

            if (process != null) {
                process.currentStep = step.next_step;
            }

            if (nextStep != null) {
                return await this.runStep(nextStep, context, process, item, steps);
            }
        }

        return result;
    }

    /**
     * Utility function used to get objects and values on paths defined by process
     * @param expr {string} path expression
     * @param context {Object} context object $context
     * @param process {Object} process object $process
     * @param item {Object} items object $item
     * @returns {Promise<string|*>}
     */
    static async getValue(expr, context = null, process=  null, item = null) {
        if (typeof expr != "string") return expr;
        if (expr.indexOf("${") == 0) return expr;
        if (expr.indexOf("$template") != -1) return expr;

        if (expr == "$context") return context;
        if (expr == "$process") return process;
        if (expr == "$item") return item;

        if (expr.indexOf("$") == -1) return expr;

        if (expr.indexOf("$binding") != -1) {
            return crsbinding.data.getValue(process.parameters.bId, expr.replace("$binding.", ""));
        }

        if (expr.indexOf("$fn") != -1) {
            expr = expr.split("$fn").join("");
        }

        expr = process?.expCache == null ? expr : getFromCache(expr, process);

        if (expr.indexOf("rgb(") != -1) {
            return expr;
        }

        let fn = process?.functions?.[expr];
        if (fn == null) {
            const exp = expr.split("$").join("");
            fn = new Function("context", "process", "item", `return ${exp};`);

            if (process != null && process.functions != null) {
                process.functions[expr] = fn;
            }
        }

        return fn(context, process, item);
    }

    /**
     * Utility function to set the property of a object on a defined path
     * @param expr {string} path expression on what property to set
     * @param value {any} the value to set on the property
     * @param context {Object} obj to use if expr references $context
     * @param process {Object} obj to use if expr references $process
     * @param item {Object} obj to use if expr references $item
     * @returns {Promise<void>}
     */
    static async setValue(expr, value, context, process, item) {
        let ctx;

        expr = process?.expCache == null ? expr : getFromCache(expr, process);

        if (expr.indexOf("$binding") != -1) {
            const bId = process.parameters?.bId;
            const property = expr.split(".")[1];
            return crsbinding.data.setProperty(bId, property, value);
        }

        if (expr.indexOf("$item") != -1) {
            ctx = item;
            expr = expr.replace("$item.", "");
        }
        else if (expr.indexOf("$process") != -1) {
            ctx = process;
            expr = expr.replace("$process.", "");
        }
        else {
            ctx = context;
            expr = expr.replace("$context.", "");
        }

        let obj = ctx;

        if (expr.indexOf(".") == -1) {
            obj[expr] = await this.getValue(value, context, process, item);
        }
        else {
            const parts = expr.split(".");

            for (let i = 0; i < parts.length - 1; i++) {
                const part = parts[i];
                obj = obj[part] = obj[part] || {};
            }

            value = await this.getValue(value, context, process, item);
            obj[parts[parts.length -1]] = value;
        }
    }

    static async cleanProcess(process) {
        if (process.bindable == true) {
            crsbinding.data.removeObject(process.parameters.bId);
        }

        await this.cleanObject(process.data);
        await this.cleanObject(process.functions);
        delete process.context;
        delete process.functions;
        delete process.parameters;
        delete process.result;
        delete process.data;
        delete process.steps;
        delete process.text;
        delete process.prefixes;
        delete process.expCache;

        await crsbinding.events.emitter.emit("process-ended", process);
    }

    static async cleanObject(obj) {
        if (obj == null) return;
        const keys = Object.keys(obj);
        for (let key of keys) {
            delete obj[key];
        }
        return null;
    }
}

async function setBinding(name, step, context, process, item) {
    if (crs.intent.binding == null) {
        await crs.modules.get("binding");
    }

    const obj = step[name];
    if (obj == null || process.parameters?.bId == null) return;

    const keys = Object.keys(obj);
    for (let key of keys) {
        await crs.intent.binding.set_property({
            args: {
                property: key,
                value: obj[key]
            }
        }, context, process, item);
    }
}

/**
 * Check the processes required parameters, referring to parameters_def.
 * Concern: Is this process in a condition with all requirements set to be able to run.
 * @returns {Promise<void>}
 */
async function validateParameters(context, process,item) {
    if (process.parameters_def == null) return;

    process.parameters = process.parameters || {};

    let isValid = true;
    for (const [key, value] of Object.entries(process.parameters_def)) {
        if (value.required === true) {
            if (process.parameters[key] == null && value.default != null) {
                process.parameters[key] = await crs.process.getValue(value.default, context, process, item);
            }

            isValid = process.parameters[key] != null;
        }

        if (isValid === false) {
            process.aborted = true;
            process.currentStep = "validate process parameters";
            throw new Error(`required parameter "${key}" not set or is null`);
        }
    }
}

export function populatePrefixes(prefixes, process) {
    process.prefixes = process.prefixes || {};

    if (prefixes != null) {
        Object.assign(process.prefixes, prefixes);
    }

    process.prefixes["$text"]       = "$process.text";
    process.prefixes["$data"]       = "$process.data";
    process.prefixes["$parameters"] = "$process.parameters";
    process.prefixes["$bId"]        = "$process.parameters.bId";
    process.prefixes["$global"]     = "globalThis";
    process.prefixes["$translation"]= 'crsbinding.translations.get("$0")';
}

function getFromCache(expr, process) {
    if (process == null) return expr;

    if (process.expCache[expr] != null) {
        return process.expCache[expr];
    }

    const prop = expr;
    const parts = expr.split(".");
    const exp = parts[0];
    if (process?.prefixes[exp] == null) return expr;

    parts.splice(0, 1);
    const value = process.prefixes[exp];

    if (value.indexOf("$0") != -1) {
        const path = parts.join(".");
        expr = value.replace("$0", path);
    }
    else {
        expr = expr.split(exp).join(value);
    }

    process.expCache[prop] = expr;
    return expr;
}