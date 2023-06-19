async function parseElements(collection, context, options) {
  if (collection == null)
    return;
  for (let element of collection) {
    await crs.binding.parsers.parseElement(element, context, options);
  }
}
export {
  parseElements
};
