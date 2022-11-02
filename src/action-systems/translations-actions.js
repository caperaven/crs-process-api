export class TranslationsActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * Add translations to the translation mechanism
     * @returns {Promise<void>}
     */
    static async add(step, context, process, item) {
        const translations = await crs.process.getValue(step.args.translations, context, process, item);
        const ctx = await crs.process.getValue(step.args.context, context, process, item);
        await crsbinding.translations.add(translations, ctx);
    }

    /**
     * Get a translation value and copy it to the target or return the value
     * @returns {Promise<void>}
     */
    static async get(step, context, process, item) {
        let key = await crs.process.getValue(step.args.key, context, process, item);
        key = key.split("/").join(".");
        let result = await crsbinding.translations.get(key);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    /**
     * Clear all translation values from the translation mechanism
     * @returns {Promise<void>}
     */
    static async delete(step, context, process, item) {
        const ctx = await crs.process.getValue(step.args.context, context, process, item);
        await crsbinding.translations.delete(ctx);
    }

    /**
     * translate a parent element and it's children
     * @returns {Promise<void>}
     */
    static async translate_elements(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element);
        await crsbinding.translations.parseElement(element);
    }

    /**
     * use a translation string and format it using properties
     * For example "${code} is valid" -> "A11 is valid" provided the parameters has a property called code and with the value "A11"
     * @returns {Promise<void>}
     */
    static async inflate(step, context, process, item) {
        const key = await crs.process.getValue(step.args.key, context, process, item);
        const parameters = await crs.process.getValue(step.args.parameters, context, process, item);
        let string = await crsbinding.translations.get(key);

        let result = await crs.call("string", "inflate", {
            template: string,
            parameters: parameters
        }, context, process, item);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }
}

crs.intent.translations = TranslationsActions;