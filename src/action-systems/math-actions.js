export class MathActions {
    static async perform(step, context, process, item) {
        if (this[step.action] != null) {
            return await this[step.action](step, context, process, item);
        }
        else {
            return await this.do_math_api(step, context, process, item);
        }
    }

    static async add(step, context, process, item) {
        return await this.do_math(step, context, process, item, (value1, value2) => value1 + value2);
    }

    static async subtract(step, context, process, item) {
        return await this.do_math(step, context, process, item, (value1, value2) => value1 - value2);
    }

    static async multiply(step, context, process, item) {
        return await this.do_math(step, context, process, item, (value1, value2) => value1 * value2);
    }

    static async divide(step, context, process, item) {
        return await this.do_math(step, context, process, item, (value1, value2) => value1 / value2);
    }

    static async do_math(step, context, process, item, fn) {
        const value1 = await crs.process.getValue(step.args.value1, context, process, item);
        const value2 = await crs.process.getValue(step.args.value2, context, process, item);
        const result =  fn(value1, value2)

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    static async do_math_api(step, context, process, item) {
        const args = [];

        const params = Array.isArray(step.args.value) ? step.args.value : [step.args.value];
        for (let param of params) {
            const value = await crs.process.getValue(param, context, process, item);
            args.push(value);
        }

        const result = Math[step.action]?.(...args);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    static async normalize(step, context, process, item) {
        const value = await crs.process.getValue(step.args.value, context, process, item);
        const min = await crs.process.getValue(step.args.min, context, process, item);
        const max = await crs.process.getValue(step.args.max, context, process, item);
        const result = (value - min) / (max - min);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }
}

crs.intent.math = MathActions;