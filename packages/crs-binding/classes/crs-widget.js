class Widget extends HTMLElement {
  async disconnectedCallback() {
    this.#clearElements();
  }
  #clearElements() {
    this.dataset.ready = "false";
    for (let child of this.children) {
      crs.binding.utils.unmarkElement(child);
      child.remove();
    }
  }
  async onMessage(args) {
    this.#clearElements();
    let context = args.context;
    if (typeof context != "object") {
      context = crs.binding.data.getContext(context);
    }
    this.innerHTML = args.html || await fetch(args.url).then((response) => response.text()).catch((err) => console.error(err));
    await crs.binding.parsers.parseElements(this.children, context, {});
    await crs.binding.data.updateContext(context.bid);
    this.dataset.ready = "true";
  }
}
customElements.define("crs-widget", Widget);
export {
  Widget
};
