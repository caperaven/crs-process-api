/**
 *
 */
export class SchemaRegistry {
    constructor() {
        this._schemas = {};
        crsbinding.events.emitter.on("run-process", this._runProcess.bind(this));
    }

    async _runProcess(args) {
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
        await validateParameters(process, processName);

        // 2. Run process
        const result = await crs.process.run(args.context, process);

        // 3. Copy output from process to calling process
        const resultPath = args.step.args?.result;
        if (resultPath != null) {
            await crs.process.setValue(resultPath, result, args.context, args.process, args.item);
        }
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

/**
 * Check the processes required parameters, referring to parameters_def.
 * Concern: Is this process in a condition with all requirements set to be able to run.
 * @param process {object} process definition
 * @param processName {string} name of the process to be used in error handling
 * @returns {Promise<void>}
 */
async function validateParameters(process, processName) {
    if (process.parameters_def == null) return;

    let isValid = true;
    for (const [key, value] of Object.entries(process.parameters_def)) {
        if (value.required === true) {
            // JHR: update
            isValid = process.parameters[key] != null;
        }

        if (isValid === false) {
            throw new Error(`required parameter "${key}" not set in process "${processName}"`);
        }
    }
}