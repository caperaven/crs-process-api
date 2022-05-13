import {ProcessRunner} from "./process-runner.js";
import {SchemaRegistry} from "./process-registry.js";
import {ArrayActions} from "./action-systems/array-actions.js";
import {ConditionActions} from "./action-systems/condition-actions.js";
import {ConsoleActions} from "./action-systems/console-actions.js";
import {LoopActions} from "./action-systems/loop-actions.js";
import {ObjectActions} from './action-systems/object-actions.js';
import {ActionActions} from './action-systems/action-actions.js';
import {MathActions} from "./action-systems/math-actions.js";
import {ProcessActions} from "./action-systems/process-actions.js";
import {ModuleActions} from "./action-systems/module-actions.js";
import {DomActions} from "./action-systems/dom-actions.js";
import {BindingActions} from "./action-systems/binding-actions.js";
import {SystemActions} from "./action-systems/system-actions.js";
import {EventsActions} from "./action-systems/events.js";
import {RestServicesAction} from "./action-systems/rest-services-action.js";
import {RandomActions} from "./action-systems/random.js";
import {StringActions} from "./action-systems/string-actions.js";
import {DatabaseActions} from "./action-systems/database-actions.js";
import {StorageAction} from "./action-systems/storage.js";
import {SessionStorageAction} from "./action-systems/session-storage.js";
import {TranslationActions} from "./action-systems/translation-actions.js";
import {ValidateActions} from "./action-systems/validate-actions.js";
import {FileActions} from "./action-systems/files-action.js";

function getElement(element, context, process, item) {
    if (element instanceof HTMLElement) {
        return element;
    }

    if (element instanceof DocumentFragment) {
        return element;
    }

    const result = crs.process.getValue(element, context, process, item);

    if (typeof result == "string") {
        return document.querySelector(element);
    }

    return result;
}

globalThis.crs = globalThis.crs || {};

/**
 * Register features on the intent.
 * This can be used programmatically.
 */
globalThis.crs.intent = {
    array       : ArrayActions,
    condition   : ConditionActions,
    console     : ConsoleActions,
    loop        : LoopActions,
    object      : ObjectActions,
    action      : ActionActions,
    math        : MathActions,
    process     : ProcessActions,
    module      : ModuleActions,
    dom         : DomActions,
    binding     : BindingActions,
    system      : SystemActions,
    events      : EventsActions,
    rest        : RestServicesAction,
    random      : RandomActions,
    string      : StringActions,
    db          : DatabaseActions,
    storage     : StorageAction,
    session     : SessionStorageAction,
    translations: TranslationActions,
    validate    : ValidateActions,
    files       : FileActions
}

globalThis.crs.processSchemaRegistry = new SchemaRegistry();
globalThis.crs.process = ProcessRunner;
globalThis.crs.AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
globalThis.crs.dom = {
    get_element: getElement
}
globalThis.crs.call = (system, fn, args, context, process, item) => {
    return crs.intent[system][fn]({args: args}, context, process, item);
}

crsbinding.events.emitter.on("crs-process-error", (message) => {
    console.error(message.error);
})