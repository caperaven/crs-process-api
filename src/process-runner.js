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

            crsbinding.idleTaskManager.add(async () => {
                await validateParameters(context, process, item).catch(error => reject(error));
                await this.runStep(process.steps.start, context, process, item);

                const result = process.result;
                await this.cleanProcess(process);
                resolve(result);
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
    static async runStep(step, context= null, process= null, item= null) {
        if (step == null) return;
        if (step.abort != null) throw new Error(`${process.currentStep}: ${step.abort}`);

        let result;
        if (step.type != null) {
            result = await crs.intent[step.type].perform(step, context, process, item);
        }

        if (step.args?.log != null) {
            const value = await this.getValue(step.args.log, context, process, item);
            console.log(value);
        }

        const nextStep = process?.steps?.[step.next_step];
        process.currentStep = nextStep;

        if (nextStep != null) {
            return await this.runStep(nextStep, context, process, item);
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

        if (expr == "$context") return context;
        if (expr == "$process") return process;
        if (expr == "$item") return item;

        if (expr.indexOf("$") == -1 && expr.indexOf("(") == -1) return expr;

        expr = process?.expCache == null ? expr : getFromCache(expr, process);

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
            throw new Error(`required parameter "${key}" not set or is null`);
        }
    }
}

function populatePrefixes(prefixes, process) {
    process.prefixes = process.prefixes || {};

    if (prefixes != null) {
        Object.assign(process.prefixes, prefixes);
    }

    process.prefixes["$text"] = "$process.text";
    process.prefixes["$data"] = "$process.data";
}

function getFromCache(expr, process) {
    if (process == null) return expr;

    if (process.expCache[expr] != null) {
        return process.expCache[expr];
    }

    const prop = expr;
    const exp = expr.split(".")[0];
    if (process?.prefixes[exp] == null) return expr;

    expr = expr.split(exp).join(process.prefixes[exp]);
    process.expCache[prop] = expr;
    return expr;
}