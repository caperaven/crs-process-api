function parseEvent(attr, callback) {
  const element = attr.ownerElement;
  const intent = callback(attr.value, element["__bid"]);
  const parts = attr.name.split(".");
  const event = parts[0];
  const uuid = element["__uuid"];
  crs.binding.eventStore.register(event, uuid, intent);
  element.removeAttribute(attr.name);
  element.__events ||= [];
  element.__events.push(event);
}
export {
  parseEvent
};
