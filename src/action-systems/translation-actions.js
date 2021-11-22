export class SystemActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * Add translations to the translation mechanism
     * @returns {Promise<void>}
     */
    static async add_translations(step, context, process, item) {

    }

    /**
     * Get a translation value and copy it to the target or return the value
     * @returns {Promise<void>}
     */
    static async get_translation(step, context, process, item) {

    }

    /**
     * Clear all translation values from the translation mechanism
     * @returns {Promise<void>}
     */
    static async clear_translations(step, context, process, item) {

    }

    // ....
}