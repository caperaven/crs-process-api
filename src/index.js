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

globalThis.crs = globalThis.crs || {};

/**
 * Register features on the intent.
 * This can be used programmatically.
 */
globalThis.crs.intent = {
    array: ArrayActions,
    condition: ConditionActions,
    console: ConsoleActions,
    loop: LoopActions,
    object: ObjectActions,
    action: ActionActions,
    math: MathActions,
    process: ProcessActions,
    module: ModuleActions
}

globalThis.crs.processSchemaRegistry = new SchemaRegistry();
globalThis.crs.process = ProcessRunner;
globalThis.crs.AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

// JHR: TODO: add process top gap if you want to abort the process.


// extensions
// 1. fetch     -> processSchemaRegistry to fetch a schema requested but not yet registered.
// 2. onError   -> give me the error information and I will deal with it.
