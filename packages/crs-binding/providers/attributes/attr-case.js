import "../../expressions/code-factories/case.js";
import { AttrBase } from "./attr-base.js";
class AttrCaseProvider extends AttrBase {
  get providerKey() {
    return ".case";
  }
  async parse(attr, context) {
    await super.parse(attr, context, async (value) => {
      return await crs.binding.expression.caseFactory(value);
    });
  }
}
export {
  AttrCaseProvider as default
};
