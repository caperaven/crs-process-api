export default async function addRule(schema, process, step) {
    const hasTarget = await crs.call("object", "assert", {source: step, paths: ["target"]});
    const hasValue   = await crs.call("object", "assert", {source: step, paths: ["value"]});

    const result = {
        pass: hasTarget && hasValue
    }

    if (result.pass == false) {
        result.issues = {
            process: process,
            messages: []
        }
    }

    if (hasTarget == false) {
        result.issues.messages.push("args.target must have a value");
    }

    if (hasValue == false) {
        result.issues.messages.push("args.value must have a value");
    }

    return result;
}