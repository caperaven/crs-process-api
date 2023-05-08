import {assertStep} from "../provider-utils.js";

export default async function setWidgetRule(schema, process, step) {
    return await assertStep(schema, process, step, ["query", "context", "html", "url"]);
}