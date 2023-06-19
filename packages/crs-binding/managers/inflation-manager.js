import "./../expressions/code-factories/inflation.js";
class InflationManager {
  async register(id, template, ctxName = "context") {
    const fn = await crs.binding.expression.inflationFactory(template, ctxName);
    crs.binding.inflation.store.add(id, template, fn);
  }
  async unregister(id) {
    crs.binding.inflation.store.remove(id);
  }
  async get(id, data, elements) {
    const { template, fn } = crs.binding.inflation.store.get(id);
    elements = syncCollection(elements, data.length, template);
    for (let i = 0; i < data.length; i++) {
      const element = elements[i];
      fn(element, data[i]);
    }
    return elements;
  }
}
function syncCollection(elements, count, template) {
  elements = Array.from(elements);
  if (elements.length > count) {
    for (let i = elements.length - 1; i >= count; i--) {
      elements[i].remove();
    }
  } else if (elements.length < count) {
    let templateElement = elements[0];
    if (templateElement == null) {
      if (template.nodeName == "TEMPLATE") {
        templateElement = template.content.cloneNode(true).firstElementChild;
      } else {
        templateElement = template;
      }
    }
    for (let i = elements.length; i < count; i++) {
      elements.push(templateElement.cloneNode(true));
    }
  }
  return elements;
}
crs.binding.inflation.manager = new InflationManager();
export {
  InflationManager
};
