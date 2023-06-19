import "../../expressions/code-factories/if.js";
import { bindingUpdate } from "./utils/binding-update.js";
import { bindingParse } from "./utils/binding-parse.js";
class BindProvider {
  async onEvent(event, bid, intent, target) {
    const field = target.dataset.field;
    if (bid == null || field == null)
      return;
    let value = target.value;
    if (target.nodeName === "INPUT") {
      if (target.type === "checkbox") {
        value = target.checked;
      }
      if (target.type === "number") {
        value = Number(value);
      }
    }
    await crs.binding.data.setProperty(bid, field, value);
  }
  async parse(attr, context) {
    await bindingParse(attr, context);
  }
  async update(uuid, ...properties) {
    await bindingUpdate(uuid, ...properties);
  }
  async clear(uuid) {
    crs.binding.eventStore.clear(uuid);
  }
}
export {
  BindProvider as default
};
