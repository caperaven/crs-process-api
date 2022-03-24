import {assertStep} from "../provider-utils.js";

export default async function showWidgetDialogRule(schema, process, step) {
    return await assertStep(schema, process, step, ["id", "html", "url"]);
}