class ViewBase {
  #element;
  #bid;
  get title() {
    return this.getProperty("title");
  }
  set title(newValue) {
    this.setProperty("title", newValue);
  }
  get bid() {
    return this.#bid;
  }
  get element() {
    return this.#element;
  }
  set element(newValue) {
    this.#element = newValue;
    this.#element.dataset.ready = "false";
    this.#element["__bid"] = this.#bid;
  }
  constructor(element) {
    this.#element = element;
    this.#bid = crs.binding.data.addObject(this.constructor.name);
    crs.binding.data.addContext(this.#bid, this);
  }
  async connectedCallback() {
    return new Promise(async (resolve) => {
      if (this["preLoad"] != null) {
        await this["preLoad"]();
      }
      const path = crs.binding.utils.getPathOfFile(this.html);
      requestAnimationFrame(async () => {
        await crs.binding.parsers.parseElements(this.element.children, this, path ? { folder: path } : null);
        await crs.binding.data.updateContext(this.#bid);
        await this.load();
      });
      resolve();
    });
  }
  async disconnectedCallback() {
    await crs.binding.data.remove(this.#bid);
    crs.binding.utils.unmarkElement(this.#element);
    this.#element = null;
  }
  getProperty(property) {
    return crs.binding.data.getProperty(this, property);
  }
  setProperty(property, value) {
    crs.binding.data.setProperty(this, property, value);
  }
  async load() {
    this.#element.style.visibility = "";
    this.#element.dataset.ready = "true";
  }
}
crs.classes.ViewBase = ViewBase;
export {
  ViewBase
};
