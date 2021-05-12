export class ProcessRunner {
    static async run(context, process) {
        process = JSON.parse(JSON.stringify(process));
        process.context = context;
        process._disposables = [];
        await this.runStep(process.steps.start, context, process);
        await this.cleanProcess(process);
        return process.data;
    }

    static async runStep(step, context, process, item) {
        if (step == null) return;

        if (step.type != null) {
            await crs.intent[step.type].perform(step, context, process, item);
        }

        const nextStep = process?.steps?.[step.next_step];
        await this.runStep(nextStep, context, process, item);
    }

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
        let obj = expr.indexOf("@context") == 0 ? context : process;
        const parts = expr.replace("@context.", "").replace("@process.", "").replace("@item.", "").split(".");

        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            obj = obj[part] = obj[part] || {};
        }

        obj[parts[parts.length -1]] = await this.getValue(value, context, process, item);
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