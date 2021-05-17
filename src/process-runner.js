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
    static async run(context, process) {
        process = JSON.parse(JSON.stringify(process));
        process.data = process.data || {};
        process.context = context;
        process._disposables = [];
        await this.runStep(process.steps.start, context, process);
        await this.cleanProcess(process);
        return process.data;
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

            obj[parts[parts.length -1]] = await this.getValue(value, context, process, item);
        }
    }

    static async cleanProcess(process) {
        delete process.context;

        for (let disposable of process._disposables) {
            if (Array.isArray(disposable)){
                for (let item of disposable) {
                    item.dispose?.();
                }
                disposable.length = 0;
            }

            disposable.dispose?.();
        }
    }
}