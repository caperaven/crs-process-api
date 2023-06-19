import { bindingUpdate } from "./utils/binding-update.js";
import { bindingParse } from "./utils/binding-parse.js";
class OneWayProvider {
  #store = {};
  get store() {
    return this.#store;
  }
  async parse(attr, context) {
    await bindingParse(attr, context, this.#store, ".one-way");
  }
  async update(uuid, ...properties) {
    await bindingUpdate(uuid, this.#store, ...properties);
  }
  async clear(uuid) {
    delete this.#store[uuid];
  }
}
export {
  OneWayProvider as default
};
