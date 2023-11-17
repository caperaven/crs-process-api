/**
 * @class DomAttributesAction - The dom attributes action sets and removes attributes from an element based
 * on a specific condition
 * Features:
 * perform - Performs the dom attributes action
 */
export class DomAttributesAction {

    /**
     * @method perform - Takes in an add and/or remove array and adds or removes attributes from an element(s).
     * @param step {object} - The step object from the process.
     * @param context {object} - The context object that is passed to the process.
     * @param process {object} - The process object
     * @param item {object} - The item that is being processed.
     * @param step.args.add {Array} - An array of objects that contain the element, attribute and value to add.
     * @param step.args.remove {Array} - An array of objects that contain the element and attribute to remove.
     *
     * @example <caption>javascript example</caption>
     *  await crs.call("dom_attributes", "perform", {
     *      add: [
     *          {
     *              element: "#testElementOne",
     *              attr: "hidden",
     *              value: true
     *          },
     *          {
     *              element: "#testElementTwo",
     *              attr: "data-test",
     *              value: "test"
     *          }
     *      ],
     *      remove: [
     *          {
     *              element: "#testElement"
     *              attr: "hidden"
     *          }
     *      ]
     *  });
     *
     *  @example <caption>json example</caption>
     *  {
     *      type: "dom_attributes",
     *      action: "perform",
     *      args: {
     *             add: [
     *                {
     *                    element: "#testElementOne",
     *                    attr: "hidden",
     *                    value: true
     *                },
     *                {
     *                    element: "#testElementTwo",
     *                    attr: "data-test",
     *                    value: "test"
     *                }
     *              ],
     *             remove: [
     *                  {
     *                     element: "#testElement"
     *                     attr: "hidden"
     *                  }
     *             ]
     *          }
     *  }
     * @return {Promise<void>}
     */
    static async perform(step, context, process,item) {
       const add = await crs.process.getValue(step.args.add, context, process, item) || [];
       const remove = await crs.process.getValue(step.args.remove, context, process, item) || [];

    }
}
crs.intent.dom_attributes = DomAttributesAction;
