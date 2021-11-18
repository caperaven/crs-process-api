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
    static async sleep(step) {
        return new Promise(resolve => {
            let interval = setInterval(() => {
                clearInterval(interval);
                resolve();
            }, Number(step.args.duration || 0));
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

            const resume = () => {
                delete process.status;
                delete process.resume;
                delete bc?.resume;

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
}