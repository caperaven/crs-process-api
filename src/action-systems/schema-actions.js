import "/packages/crs-schema/crs-schema.js"

class SchemaParserManager {
    #parsers;

    constructor() {
        this.#parsers = {};
    }

    async register(id, parser, providers) {
        const instance = await crs.createSchemaLoader(new parser());

        for (const provider of providers) {
            instance.register((await import(provider)).default);
        }

        this.#parsers[id] = instance;
    }

    async unregister(id) {
        this.#parsers[id]?.dispose();
        delete this.#parsers[id];
    }

    async parse(id, schema, ctx) {
        if (typeof schema == "string") {
            schema = await fetch(schema).then(result => result.json());
        }

        return await this.#parsers[id].parse(schema, ctx);
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

        await crs.schemaParserManager.register(id, parser, providers);
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