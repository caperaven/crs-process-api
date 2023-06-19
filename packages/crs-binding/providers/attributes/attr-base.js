class AttrBase {
  #store = {};
  get store() {
    return this.#store;
  }
  async parse(attr, context, callback) {
    const parts = attr.name.split(".");
    const element = attr.ownerElement;
    element.removeAttribute(attr.name);
    const attrName = parts[0];
    crs.binding.utils.markElement(element, context);
    const expo = await callback(attr.value);
    const obj = this.#store[element["__uuid"]] ||= {};
    obj[attrName] = expo.key;
    crs.binding.data.setCallback(element["__uuid"], context.bid, expo.parameters.properties, this.providerKey);
  }
  async update(uuid, ...properties) {
    if (this.#store[uuid] == null)
      return;
    const element = crs.binding.elements[uuid];
    const data = crs.binding.data.getDataForElement(element);
    for (const [attrName, fnKey] of Object.entries(this.#store[uuid])) {
      const expo = crs.binding.functions.get(fnKey);
      const result = await expo.function(data);
      const useValue = fnKey.indexOf("?") !== -1;
      if (useValue === false) {
        if (result === false) {
          element.removeAttribute(attrName);
          continue;
        }
        element.setAttribute(attrName, attrName);
        continue;
      }
      if (result != null) {
        element.setAttribute(attrName, result);
      } else {
        element.removeAttribute(attrName);
      }
    }
  }
  async clear(uuid) {
    const obj = this.#store[uuid];
    if (obj == null)
      return;
    delete this.#store[uuid];
  }
}
export {
  AttrBase
};
