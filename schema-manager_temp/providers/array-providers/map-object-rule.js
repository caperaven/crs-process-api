import {assertStep} from "../provider-utils";

export default async function mapObjectRule(schema, process, step) {
    return await assertStep(schema, process, step, ["source", "target", "field"]);
}