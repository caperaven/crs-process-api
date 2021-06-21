/**
 *
 */
export class SchemaRegistry {
    constructor() {
        this._schemas = {};
        crsbinding.events.emitter.on("run-process", this._runProcess.bind(this));
    }

    _runProcess(args) {
        return new Promise(async (resolve, reject) => {
            const processName = args.step.action;
            const schemaName = args.step.args.schema;

            let schema = this._schemas[schemaName];
            if (schema == null && crs.process.fetch != null) {
                schema = await crs.process.fetch(args.step);
                this.add(schema);
            }

            // 1. Copy parameter values to process to run
            const process = schema[processName];
            await copyParametersToProcess(process, args.parameters);

            // 2. Run process
            const result = await crs.process.run(args.context, process).catch(error => {
                if (crs.process.onError != null && error?.message) {
                    crs.process.onError(error.message);
                    reject();
                }
            });

            // 3. Copy output from process to calling process
            const resultPath = args.step.args?.target;
            if (resultPath != null) {
                await crs.process.setValue(resultPath, result, args.context, args.process, args.item);
            }

            resolve();
        })
    }

    add(schema) {
        this._schemas[schema.id] = schema;
    }

    remove(schema) {
        delete this._schemas[schema.id];
    }
}

/**
 * Copy parameters from the calling process to the target process
 * @param process {object} process to set parameters on
 * @param parameters {object} object that defines parameter values
 * @returns {Promise<void>}
 */
async function copyParametersToProcess(process, parameters) {
    if (parameters == null) return;

    process.parameters = process.parameters || {};
    for (const [key, value] of Object.entries(parameters)) {
        process.parameters[key] = value;
    }
}