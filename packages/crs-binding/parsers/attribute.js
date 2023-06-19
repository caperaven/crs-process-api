async function parseAttribute(attr, context, ctxName, parentId) {
  if (attr.ownerElement == null)
    return;
  const provider = await crs.binding.providers.getAttrProvider(attr.name);
  if (provider == null)
    return;
  const element = attr.ownerElement;
  crs.binding.utils.markElement(element, context);
  await provider.parse(attr, context, ctxName, parentId);
}
export {
  parseAttribute
};
