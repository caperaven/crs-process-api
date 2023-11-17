/**
 * @class DomAttributesAction - The dom attributes action sets and removes attributes from an element based
 * on a specific condition
 * Features:
 * perform - Performs the dom attributes action
 */
export class DomAttributesAction {

    /**
     * @method perform - Performs the dom attributes action
     * @param step
     * @param context
     * @param process
     * @param item
     * @return {Promise<void>}
     */
    static async perform(step, context, process,item) {
        await crs.call("console", "log", {
            message: "dom attributes action charles"
        });
    }
}
crs.intent.dom_attributes = DomAttributesAction;
