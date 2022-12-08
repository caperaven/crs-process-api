class SchemaParserManager {
    #parsers = {};
    #queue = {};

    constructor() {
        this.#parsers = {};
    }

    async register(id, parser, providers, parameters) {
        const instance = await crs.createSchemaLoader(new parser(parameters));

        for (const provider of providers) {
            instance.register((await import(provider)).default);
        }

        this.#parsers[id] = instance;
        this.#queue[id] = [];
        return instance;
    }

    async unregister(id) {
        this.#parsers[id]?.dispose();
        delete this.#parsers[id];
    }

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
     * Add the promise to queue. If only one item in queue we can call the runQueue function
     */
    #addToQueue(id, promise) {
        this.#queue[id].push(promise);
        if (this.#queue[id].length === 1) {
            this.#runQueue(id)
        }
    }

    /**
     * This function will run through the queue and when a promise resolves the then function will start the queue again
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

    static async unregister(step, context, process, item) {
        const id = await crs.process.getValue(step.args.id, context, process, item);
        await crs.schemaParserManager.unregister(id);
    }

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