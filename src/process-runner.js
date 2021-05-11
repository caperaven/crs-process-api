export class ProcessRunner {
    static async run(context, process) {
        // 1. Make a copy of the process
        process = JSON.parse(JSON.stringify(process));
        process.context = context;
        await this.runStep(process.steps.start);
        delete process.context;
        return process.data;
    }

    static async runStep(step, context, process) {
        if (step == null) return;

        crs.intent[step.type].perform(step, context, process);
        const nextStep = process.steps[step.next_step];
        await this.runStep(nextStep, context, process);
    }

    static async getValue(expr, context, process) {
        if (typeof expr != "string") return expr;
        if (expr == "@item" || expr == "@context") return context;

        if (expr.indexOf("@context") == 0) {
            return crsbinding.utils.getValueOnPath(context, expr.replace("@context.", ""));
        }

        if (expr.indexOf("@process") == 0) {
            return crsbinding.utils.getValueOnPath(process, expr.replace("@process.", ""));
        }

        return expr;
    }

    static async setValue(expr, value, context, process) {
        let obj = expr.indexOf("@context") == 0 ? context : process;
        const parts = expr.replace("@context.", "").replace("@process.", "").split(".");

        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            obj = obj[part] = obj[part] || {};
        }

        obj[parts[parts.length -1]] = await this.getValue(value, context, process);
    }
}