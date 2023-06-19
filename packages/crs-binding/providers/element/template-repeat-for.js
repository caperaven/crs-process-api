import "./../../expressions/code-factories/inflation.js";
class TemplateRepeatForProvider {
  async parse(element, context) {
    const forExp = element.getAttribute("for");
    const forExpParts = forExp.split(" ");
    const uuid = crs.binding.utils.markElement(element.parentElement, context);
    element.parentElement["__path"] = forExpParts[2];
    element.parentElement.removeChild(element);
    const fn = await crs.binding.expression.inflationFactory(element, forExpParts[0]);
    crs.binding.inflation.store.add(uuid, element, fn);
    crs.binding.data.setCallback(uuid, context.bid, [forExpParts[2]], "template[for]");
  }
  async update(uuid) {
    const element = crs.binding.elements[uuid];
    const path = element["__path"];
    const data = crs.binding.data.getDataForElement(element);
    const collection = crs.binding.utils.getValueOnPath(data, path);
    if (collection == null)
      return;
    const storeItem = crs.binding.inflation.store.get(uuid);
    const fragment = document.createDocumentFragment();
    for (const item of collection) {
      const instance = storeItem.template.content.cloneNode(true).firstElementChild;
      storeItem.fn(instance, item);
      fragment.appendChild(instance);
    }
    element.appendChild(fragment);
  }
}
export {
  TemplateRepeatForProvider as default
};
