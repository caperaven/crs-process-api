export class CompileActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    static async if_value(step, context, process, item) {
        // "value == 10 ? true : false"
        const code = [];
        let exp = await crs.process.getValue(step.args.exp, context, process, item);
        exp = await crsbinding.expression.sanitize(exp).expression;

        const parts = exp.split("?").map(item => item.trim());
        const left = parts[0];
        const right = parts[1];
        const rightParts = right.split(":");

        code.push(`if (${left}) {`);
        code.push(`    return ${rightParts[0].trim()};`);
        code.push('}');

        if (rightParts.length > 1) {
            code.push("else {");
            code.push(`    return ${rightParts[1].trim()};`);
            code.push("}");
        }

        const fn = new Function("context", code.join("\n"));

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, fn, context, process, item);
        }

        return fn;
    }

    static async case_value(step, context, process, item) {
        // "age <= 10: 'red', age <= 20: 'blue', default: 'green'"
        const code = [];
        let exp = await crs.process.getValue(step.args.exp, context, process, item);
        exp = await crsbinding.expression.sanitize(exp).expression;

        const parts = exp.split(",");

        for (let part of parts) {
            const expParts = part.split(":").map(item => item.trim());

            if (expParts[0] == "context.default") {
                code.push(`return ${expParts[1]};`)
            }
            else {
                code.push(`if (${expParts[0]}) {`)
                code.push(`    return ${expParts[1]};`)
                code.push('}')
            }
        }

        const fn = new Function("context", code.join("\n"));

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, fn, context, process, item);
        }

        return fn;
    }
}

crs.intent.compile = CompileActions;