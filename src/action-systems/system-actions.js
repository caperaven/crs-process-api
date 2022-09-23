export class SystemActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * copy objects or values to clipboard
     * @returns {Promise<void>}
     */
    static async copy_to_clipboard(step, context, process, item) {
        let value = await crs.process.getValue(step.args.source, context, process, item);
        let str = JSON.stringify(value);
        navigator.clipboard.writeText(str);
    }

    /**
     * Sleep function used for testing to emulate network traffic delay
     * @returns {Promise<void>}
     */
    static async sleep(step, context, process, item) {
        return new Promise(async resolve => {
            const duration = await crs.process.getValue(step.args.duration, context, process, item);
            let interval = setInterval(() => {
                clearInterval(interval);
                resolve();
            }, Number(duration || 0));
        })
    }

    /**
     * Wait here until I tell you to resume
     * @returns {Promise<unknown>}
     */
    static async pause(step, context, process) {
        return new Promise(resolve => {
            process.status = "wait";

            let bc;

            const resume = (nextStep) => {
                // 1. does this process have a post process.
                // 2. run the post process and only resolve if the post process runs successfully.

                delete process.status;
                delete process.resume;
                delete bc?.resume;

                if (typeof nextStep != "object") {
                    step.alt_next_step = nextStep;
                }

                resolve();
            }

            if (process.parameters?.bId != null) {
                bc = crsbinding.data.getContext(process.parameters.bId);
                bc.resume = resume;
            }

            process.resume = resume;
        })
    }

    /**
     * If we are waiting then resume the process.
     * @returns {Promise<void>}
     */
    static async resume(step, context, process, item) {
        process.resume?.();
    }

    static async abort(step, context, process, item) {
        const error = await crs.process.getValue(step.args.error, context, process, item);
        throw new Error(error);
    }

    static async is_mobile(step, context, process, item) {
        return /Mobi/.test(navigator.userAgent);
    }

    static async is_portrait(step, context, process, item) {
        let result = window.matchMedia("(orientation: portrait)").matches;

        if (step?.args?.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    static async is_landscape(step, context, process, item) {
        let result = window.matchMedia("(orientation: landscape)").matches

        if (step?.args?.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }
}

crs.intent.system = SystemActions;