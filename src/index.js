import {ProcessRunner} from "./process-runner.js";
import {ArrayActions} from "./action-systems/array-actions.js";
import {ConditionActions} from "./action-systems/condition-actions.js";
import {ConsoleActions} from "./action-systems/console-actions.js";
import {LoopActions} from "./action-systems/loop-actions.js";

globalThis.crs = globalThis.crs || {};

/**
 * Register features on the intent.
 * This can be used programmatically.
 */
globalThis.crs.intent = {
    array: ArrayActions,
    condition: ConditionActions,
    console: ConsoleActions,
    loop: LoopActions
}

globalThis.crs.process = ProcessRunner;