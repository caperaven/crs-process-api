import {assertStep} from "../provider-utils.js";

export default async function showFormDialogRule(schema, process, step) {
    return await assertStep(schema, process, step, ["id", "html", "url", "error_store"]);
}