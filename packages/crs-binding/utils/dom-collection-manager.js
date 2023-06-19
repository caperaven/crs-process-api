class DomCollection {
  static append(uuid, ...items) {
    const element = crs.binding.elements[uuid];
    if (element == null)
      return;
    const details = crs.binding.inflation.store.get(uuid);
    const fragment = document.createDocumentFragment();
    for (const item of items) {
      const instance = details.template.content.cloneNode(true);
      details.fn(instance, item);
      fragment.appendChild(instance);
    }
    element.appendChild(fragment);
  }
  static splice(uuid, start, deleteCount, ...items) {
    const element = crs.binding.elements[uuid];
    if (element == null)
      return;
    for (let i = start; i < start + deleteCount; i++) {
      if (i > element.children.length) {
        break;
      }
      if (element.children[i]) {
        element.removeChild(element.children[i]);
      }
    }
    const details = crs.binding.inflation.store.get(uuid);
    const fragment = document.createDocumentFragment();
    for (const item of items || []) {
      const instance = details.template.content.cloneNode(true);
      details.fn(instance, item);
      fragment.appendChild(instance);
    }
    const target = element.children[start];
    element.insertBefore(fragment, target);
  }
  static pop(uuid) {
    const element = crs.binding.elements[uuid];
    if (element == null)
      return;
    if (element.lastElementChild) {
      element.removeChild(element.lastElementChild);
    }
  }
  static shift(uuid) {
    const element = crs.binding.elements[uuid];
    if (element == null)
      return;
    if (element.firstElementChild) {
      element.removeChild(element.firstElementChild);
    }
  }
}
crs.binding.dom ||= {};
crs.binding.dom.collection = DomCollection;
