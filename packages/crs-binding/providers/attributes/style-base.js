class StyleBase {
  #store = {};
  get store() {
    return this.#store;
  }
  async parse(attr, context, callback) {
    const parts = attr.name.split(".");
    const element = attr.ownerElement;
    element.removeAttribute(attr.name);
    const cssProperty = parts[1];
    crs.binding.utils.markElement(element, context);
    const expo = await callback(attr.value);
    const obj = this.#store[element["__uuid"]] ||= {};
    obj[cssProperty] = expo.key;
    crs.binding.data.setCallback(element["__uuid"], context.bid, expo.parameters.properties, this.providerKey);
  }
  async update(uuid) {
    if (this.#store[uuid] == null)
      return;
    const element = crs.binding.elements[uuid];
    const data = crs.binding.data.getDataForElement(element);
    for (const [cssProperty, fnKey] of Object.entries(this.#store[uuid])) {
      const expo = crs.binding.functions.get(fnKey);
      const result = await expo.function(data);
      element.style[cssProperty] = result;
    }
  }
  async clear(uuid) {
    const obj = this.#store[uuid];
    if (obj == null)
      return;
    for (const fnKey of Object.values(obj)) {
      const exp = crs.binding.functions.get(fnKey);
      crs.binding.expression.release(exp);
    }
    delete this.#store[uuid];
  }
}
export {
  StyleBase
};
