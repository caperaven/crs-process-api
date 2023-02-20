/**
 * @class StringActions - A collection of actions that can be performed on strings.
 * @description This class contains a collection of actions that can be performed on strings.
 *
 * Features:
 * -perform - The main entry point for the class. This method will call the action method that is specified in the step.
 * -inflate - Inflate a string by replacing the string literal markers with the actual value.
 * -translate - Translate a string by replacing all occurrences of `&{...}` with the value of the corresponding variable
 * -to_array - Convert a string to an array.
 * -from_array - Convert an array to a string.
 * -replace - Replace all occurrences of a string with another string.
 * -get_query_string - Get the query string from a url.
 * -template - It takes a template string, replaces all the `__key__` values with the values from the `options` object, and then
 * -returns the resulting string.
 * -slice - Slice a string.
 */
export class StringActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }


    /**
     * @method inflate - Given this format, inflate a string and replace the string literal markers with the actual value.
     * @examples.
     *      "#input/${id}?type='tasks'&typeId='${typeId}'"
     *      "${firstName} ${lastName} = ${age} old"
     *
     * @param step {object} - The step object
     * @param context {object} - The context object that is passed to the process.
     * @param process {object} - The process object
     * @param item {object} - The item that is being processed.
     *
     * @param step.args.template {string} - The template to inflate.
     * @param [step.args.parameters] {object} - The {parameters} to use to inflate the template.
     * @param [step.args.target = "$context.result"] {string} - The target to store the result in.
     *
     * @returns The result of the inflate_string function.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("string", "inflate", {
     *      template: "<icon>gear</icon> <bold>[${code}]</bold> ${description}",
     *      parameters: {
     *          code: "A11",
     *          description: "This is a description"
     *      }
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *      "type": "string",
     *      "action": "inflate",
     *      "args": {
     *            "template": "<icon>gear</icon> <bold>[${code}]</bold> ${description}",
     *            "parameters": {
     *                  "code": "A11",
     *                  "description": "This is a description"
     *            },
     *            "target": "$context.result"
     *       }
     * }
     */
    static async inflate (step, context, process, item) {
        if (step.args.parameters == null) {
            return step.args.template;
        }

        let template = step.args.template;
        let parameters = step.args.parameters;

        let result = await inflate_string(template, parameters, context, process, item);

        if (result.indexOf("&{") != -1) {
            result = translate_string(result);
        }

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    /**
     * @method translate - Translate a string by replacing all occurrences of `&{...}` with the value of the corresponding variable
     * @param step {object} - The step object from the process definition.
     * @param context {object} - The context object that is passed to the process.
     * @param process {object} - The process object
     * @param item {object} - The item that is being processed.
     *
     * @param step.args.template {string} - The template to translate.
     * @param [step.args.target = "$context.result"] {string} - The target to store the result in.
     *
     * @returns The result of the translation.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("string", "translate", {
     *      template: "Hello &{firstName} &{lastName}"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *      "type": "string",
     *      "action": "translate",
     *      "args": {
     *           "template": "Hello &{firstName} &{lastName}",
     *           "target": "$context.result"
     *      }
     * }
     */
    static async translate(step, context, process, item) {
        const template = await crs.process.getValue(step.args.template, context, process, item);

        let result = template;

        if (result.indexOf("&{") != -1) {
            result = translate_string(result);
        }

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    /**
     * @method to_array - Split a string into an array of strings using a regular expression
     * @param step {object} - The step object
     * @param context {object} - The context object that is passed to the process.
     * @param process {object} - the process object
     * @param item {object} - The item that is being processed.
     *
     * @param step.args.source {string} - The string to split.
     * @param step.args.pattern {string} - The pattern to split the string on.
     * @param [step.args.target = "$context.result"] {string} - The target to store the result in.
     *
     * @returns The result of the split operation.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("string", "to_array", {
     *      source: "a,b,c,d,e",
     *      pattern: ","
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *      "type": "string",
     *      "action": "to_array",
     *      "args": {
     *           "source": "$context.value",
     *           "pattern": ",",
     *           "target": "$context.result"
     *      }
     * }
     */
    static async to_array(step, context, process, item) {
        let str = await crs.process.getValue(step.args.source, context, process, item);
        let result = str.split(step.args.pattern);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    /**
     * @method from_array - It takes an array, joins it together with a separator, and stores the result in a variable
     * @param step {object} - The step object
     * @param context {object} - The context object that is passed to the process.
     * @param process {object} - the process object
     * @param item {object} - The item that is being processed.
     *
     * @param step.args.source {string} - The array to join.
     * @param [step.args.separator] {string} - The separator to use when joining the array.
     * @param [step.args.target = "$context.result"] {string} - The target to store the result in.
     *
     * @returns The result of the join operation.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("string", "from_array", {
     *      source: "$context.value",
     *      separator: ","
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *      "type": "string",
     *      "action": "from_array",
     *      "args": {
     *          "source": "$context.value",
     *          "separator": ",",
     *          "target": "$context.result"
     *       }
     * }
     */
    static async from_array(step, context, process, item) {
        let array = await crs.process.getValue(step.args.source, context, process, item);
        let separator = step.args.separator || "";
        let result = array.join(separator);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    /**
     * @method replace - It takes a string, splits it into an array of strings, joins the array of strings back together,
     * and returns the result
     * @param step {object} - The step object from the process definition.
     * @param context {object} - The context object that is passed to the process.
     * @param process {object} - The process object
     * @param item {object} - The item that is being processed.
     *
     * @param step.args.source {string} - The string to replace.
     * @param step.args.pattern {string} - The pattern to replace.
     * @param step.args.value {string} - The value to replace the pattern with.
     * @param [step.args.target = "$context.result"] {string} - The target to store the result in.
     *
     * @returns The result of the replace function.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("string", "replace", {
     *     source: "source",
     *     pattern: ",",
     *     value: "|"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *      "type": "string",
     *      "action": "replace",
     *      "args": {
     *           "source": "$context.source",
     *           "pattern": ",",
     *           "value": "|",
     *           "target": "$context.result"
     *      }
     * }
     */
    static async replace(step, context, process, item) {
        let str = await crs.process.getValue(step.args.source, context, process, item);
        const pattern = await crs.process.getValue(step.args.pattern, context, process, item);
        const value = await crs.process.getValue(step.args.value, context, process, item);
        let result = str.split(pattern).join(value);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    /**
     * @method get_query_string - It takes a URL query string and returns an object with the key/value pairs
     * @param step {object} - The step object from the process definition.
     * @param context {object} - The context object that is passed to the process.
     * @param process {object} - The process object
     * @param item {object} - The item that is being processed.
     *
     * @param step.args.source {string} - The URL query string to parse.
     * @param [step.args.complex_parameters] {string|[]} - An array of parameters that have complex values.
     * @param [step.args.target = "$context.result"] {string} - The target to store the result in.
     *
     *
     * @returns The result of the query string.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("string", "get_query_string", {
     *       source: "https://www.example.com?param1=value1&param2=value2&param3=value3",
     *       complex_parameters: ["param1", "param2"]
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *      "type": "string",
     *      "action": "get_query_string",
     *      "args": {
     *           "source": "https://www.example.com?param1=value1&param2=value2&param3=value3",
     *           "complex_parameters": ["param1", "param2"],
     *           "target": "$context.result"
     *       }
     * }
     */
    static async get_query_string(step, context, process, item) {
        const str = await crs.process.getValue(step.args.source, context, process, item);
        const complex_parameters = await crs.process.getValue(step.args.complex_parameters, context, process, item);
        if ((str || '').trim() === '') return;

        let result;
        const queryStr = str.includes("?") ? str.split("?")[1] : str;
        const searchParams = new URLSearchParams(queryStr);
        for (const [key, value] of searchParams) {
            if ((key || '').trim() === '' || (value || '').trim() === '') continue;

            if ((complex_parameters || []).includes(key)) {
                const nestedParamPairs = value.split(";");
                for (const nestedParamPair of nestedParamPairs) {
                    const nestedParamResult = await this.get_query_string({args: {source: nestedParamPair}});
                    if (nestedParamResult != null) {
                        result = result || {};
                        result[key] = result[key] || {};
                        Object.assign(result[key], nestedParamResult);
                    }
                }
                continue;
            }

            result = result || {};
            result[key] = value;
        }

        if (step.args.target != null && result != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    /**
     * @method template - It takes a template string, replaces all the `__key__` values with the values from the `options` object, and then
     * returns the result
     * @param step {object} - The step object
     * @param context {object} - The context object that is passed to the process.
     * @param process {object} - The process object
     * @param item {object} - The item that is being processed.
     *
     * @param step.args.template {string} - The template string.
     * @param step.args.options {object} - The options object.
     * @param [step.args.target = "$context.result"] {string} - The target to store the result in.
     *
     * @returns The template with the options replaced.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("string", "template", {
     *      template: ""<li>__button__ __property__ __chevron__</li>"",
     *      options: {
     *           button: "",
     *           property: "<div>${title}</div>",
     *           chevron: "<svg><use href='#chevron'></use></svg>"
     *      }
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *      "type": "string",
     *      "action": "template",
     *      "args": {
     *           "template": ""<li>__button__ __property__ __chevron__</li>"",
     *           "options": {
     *                "button": "",
     *                "property": "<div>${title}</div>",
     *                "chevron": "<svg><use href='#chevron'></use></svg>"
     *            },
     *            "target": "$context.result"
     *        }
     * }
     */
    static async template(step, context, process, item) {
        let template = await crs.process.getValue(step.args.template, context, process, item);
        const options = await crs.process.getValue(step.args.options, context, process, item);

        for (const key of Object.keys(options)) {
            template = template.replaceAll(`__${key}__`, options[key]);
        }

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, template, context, process, item);
        }

        return template;
    }

    /**
     * @method slice - Slice a string and return the result
     * @param step {object} - The step object that is being executed.
     * @param context {object} - The context object that is passed to the process.
     * @param process {object} - The process object
     * @param item {object} - The item that is being processed.
     *
     * @param step.args.value {string} - The string to slice.
     * @param [step.args.index] {number} - The index to start the slice. If no value is given, the value is set to 0.
     * @param step.args.length {number} - The length of the slice.
     * @param [step.args.overflow] {string} - The overflow value. if no value is given, the value is set to null.
     * @param [step.args.target = "$context.result"] {string} - The target to store the result in.
     *
     * @returns The substring of the value from the index to the length.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("string", "slice", {
     *      value: "Hello World",
     *      index: 2,
     *      length: 5,
     *      overflow: "ellipsis"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *       "type": "string",
     *       "action": "slice",
     *       "args": {
     *             "value": "Hello World",
     *             "index": 2,
     *             "length": 5,
     *             "overflow": "ellipsis",
     *             "target": "$context.result"
     *       }
     * }
     */
    static async slice(step, context, process, item) {
        const value = await crs.process.getValue(step.args.value, context, process, item);
        const index = await crs.process.getValue(step.args.index || 0, context, process, item);
        const length = await crs.process.getValue(step.args.length, context, process, item );
        const overflow = await crs.process.getValue(step.args.overflow || null, context, process, item);

        const endIndex = index + length;
        let result = value.substring(index, endIndex);

        if(overflow === "ellipsis") {
            if(value.length > result.length) {
                result = `${result.substring(0, length-3)}...`
            }
        }

        if(step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item)
        }

        return result;
    }
}

/**
 * @function inflate_string - It takes a string, replaces all instances of `${` with `${context.`, then creates a function that returns
 * the string, and then calls that function with the parameters
 * @param string - The string to inflate.
 * @param parameters - The parameters passed to the function.
 * @param context - The context object that contains all the variables that are available to the template.
 * @param process - The process object
 * @param item - The item that is being processed.
 *
 * @returns A string with the parameters replaced.
 */
async function inflate_string(string, parameters, context, process, item) {
    string = string.split("${").join("${context.");
    parameters = await sanitise_parameters(parameters, context, process, item);

    let fn = new Function("context", ["return `", string, "`;"].join(""));
    let result = fn(parameters);
    fn = null;
    return result;
}

/**
 * @function sanitise_parameters - It takes a parameters object, and gets the value for each property on the object.
 * @param parameters - The parameters object that was passed to the function.
 * @param context - The context of the current process.
 * @param process - The process that is being executed.
 * @param item - The item that is being processed.
 *
 * @returns The parameters object with the values replaced.
 */
async function sanitise_parameters(parameters, context, process, item) {
    const keys = Object.keys(parameters);

    for (let key of keys) {
        let value = parameters[key];
        parameters[key] = await crs.process.getValue(value, context, process, item);
    }

    return parameters
}

/**
 * @function translate_string - If the string contains a translation key, get the translation and replace the key with the translation
 * @param value - The string to translate.
 * @returns A promise that resolves to the translated string.
 */
async function translate_string(value) {
    const si = value.indexOf("&{");
    const ei = value.indexOf("}", si + 1);
    const key = value.substring(si + 2, ei);
    const trans = await crsbinding.translations.get(key);
    value = value.split(`&{${key}}`).join(trans);

    if (value.indexOf("&{") != -1) {
        return translate_string(value);
    }

    return value;
}

crs.intent.string = StringActions;