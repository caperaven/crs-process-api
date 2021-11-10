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
}