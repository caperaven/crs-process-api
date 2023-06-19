class TemplateProviderStore {
  #keys = [];
  #items = {};
  add(key, fn) {
    this.#keys.push(key);
    this.#items[key] = fn;
  }
  remove(key) {
    this.#keys.splice(this.#keys.indexOf(key), 1);
    delete this.#items[key];
  }
  async executeTemplateAction(element, context) {
    if (element.attributes.length === 0)
      return;
    for (const key of this.#keys) {
      if (element.getAttribute(key) != null) {
        const fn = this.#items[key];
        await fn(element, context);
      }
    }
  }
}
export {
  TemplateProviderStore
};
