export class ProcessApiManager {
    static async validate(schema) {

        const validationResult = {
            pass: true,
            invalidCollection: []
        }

        loopThroughAll(schema, async (process, step) => {
            const provider = globalThis.crs.api_providers[step.type];
            const result = await provider.validate(schema, process, step);

            if (result.pass == false) {
                validationResult.invalidCollection.push(result);
            }
        })

        // don't need this so remove it.
        if (validationResult.pass == true) {
            delete validationResult.invalidCollection;
        }

        return validationResult;
    }

    // migrate is environment specific and should be dealt with in that environment.

    static async clean(schema) {

    }
}

function loopThroughAll(schema, callback) {
    const keys = Object.keys(schema).filter(key => key.toLowerCase() != "id");

    for (let key of keys) {
        const process = schema[key];
        const steps = Object.keys(process.steps);
        for (let step of steps) {
            callback(key, step);
        }
    }
}

crs.intent.processApiManager = ProcessApiManager;