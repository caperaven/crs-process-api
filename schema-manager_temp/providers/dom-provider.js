import {validate} from "./provider-utils.js";

export default class DataActionsProvider  {
    static async validate(schema, process, step) {
        return await validate(schema, process, step, globalThis.crs.validate.domMap);
    }
}