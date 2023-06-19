async function bindingUpdate(uuid, ...properties) {
  const element = crs.binding.elements[uuid];
  if (element == null)
    return;
  const bid = element["__bid"];
  const intent = crs.binding.eventStore.getIntent("change", uuid);
  if (properties.length === 0) {
    properties = Object.keys(intent.value);
  }
  for (const property of properties) {
    const targetProperty = intent.value[property];
    if (targetProperty == null)
      continue;
    element[targetProperty] = await crs.binding.data.getProperty(bid, property) || "";
  }
}
export {
  bindingUpdate
};
