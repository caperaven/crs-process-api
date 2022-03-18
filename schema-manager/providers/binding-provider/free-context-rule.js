import {assertStep} from "../provider-utils";

export default async function freeContextRule(schema, process, step) {
    return {passed: true}; // does not have any args
}