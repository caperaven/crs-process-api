class SchemaParserManager {
    #parsers = {};
    #queue = {};

    constructor() {
        this.#parsers = {};
    }

    /**
     * It creates a new instance of the parser, registers all the providers,
     * and then stores the parser and a queue for it
     * @param id - The id of the parser.
     * @param parser - The parser class to use.
     * @param providers - An array of strings that are the paths to the providers.
     * @param parameters - An object containing the parameters to be passed to the parser.
     *
     * @params step.args.id - The id of the parser.
     * @params step.args.parser - The parser class to use.
     * @params step.args.providers - An array of strings that are the paths to the providers.
     * @params step.args.parameters - An object containing the parameters to be passed to the parser.
     *
     * @returns The instance of the parser.
     * @example <caption>javascript example</caption>
     * const result = await crs.call("schema", "register", {
     *     id: "my-parser",
     *     parser: MyParser,
     *     providers: ["./my-provider.js"],
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "schema",
     *     "action": "register",
     *     "args": {
     *         "id": "my-parser",
     *         "parser": "MyParser",
     *         "providers": ["./my-provider.js"]
     *      }
     * }
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
     * This function removes a parser from the queue.
     * @param id - The id of the parser.
     */
    async unregister(id) {
        this.#parsers[id]?.dispose();
        this.#queue[id] = null;
        delete this.#parsers[id];
    }

    /**
     * It adds a callback to a queue, and when the queue is empty, it executes the callback
     * @param id - The id of the parser to use.
     * @param schema - The schema to parse.
     * @param ctx - The context of the parser. This is used to pass information between parsers.
     *
     * @params step.args.id - The id of the parser to use.
     * @params step.args.schema - The schema to parse.
     *
     * @returns A promise that resolves to the result of the parser.
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
     *         "id": "my-parser",
     *         "schema": {schema}
     *     }
     * }
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
     * If the queue is empty, run the promise. If the queue is not empty, add the promise to the queue.
     * If only one item in queue we can call the runQueue function
     * @param id - The id of the queue to add the promise to.
     * @param promise - The promise to add to the queue.
     */
    #addToQueue(id, promise) {
        this.#queue[id].push(promise);
        if (this.#queue[id].length === 1) {
            this.#runQueue(id)
        }
    }


    /**
     * This function will run through the queue and when a promise resolves the then function will start the queue again
     *
     * @param id - The id of the queue you want to run.
     * @returns A function that takes an id as an argument.
     */
    #runQueue(id) {
        if (this.#queue[id].length < 1) return;

        this.#queue[id][0]()
            .then(() => this.#queue[id].shift())
            .then(this.#runQueue.bind(this, id))
    }
}

export class SchemaActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * It registers a new schema parser
     * @param step - The step object from the process definition.
     * @param context - The context object that is passed to the process.
     * @param process - The process that is currently running.
     * @param item - The item that is being processed.
     *
     * @param step.args.id - The id of the parser.
     * @param step.args.parser - The parser class to use.
     * @param step.args.providers - An array of strings that are the paths to the providers.
     * @param step.args.parameters - An object containing the parameters to be passed to the parser.
     *
     * @returns The instance of the registered schema parser.
     * @example <caption>javascript example</caption>
     * const result = await crs.call("schema", "register", {
     *    id: "my-parser",
     *    parser: MyParser,
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
     * > Unregister a schema parser
     * @param step - The step object from the process definition.
     * @param context - The context object that is passed to the process.
     * @param process - The process object
     * @param item - The item that is being processed.
     *
     * @param step.args.id - The id of the parser.
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
     * It takes a schema, parses it, and returns the result
     * @param step - The step object from the process definition.
     * @param context - The context object that is passed to the process.
     * @param process - The process object
     * @param item - The item that is being processed.
     *
     * @param step.args.id - The id of the parser to use.
     * @param step.args.schema - The schema to parse.
     * @param step.args.target - The target to store the result in.
     *
     * @returns The result of the parse.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("schema", "parse", {
     *    id: "my-parser",
     *    schema: "json"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "schema",
     *     "action": "parse",
     *     "args": {
     *          "id": "my-parser",
     *          "schema": "json"
     *          "target": "$context.myTarget"
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