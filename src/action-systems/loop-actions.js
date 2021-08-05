const BATCH_SIZE = 500;

export class LoopActions {
    static async perform(step, context, process) {
        const source    = await crs.process.getValue(step.args.source, context, process);

        if (source == null) {
            throw new Error(`object on path ${step.args.source} was not set`);
        }

        const stepKeys  = Object.keys(step.args.steps);
        const target    = step.args.target;

        if (source.length <= BATCH_SIZE) {
            await processBatch(step, stepKeys, source, target, context, process, 0, source.length);
        }
        else {
            for (let i = 0; i < source.length; i += BATCH_SIZE) {
                const start = i;
                let end   = i + BATCH_SIZE;
                if (end > source.length) {
                    end = source.length;
                }

                let promise = new Promise(resolve => {
                    let timeout = setTimeout(async () => {
                        await processBatch(step, stepKeys, source, target, context, process, start, end);
                        clearTimeout(timeout);
                        timeout = null;
                        resolve();
                    }, 0)
                })

                await promise;
                promise = null;
            }
        }
    }
}

async function processBatch(step, stepKeys, collection, target, context, process, start, end) {
    for (let i = start; i < end; i++) {
        const item = collection[i];

        if (target != null) {
            await crs.process.setValue(target, item, context, process, item);
        }

        for (let stepKey of stepKeys) {
            const s = step.args.steps[stepKey];
            await crs.process.runStep(s, context, process, item);
        }
    }
}