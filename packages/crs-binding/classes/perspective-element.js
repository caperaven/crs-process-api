class PerspectiveElement extends HTMLElement {
  #view;
  #isLoading;
  #store;
  get hasOwnContext() {
    return true;
  }
  get ctx() {
    return this._dataId;
  }
  set ctx(newValue) {
    this._dataId = newValue;
    if (newValue != null) {
      const name = this.getAttribute("name");
      if (name != null) {
        crs.binding.data.setName(this._dataId, name);
      }
      this.#loadView().catch((error) => console.error(error));
    }
  }
  get view() {
    return this.#view;
  }
  set view(newValue) {
    if (this.#view != newValue) {
      this.#view = newValue;
      this.#loadView().catch((error) => console.error(error));
    }
  }
  constructor() {
    super();
    const contextAttribute = this.getAttribute("ctx.one-way") || this.getAttribute("ctx.once");
    if (this.hasOwnContext == true && contextAttribute == null) {
      this._dataId = crs.binding.data.addObject(this.constructor.name);
      crs.binding.data.addContext(this._dataId, this);
    }
    crs.binding.dom.enableEvents(this);
  }
  dispose() {
    crs.binding.dom.disableEvents(this);
    crs.binding.templates.remove(this.#store).catch((error) => console.error(error));
  }
  async connectedCallback() {
    await this.#initialize();
    this.dataset.ready = "true";
    this.dispatchEvent(new CustomEvent("ready", { bubbles: true, composed: true }));
  }
  async #initialize() {
    this.#isLoading = true;
    this.#store = this.dataset.store || this.constructor.name;
    this.#view = await crs.binding.templates.createStoreFromElement(this.#store, this);
    await this["preLoad"]?.();
    await this["load"]?.();
    this.#isLoading = false;
    await this.#loadView();
  }
  async disconnectedCallback() {
    this.dispose();
    crs.binding.utils.disposeProperties(this);
  }
  getProperty(property) {
    return crs.binding.data.getProperty(this, property);
  }
  setProperty(property, value, once = false) {
    crs.binding.data.setProperty(this, property, value);
  }
  async #loadView() {
    if (this.#isLoading == true)
      return;
    if (this.#view == null || this._dataId == null) {
      return;
    }
    this.innerHTML = "";
    const template = await crs.binding.templates.getStoreTemplate(this.#store, this.#view);
    this.appendChild(template);
    const context = crs.binding.data.getContext(this._dataId);
    await crs.binding.parsers.parseElements(this.children, context, { folder: this.dataset.folder });
    requestAnimationFrame(() => {
      this.dataset.view = this.#view;
      this.dispatchEvent(new CustomEvent("view-loaded", { bubbles: true, composed: true }));
    });
  }
}
customElements.define("perspective-element", PerspectiveElement);
export {
  PerspectiveElement
};
