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

        if (step.type != null) {
            await crs.intent[step.type].perform(step, context, process, item);
        }

        const nextStep = process?.steps?.[step.next_step];
        await this.runStep(nextStep, context, process, item);
    }

    /**
     * Utility function used to get objects and values on paths defined by process
     * @param expr {string} path expression
     * @param context {Object} context object @context
     * @param process {Object} process object @process
     * @param item {Object} items object @item
     * @returns {Promise<string|*>}
     */
    static async getValue(expr, context, process, item) {
        if (typeof expr != "string") return expr;
        if (expr == "@context") return context;
        if (expr == "@process") return process;
        if (expr == "@item") return item;

        if (expr.indexOf("@context") == 0) {
            return crsbinding.utils.getValueOnPath(context, expr.replace("@context.", ""));
        }

        if (expr.indexOf("@process") == 0) {
            return crsbinding.utils.getValueOnPath(process, expr.replace("@process.", ""));
        }

        if (expr.indexOf("@item") == 0) {
            return crsbinding.utils.getValueOnPath(item, expr.replace("@item.", ""));
        }

        return expr;
    }

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