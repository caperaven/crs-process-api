export class RestServicesAction {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    static async get(step, context, process, item) {
        let request = step.args.request || {
            cache: "default",
            method: "GET",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json'
            }
        }

        let result = await fetch(step.args.url, request).then(result => result.json());

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    static async post(step, context, process, item) {

    }

    static async put(step, context, process, item) {

    }

    static async patch(step, context, process, item) {
        let request = step.args.request || {
            body: step.args.body,
            cache: "default",
            method: "PATCH",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json'
            }
        }

        let result = await fetch(step.args.url, request).then(result => result.json());

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    static async delete(step, context, process, item) {

    }
}