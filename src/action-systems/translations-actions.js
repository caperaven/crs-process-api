/**
 * @class TranslationsActions - The actions for the translations action system.
 * @description It contains all the actions that can be performed on the translations object
 *
 * Features:
 * perform - The method that is called to perform the action.
 * add - Add the translations to the context
 * get - Get the translation for the given key and store it in the given target or return the value
 * delete - Delete the translation for the given key
 * translate_elements - Translate the parent element and it's children, using the given context
 * inflate - uses a translation string and format it using properties
 */
export class TranslationsActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * @method add - Add the translations to the context
     * @param step - The step object from the process definition.
     * @param context - The context of the current step.
     * @param process - the process object
     * @param item - The item that is being processed.
     *
     * @param step.args.context {string} - The context to add the translations to.
     * @param step.args.translations {object} - The {translations} to add.
     *
     * @return {Promise<void>}
     *
     * @example <caption>javascript example</caption>
     * await crs.call("translations", "add", {
     *     context: "myContext",
     *     translations: {
     *         "myKey": "myValue"
     *     }
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "translations",
     *     "action": "add",
     *     "args": {
     *          "context": "myContext",
     *          "translations": {
     *               "myKey": "myValue"
     *          }
     *     }
     * }
     */
    static async add(step, context, process, item) {
        const translations = await crs.process.getValue(step.args.translations, context, process, item);
        const ctx = await crs.process.getValue(step.args.context, context, process, item);
        await crsbinding.translations.add(translations, ctx);
    }

    /**
     * @method get - Get the translation for the given key and store it in the given target or return the value
     * @param step - The step object from the process definition.
     * @param context - The context of the current process.
     * @param process - The process that is currently running.
     * @param item - The item that is being processed.
     *
     * @param step.args.key {string} - The key to get the translation for.
     * @param [step.args.target = "$context.result"] {string} - The target to store the translation in.
     *
     * @returns The translation for the key.
     *
     * @example <caption>javascript example</caption>
     * const translation = await crs.call("translations", "get", {
     *      key: "myKey"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "translations",
     *     "action": "get",
     *     "args": {
     *          "key": "myKey",
     *          "target": "$context.translation"
     *     }
     * }
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
     * @method delete - Delete the translation for the specified context from the translation mechanism
     * @param step - the step object
     * @param context - The context of the translation.
     * @param process - the process object
     * @param item - the item that is being processed
     *
     * @param step.args.context {string} - The context to delete the translations for.
     *
     * @returns {Promise<void>}
     *
     * @example <caption>javascript example</caption>
     * await crs.call("translations", "delete", {
     *     context: "myContext"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "translations",
     *     "action": "delete",
     *     "args": {
     *          "context": "myContext"
     *     }
     * }
     */
    static async delete(step, context, process, item) {
        const ctx = await crs.process.getValue(step.args.context, context, process, item);
        await crsbinding.translations.delete(ctx);
    }

    /**
     * @method translate_elements - Translate the parent element and it's children,
     * @param step - The step object from the test case.
     * @param context - The context of the current step.
     * @param process - The process object that is currently running.
     * @param item - The item that is being processed.
     *
     * @param step.args.element {string} - The element to translate.
     *
     * @returns {Promise<void>}
     *
     * @example <caption>javascript example</caption>
     * const element = document.createElement("div");
     * await crs.call("translations", "translate_elements", {
     *    element
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "translations",
     *     "action": "translate_elements",
     *     "args": {
     *         "element": element
     *      }
     * }
     */
    static async translate_elements(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element);
        await crsbinding.translations.parseElement(element);
    }

    /**
     * @method inflate - uses a translation string and format it using properties
     * @description for example "${code} is valid" -> "A11 is valid" provided the parameters has a property called code
     * and with the value "A11"
     *
     * @param step - The step object
     * @param context - The context of the current process.
     * @param process - The process object
     * @param item - The item that is being processed.
     *
     * @param step.args.key {string}- The key to get the translation for.
     * @param step.args.parameters {object} - The {parameters} to use when formatting the translation.
     * @param [step.args.target = "$context.result"] {string} - The target to store the result in.
     *
     * @returns The result of the inflate function.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("translations", "inflate", {
     *     key: "myKey",
     *     parameters: {
     *         code: "A11"
     *     }
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "translations",
     *     "action": "inflate",
     *     "args": {
     *          "key": "myKey",
     *          "parameters": {
     *               "code": "A11"
     *           },
     *           "target": "$context.result"
     *      }
     * }
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