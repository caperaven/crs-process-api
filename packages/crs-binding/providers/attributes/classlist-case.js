import "../../expressions/code-factories/case.js";
import { ClassListBase } from "./classlist-base.js";
class ClassListCaseProvider extends ClassListBase {
  get providerKey() {
    return "classlist.case";
  }
  async parse(attr, context) {
    const classes = getCaseClasses(attr.value);
    await super.parse(attr, context, classes, async (value) => {
      return await crs.binding.expression.caseFactory(value);
    });
  }
}
function getCaseClasses(exp) {
  const set = /* @__PURE__ */ new Set();
  const statements = exp.split(",");
  for (const statement of statements) {
    const parts = statement.indexOf(":") != -1 ? statement.split(":") : [0, statement];
    const values = parts[1].replaceAll("[", "").replaceAll("]", ":").replaceAll(",", ":").replaceAll("'", "").split(":").map((item) => item.trim()).filter((item) => item.length > 0);
    set.add(...values);
  }
  return Array.from(set);
}
export {
  ClassListCaseProvider as default
};
