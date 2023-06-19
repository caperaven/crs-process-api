class AttrProvider {
  #store = {};
  get store() {
    return this.#store;
  }
  async parse(attr, context) {
    const attrName = attr.name.split(".")[0];
    const element = attr.ownerElement;
    element.removeAttribute(attr.name);
    crs.binding.utils.markElement(element, context);
    const expo = await crs.binding.expression.compile(attr.value);
    const obj = this.#store[element["__uuid"]] ||= {};
    for (const property of expo.parameters.properties) {
      obj[property] = {
        [attrName]: expo.key
      };
    }
    crs.binding.data.setCallback(element["__uuid"], context.bid, expo.parameters.properties, ".attr");
  }
  async update(uuid, ...properties) {
    if (this.#store[uuid] == null)
      return;
    const element = crs.binding.elements[uuid];
    const data = crs.binding.data.getDataForElement(element);
    const storeItem = this.#store[uuid];
    if (properties.length == 0) {
      properties = Object.keys(storeItem);
    }
    for (const property of properties) {
      if (storeItem[property] == null)
        continue;
      const attributes = Object.keys(storeItem[property]);
      for (const attribute of attributes) {
        const fnKey = storeItem[property][attribute];
        const expo = crs.binding.functions.get(fnKey);
        const result = await expo.function(data);
        element.setAttribute(attribute, result);
      }
    }
  }
  async clear(uuid) {
    const obj = this.#store[uuid];
    if (obj == null)
      return;
    for (const attr of Object.values(obj)) {
      for (const fnKey of Object.values(attr)) {
        const exp = crs.binding.functions.get(fnKey);
        crs.binding.expression.release(exp);
      }
    }
    delete this.#store[uuid];
  }
}
export {
  AttrProvider as default
};
