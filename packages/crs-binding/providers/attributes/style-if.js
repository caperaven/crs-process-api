import "../../expressions/code-factories/if.js";
import { StyleBase } from "./style-base.js";
class StyleIfProvider extends StyleBase {
  get providerKey() {
    return "^style..*.if$";
  }
  async parse(attr, context) {
    await super.parse(attr, context, async (value) => {
      return await crs.binding.expression.ifFactory(value);
    });
  }
}
export {
  StyleIfProvider as default
};
