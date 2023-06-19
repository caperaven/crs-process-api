function markElement(element, context) {
  if (element["__uuid"])
    return element["__uuid"];
  const bid = context.bid;
  if (element["__uuid"] == null) {
    element["__uuid"] ||= crypto.randomUUID();
    crs.binding.elements[element["__uuid"]] = element;
  }
  element["__bid"] ||= bid;
  context.boundElements ||= /* @__PURE__ */ new Set();
  context.boundElements.add(element["__uuid"]);
  return element["__uuid"];
}
function unmarkElement(element) {
  if (element.nodeName === "STYLE")
    return;
  if (element.children.length > 0) {
    unmarkElements(element.children);
  }
  const uuid = element["__uuid"];
  if (uuid == null)
    return;
  crs.binding.providers.clear(uuid).catch((error) => console.error(error));
  if (crs.binding.elements[uuid]) {
    delete crs.binding.elements[uuid];
  }
  crs.binding.utils.disposeProperties(element);
}
function unmarkElements(elements) {
  for (const element of elements) {
    unmarkElement(element);
  }
}
export {
  markElement,
  unmarkElement,
  unmarkElements
};
