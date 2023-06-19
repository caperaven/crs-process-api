import "../../expressions/code-factories/if.js";
import { AttrBase } from "./attr-base.js";
class AttrIfProvider extends AttrBase {
  get providerKey() {
    return ".if";
  }
  async parse(attr, context) {
    await super.parse(attr, context, async (value) => {
      return await crs.binding.expression.ifFactory(value);
    });
  }
}
export {
  AttrIfProvider as default
};
