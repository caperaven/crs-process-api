class RefProvider {
  async parse(attr, context) {
    const element = attr.ownerElement;
    const name = attr.value;
    element.removeAttribute(attr.name);
    context[name] = element;
  }
}
export {
  RefProvider as default
};
