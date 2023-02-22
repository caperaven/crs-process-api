class SchemaParserManager {
    #parsers = {};
    #queue = {};

    constructor() {
        this.#parsers = {};
    }

    /**
     * @function register - It creates a new instance of the parser, registers all the providers, and then stores the parser and a queue for it
     *
     * @param id {string} - The id of the parser.
     * @param parser {string} - The parser class to use.
     * @param providers {array} - An array of strings that are the paths to the providers.
     * @param parameters {object} - An object containing the parameters to be passed to the parser.
     *
     * @returns The instance of the parser.
     */
    async register(id, parser, providers, parameters) {
        const instance = await crs.createSchemaLoader(new parser(parameters));

        for (const provider of providers) {
            instance.register((await import(provider)).default);
        }

        this.#parsers[id] = instance;
        this.#queue[id] = [];
        return instance;
    }

    /**
     * @function unregister - This function removes a parser from the queue.
     * @param id {string} - The id of the parser to remove.
     */
    async unregister(id) {
        this.#parsers[id]?.dispose();
        this.#queue[id] = null;
        delete this.#parsers[id];
    }

    /**
     * @function parse - It adds a callback to a queue, and when the queue is empty, it executes the callback
     *
     * @param id {string} - The id of the parser to use.
     * @param schema {object} - The schema to parse.
     * @param ctx {object} - The context to use when parsing the schema.
     *
     * @returns A promise that resolves to the result of the parser.
     */
    async parse(id, schema, ctx) {
        return new Promise(async (resolve) => {
            const callback = async () => {
                if (typeof schema == "string") {
                    schema = await fetch(schema).then(result => result.json());
                }
                const result = await this.#parsers[id].parse(schema, ctx);
                resolve(result);
            };
            this.#addToQueue(id, callback);
        })
    }

    /**
     * @function #addToQueue - If the queue is empty, run the promise. If the queue is not empty, add the promise to the queue.
     * If only one item in queue we can call the runQueue function
     * @param id {string} - The id of the queue to add the promise to.
     * @param promise - The promise to add to the queue.
     */
    #addToQueue(id, promise) {
        this.#queue[id].push(promise);
        if (this.#queue[id].length === 1) {
            this.#runQueue(id)
        }
    }


    /**
     * @function #runQueue - This function will run through the queue and when a promise resolves the then function will start the queue again
     *
     * @param id {string} - The id of the queue you want to run.
     * @returns A function that takes an id as an argument.
     */
    #runQueue(id) {
        if (this.#queue[id].length < 1) return;

        this.#queue[id][0]()
            .then(() => this.#queue[id].shift())
            .then(this.#runQueue.bind(this, id))
    }
}

/**
 * @class SchemaActions - This class contains all the actions that can be performed on the schema action system.
 * #description - It provides a way to register and unregister schema parsers, and to parse a schema.
 *
 * Features:
 * -perform - This function will call the action that is passed in.
 * -register - This function will register a new schema parser.
 * -unregister - This function will unregister a schema parser.
 * -parse - This function will parse a schema.
 */
export class SchemaActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * @method register - It registers a new schema parser
     * @param step {object} - The step object from the process definition.
     * @param context {object} - The context object that is passed to the process.
     * @param process {object} - The process that is currently running.
     * @param item {object} - The item that is being processed.
     *
     * @param step.args.id {string} - The id of the parser.
     * @param step.args.parser {string} - The parser class to use.
     * @param step.args.providers {array} - An [array] of strings that are the paths to the providers.
     * @param step.args.parameters {object} - An {object} containing the parameters to be passed to the parser.
     * @param [step.args.target = "$context.result"] {string} - The target to register the parser to.
     *
     * @returns The instance of the registered schema parser.
     * @example <caption>javascript example</caption>
     * const result = await crs.call("schema", "register", {
     *    id: "my-parser",
     *    parser: "myParser",
     *    providers: ["./my-provider.js"],
     *    parameters: {myParameter: "myValue"}
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *      "type": "schema",
     *      "action": "register",
     *      "args": {
     *          "id": "my-parser",
     *          "parser": "MyParser",
     *          "providers": ["./my-provider.js"],
     *          "parameters": {myParameter: "myValue"}
     *          "target": "$context.result"
     *      }
     * }
     */
    static async register(step, context, process, item) {
        const id = await crs.process.getValue(step.args.id, context, process, item);
        const parser = await crs.process.getValue(step.args.parser, context, process, item);
        const providers = await crs.process.getValue(step.args.providers, context, process, item);
        const parameters = await crs.process.getValue(step.args.parameters, context, process, item);

        const instance = await crs.schemaParserManager.register(id, parser, providers, parameters);
        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, instance, context, process, item);
        }

        return instance;
    }

    /**
     * @method unregister - Unregister a schema parser
     * @param step {object} - The step object from the process definition.
     * @param context {object} - The context object that is passed to the process.
     * @param process {object} - The process object
     * @param item {object} - The item that is being processed.
     *
     * @param step.args.id {string} - The id of the parser.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("schema", "unregister", {
     *    id: "my-parser"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *      "type": "schema",
     *      "action": "unregister",
     *      "args": {
     *          "id": "my-parser"
     *      }
     * }
     */
    static async unregister(step, context, process, item) {
        const id = await crs.process.getValue(step.args.id, context, process, item);
        await crs.schemaParserManager.unregister(id);
    }

    /**
     * @method parse - It takes a schema, parses it, and returns the result
     * @param step {object} - The step object from the process definition.
     * @param context {object} - The context object that is passed to the process.
     * @param process {object} - The process object
     * @param item {object} - The item that is being processed.
     *
     * @param step.args.id {string} - The id of the parser to use.
     * @param step.args.schema {object} - The schema to parse.
     * @param [step.args.target = "$context.result"] {string} - The target to store the result in.
     *
     * @returns The result of the parse.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("schema", "parse", {
     *    id: "my-parser",
     *    schema: {schema}
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "schema",
     *     "action": "parse",
     *     "args": {
     *          "id": "my-parser",
     *          "schema": {schema}
     *          "target": "$context.result"
     *      }
     * }
     */
    static async parse(step, context, process, item) {
        const id = await crs.process.getValue(step.args.id, context, process, item);
        const schema = await crs.process.getValue(step.args.schema, context, process, item);
        const result = await crs.schemaParserManager.parse(id, schema, context);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }
}

globalThis.crs ||= {};
crs.schemaParserManager = new SchemaParserManager();
crs.intent.schema = SchemaActions;