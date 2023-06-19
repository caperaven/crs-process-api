import "../../expressions/code-factories/case.js";
import { StyleBase } from "./style-base.js";
class StyleCaseProvider extends StyleBase {
  get providerKey() {
    return "^style..*.case$";
  }
  async parse(attr, context) {
    await super.parse(attr, context, async (value) => {
      return await crs.binding.expression.caseFactory(value);
    });
  }
}
export {
  StyleCaseProvider as default
};
