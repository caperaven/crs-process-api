async function parseAttributes(element, context, ctxName, parentId) {
  if (element.attributes == null)
    return;
  const attributes = Array.from(element.attributes);
  for (const attribute of attributes) {
    await crs.binding.parsers.parseAttribute(attribute, context, ctxName, parentId);
  }
}
export {
  parseAttributes
};
