class ClassListBase {
  #store = {};
  get store() {
    return this.#store;
  }
  async parse(attr, context, classes, callback) {
    const element = attr.ownerElement;
    element.removeAttribute(attr.name);
    crs.binding.utils.markElement(element, context);
    const expo = await callback(attr.value);
    this.#store[element["__uuid"]] = {
      classes,
      fnKey: expo.key
    };
    crs.binding.data.setCallback(element["__uuid"], context.bid, expo.parameters.properties, this.providerKey);
  }
  async update(uuid) {
    if (this.#store[uuid] == null)
      return;
    const element = crs.binding.elements[uuid];
    const data = crs.binding.data.getDataForElement(element);
    const storeItem = this.#store[uuid];
    const expo = crs.binding.functions.get(storeItem.fnKey);
    const result = await expo.function(data);
    element.classList.remove(...storeItem.classes);
    if (result != null) {
      const classes = Array.isArray(result) ? result : [result];
      element.classList.add(...classes);
    }
  }
  async clear(uuid) {
    const obj = this.#store[uuid];
    if (obj == null)
      return;
    obj.classes = null;
    obj.fnKey = null;
    delete this.#store[uuid];
  }
}
export {
  ClassListBase
};
