import {ProcessRunner} from "./process-runner.js";
import {ArrayActions} from "./action-systems/array-actions.js";
import {ConditionActions} from "./action-systems/condition-actions.js";
import {ConsoleActions} from "./action-systems/console-actions.js";
import {DataActions} from "./action-systems/data-actions.js";
import {LoopActions} from "./action-systems/loop-actions.js";

globalThis.crs = globalThis.crs || {};

/**
 * Register features on the intent.
 */
globalThis.crs.intent = {
    array: ArrayActions,
    condition: ConditionActions,
    console: ConsoleActions,
    data: DataActions,
    loop: LoopActions
}

globalThis.crs.process = ProcessRunner;