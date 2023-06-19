const ignoreElements = ["STYLE", "CRS-ROUTER", "SCRIPT"];
async function parseElement(element, context, options) {
  if (element["__inflated"] === true || ignoreElements.indexOf(element.nodeName) != -1)
    return;
  if (element.dataset.ref != null) {
    context[element.dataset.ref] = element;
  }
  let ctxName = options?.ctxName || "context";
  const elementProvider = await crs.binding.providers.getElementProvider(element);
  if (elementProvider != null) {
    return elementProvider.parse(element, context, ctxName);
  }
  if (ignore(element, crs.binding.ignore)) {
    return;
  }
  await crs.binding.parsers.parseAttributes(element, context, ctxName);
  if (ignore(element, crs.binding.ignoreChildren)) {
    return;
  }
  if (element.children?.length > 0) {
    return await crs.binding.parsers.parseElements(element.children, context, options);
  }
  for (const provider of crs.binding.providers.textProviders) {
    await provider.parseElement(element, context, ctxName);
  }
}
function ignore(element, options) {
  for (const query of options) {
    if (element.matches(query)) {
      return true;
    }
  }
  return false;
}
export {
  parseElement
};
