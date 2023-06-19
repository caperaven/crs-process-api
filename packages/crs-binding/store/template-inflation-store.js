class TemplateInflationStore {
  #store = {};
  add(name, template, fn) {
    this.#store[name] = {
      template,
      fn
    };
  }
  get(name) {
    return this.#store[name];
  }
  remove(name) {
    const item = this.#store[name];
    delete this.#store[name];
    item.template = null;
    item.fn = null;
  }
}
export {
  TemplateInflationStore
};
