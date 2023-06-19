class TextProvider {
  #store = {};
  get store() {
    return this.#store;
  }
  async parseElement(element, context) {
    if (element.textContent.length == 0)
      return "";
    if (element.textContent.indexOf("${") !== -1 || element.textContent.indexOf("&{") !== -1) {
      const value = element.textContent;
      element.textContent = "";
      crs.binding.utils.markElement(element, context);
      const expo = await crs.binding.expression.compile(value);
      this.#store[element["__uuid"]] = expo.key;
      crs.binding.data.setCallback(element["__uuid"], context.bid, expo.parameters.properties, ".textContent");
    }
  }
  async update(uuid) {
    const element = crs.binding.elements[uuid];
    const expr = this.#store[uuid];
    const expo = crs.binding.functions.get(expr);
    const data = crs.binding.data.getDataForElement(element);
    const result = await expo.function(data);
    element.textContent = result == "undefined" ? "" : result;
  }
  async clear(uuid) {
    const fnKey = this.#store[uuid];
    if (fnKey == null)
      return;
    const exp = crs.binding.functions.get(fnKey);
    crs.binding.expression.release(exp);
    delete this.#store[uuid];
  }
}
export {
  TextProvider as default
};
