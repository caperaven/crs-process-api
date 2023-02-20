/**
 * @class SystemActions - The system actions are used to perform system functions.
 * @description This class contains functions that are used to perform system actions.
 *
 * Features:
 * -perform - The perform function is used to call the action function.
 * -copy_to_clipboard - Copy the value of the source to the clipboard.
 * -sleep - Sleep function used for testing to emulate network traffic delay.
 * -pause - Pause the process for the specified duration.
 * -resume - Resume the process after a pause.
 * -abort - Abort the process.
 * -ismobile - Check if the current device is a mobile device.
 * -is_portrait - Check if the current device is in portrait mode.
 * -is_landscape - Check if the current device is in landscape mode.
 */
export class SystemActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * @method copy_to_clipboard - Copy the value of the source to the clipboard
     * @param step {object} - The step object from the process definition.
     * @param context {object} - The context object that is passed to the process.
     * @param process {object} - the process object
     * @param item {object} - The current item being processed.
     *
     * @param step.args.source {string} - The source to copy to the clipboard.
     *
     * @returns {Promise<void>}
     *
     * @example <caption>javascript example</caption>
     * await crs.call("system", "copy_to_clipboard", {
     *     source: "value"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "action": "copy_to_clipboard",
     *     "args": {
     *         "source": "$context.value"
     *      }
     * }
     */
    static async copy_to_clipboard(step, context, process, item) {
        let value = await crs.process.getValue(step.args.source, context, process, item);
        let str = JSON.stringify(value);
        navigator.clipboard.writeText(str);
    }

    /**
     * @method sleep - Sleep function used for testing to emulate network traffic delay
     * @param step {object} - The step object from the process definition
     * @param context {object} - The context object that is passed to the process.
     * @param process {object} - The process object
     * @param item {object} - The item that is being processed.
     *
     * @param step.args.duration {number} - The duration to sleep in milliseconds.
     *
     * @returns A promise that resolves after the duration has passed.
     *
     * @example <caption>javascript example</caption>
     * await crs.call("system", "sleep", {
     *    duration: 1000
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "system",
     *     "action": "sleep",
     *     "args": {
     *         "duration": 1000
     *     }
     * }
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
     * @method pause - The function pauses the process and waits for the user to resume the process
     * @param step {object} - the current step in the process.
     * @param context {object} - the context of the process.
     * @param process {object} - The process object that is being run.
     *
     * @returns A promise.
     *
     * @example <caption>javascript example</caption>
     * await crs.call("system", "pause", {}, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *      "type": "system",
     *      "action": "pause"
     * }
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
     * @method resume - Resume the process if it is waiting.
     * @param step {object} - The step object that is being executed.
     * @param context {object} - The context object that was passed to the process when it was started.
     * @param process {object} - The process object that was created when the process was started.
     * @param item {object} - The item that is being processed.
     *
     * @returns A promise that resolves immediately.
     *
     * @example <caption>javascript example</caption>
     * await crs.call("system", "resume", {}, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "system",
     *     "action": "resume"
     *  }
     */
    static async resume(step, context, process, item) {
        process.resume?.();
    }

    /**
     * @method abort - It throws an error
     * @param step {object} - The step object from the process definition.
     * @param context {object} - The context object that is passed to the process.
     * @param process {object} - The process object
     * @param item {object} - The item that is being processed.
     *
     * @param step.args.error {string} - The message to display in the error.
     *
     * @returns A promise that is rejected.
     *
     * @example <caption>javascript example</caption>
     * await crs.call("system", "abort", {
     *    error: "Something went really wrong"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "system",
     *     "action": "abort",
     *     "args": {
     *         "error": "Something went really wrong"
     *     }
     * }
     */
    static async abort(step, context, process, item) {
        const error = await crs.process.getValue(step.args.error, context, process, item);
        throw new Error(error);
    }

    /**
     * @method is_mobile - If the user agent string contains the word "Mobi", then return true
     * @param step {object} - The current step in the process
     * @param context {object} - The context object that is passed to the step.
     * @param process {object} - the process object
     * @param item {object} - the item that is being processed
     *
     * @param [step.args.target = "$context.result"] {string} - The target to set the result to.
     *
     * @returns A boolean value.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("system", "is_mobile", {}, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "system",
     *     "action": "is_mobile",
     *     "args": {
     *         "target": "$context.result"
     *     }
     * }
     */
    static async is_mobile(step, context, process, item) {
        return /Mobi/.test(navigator.userAgent);
    }

    /**
     * @method is_portrait - If the device is in portrait mode, return true, otherwise return false
     * @param step {object} - The step object
     * @param context {object} - The context of the current step.
     * @param process {object} - The process object
     * @param item {object} - The current item being processed.
     *
     * @param [step.args.target = "$context.result"] {string} - The target to set the result to.
     *
     * @returns The result of the matchMedia function.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("system", "is_portrait", {}, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "system",
     *     "action": "is_portrait",
     *     "args": {
     *         "target": "$context.result"
     *      }
     * }
     */
    static async is_portrait(step, context, process, item) {
        let result = window.matchMedia("(orientation: portrait)").matches;

        if (step?.args?.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    /**
     * @method is_landscape - If the device is in landscape mode, return true, otherwise return false
     * @param step {object} - The step object
     * @param context {object} - The context of the current step.
     * @param process {object} - The process object
     * @param item {object} - The item that is being processed.
     *
     * @param [step.args.target = "$context.result"] {string} - The target to set the result to.
     *
     * @returns The result of the matchMedia function.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("system", "is_landscape", {}, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *      "type": "system",
     *      "action": "is_landscape",
     *      "args": {
     *          "target": "$context.result"
     *      }
     * }
     */
    static async is_landscape(step, context, process, item) {
        let result = window.matchMedia("(orientation: landscape)").matches

        if (step?.args?.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }
}

crs.intent.system = SystemActions;