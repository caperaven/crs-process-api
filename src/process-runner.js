/**
 * Main entry for running processes
 */
export class ProcessRunner {
    /**
     * Run a entire process and all it's steps
     * @param context {Object} context object @context
     * @param process {Object} process object @process
     * @returns {Promise<Object>} returns the process.data object
     */
    static async run(context, process, item) {
        process = JSON.parse(JSON.stringify(process));
        process.data = process.data || {};
        process.context = context;

        await validateParameters(context, process, item);
        await this.runStep(process.steps.start, context, process, item);

        const result = process.result;
        await this.cleanProcess(process);
        return result;
    }

    /**
     * Run a process step definition.
     * Used internally and externally
     * @param step {Object} step definition
     * @param context {Object} context object @context
     * @param process {Object} process object @process
     * @param item {Object} items object @item
     * @returns {Promise<void>}
     */
    static async runStep(step, context= null, process= null, item= null) {
        if (step == null) return;
        if (step.abort != null) throw new Error(step.abort);

        let result;
        if (step.type != null) {
            result = await crs.intent[step.type].perform(step, context, process, item);
        }

        const nextStep = process?.steps?.[step.next_step];

        if (nextStep != null) {
            return await this.runStep(nextStep, context, process, item);
        }

        return result;
    }

    /**
     * Utility function used to get objects and values on paths defined by process
     * @param expr {string} path expression
     * @param context {Object} context object @context
     * @param process {Object} process object @process
     * @param item {Object} items object @item
     * @returns {Promise<string|*>}
     */
    static async getValue(expr, context = null, process=  null, item = null) {
        if (typeof expr != "string") return expr;
        //if (expr.indexOf("(") != -1) return expr;

        if (expr == "@context") return context;
        if (expr == "@process") return process;
        if (expr == "@item") return item;

        if (expr.indexOf("@") == -1 && expr.indexOf("(") == -1) return expr;

        const exp = expr.split("@").join("");
        const fn = new Function("context", "process", "item", `return ${exp};`);
        return fn(context, process, item);
    }

    /**
     * Utility function to set the property of a object on a defined path
     * @param expr {string} path expression on what property to set
     * @param value {any} the value to set on the property
     * @param context {Object} obj to use if expr references @context
     * @param process {Object} obj to use if expr references @process
     * @param item {Object} obj to use if expr references @item
     * @returns {Promise<void>}
     */
    static async setValue(expr, value, context, process, item) {
        let ctx;
        if (expr.indexOf("@item") != -1) {
            ctx = item;
            expr = expr.replace("@item.", "");
        }
        else if (expr.indexOf("@process") != -1) {
            ctx = process;
            expr = expr.replace("@process.", "");
        }
        else {
            ctx = context;
            expr = expr.replace("@context.", "");
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
        delete process.context;
        delete process.parameters;
        delete process.result;
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