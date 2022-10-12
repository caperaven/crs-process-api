import {SchemaRegistry} from "./process-registry.js";
import {ProcessRunner} from "./process-runner.js";

export async function initialize(root) {
    await crs.modules.add("action", `${root}/action-systems/action-actions.js`);
    await crs.modules.add("array", `${root}/action-systems/array-actions.js`);
    await crs.modules.add("binding", `${root}/action-systems/binding-actions.js`);
    await crs.modules.add("component", `${root}/action-systems/component-actions.js`);
    await crs.modules.add("condition", `${root}/action-systems/condition-actions.js`);
    await crs.modules.add("console", `${root}/action-systems/console-actions.js`);
    await crs.modules.add("cssgrid", `${root}/action-systems/css-grid-actions.js`);
    await crs.modules.add("data", `${root}/action-systems/data-actions.js`);
    await crs.modules.add("db", `${root}/action-systems/database-actions.js`);
    await crs.modules.add("dom", `${root}/action-systems/dom-actions.js`);
    await crs.modules.add("dom_binding", `${root}/action-systems/dom-binding-actions.js`);
    await crs.modules.add("dom_collection", `${root}/action-systems/dom-collection-actions.js`);
    await crs.modules.add("dom_interactive", `${root}/action-systems/dom-interactive-actions.js`);
    await crs.modules.add("dom_utils", `${root}/action-systems/dom-utils-actions.js`);
    await crs.modules.add("dom_widget", `${root}/action-systems/dom-widgets-actions.js`);
    await crs.modules.add("events", `${root}/action-systems/events-actions.js`);
    await crs.modules.add("files", `${root}/action-systems/files-actions.js`);
    await crs.modules.add("fs", `${root}/action-systems/fs-actions.js`);
    await crs.modules.add("loop", `${root}/action-systems/loop-actions.js`);
    await crs.modules.add("math", `${root}/action-systems/math-actions.js`);
    await crs.modules.add("media", `${root}/action-systems/media-actions.js`);
    await crs.modules.add("module", `${root}/action-systems/module-actions.js`);
    await crs.modules.add("object", `${root}/action-systems/object-actions.js`);
    await crs.modules.add("process", `${root}/action-systems/process-actions.js`);
    await crs.modules.add("random", `${root}/action-systems/random-actions.js`);
    await crs.modules.add("rest_services", `${root}/action-systems/rest-services-actions.js`);
    await crs.modules.add("session_storage", `${root}/action-systems/session-storage-actions.js`);
    await crs.modules.add("local_storage", `${root}/action-systems/local-storage-actions.js`);
    await crs.modules.add("string", `${root}/action-systems/string-actions.js`);
    await crs.modules.add("system", `${root}/action-systems/system-actions.js`);
    await crs.modules.add("translations", `${root}/action-systems/translations-actions.js`);
    await crs.modules.add("validate", `${root}/action-systems/validate-actions.js`);
    await crs.modules.add("fixed_layout", `${root}/action-systems/fixed-layout-actions.js`);
    await crs.modules.add("colors", `${root}/action-systems/colors-actions.js`);
    await crs.modules.add("styles", `${root}/action-systems/styles-actions.js`);

    crs.dom = (await crs.modules.get("dom")).DomActions;
}

globalThis.crs = globalThis.crs || {};
globalThis.crs.intent = {}

globalThis.crs.processSchemaRegistry = new SchemaRegistry();
globalThis.crs.process = ProcessRunner;
globalThis.crs.AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

globalThis.crs.call = async (system, fn, args, context, process, item) => {
    if (crs.intent[system] == null) {
        await crs.modules.get(system);
    }

    const module = crs.intent[system];
    if (module[fn] == null) {
        return await module["perform"]({ action: fn, args: args }, context, process, item);
    }

    return await module[fn]({args: args}, context, process, item);
}

globalThis.crs.getNextStep = (process, step) => {
    if (typeof step == "object") return step;
    return crsbinding.utils.getValueOnPath(process.steps, step);
}

crsbinding.events.emitter.on("crs-process-error", (message) => {
    console.error(message.error);
})