function enableEvents(element) {
  element._domEvents = [];
  element.registerEvent = registerEvent;
  element.unregisterEvent = unregisterEvent;
}
function disableEvents(element) {
  if (element._domEvents == null)
    return;
  for (let event of element._domEvents) {
    element.removeEventListener(event.event, event.callback);
    delete event.element;
    delete event.callback;
    delete event.event;
  }
  element._domEvents.length = 0;
  delete element._domEvents;
  delete element.registerEvent;
  delete element.unregisterEvent;
}
function registerEvent(element, event, callback, eventOptions = null) {
  element.addEventListener(event, callback, eventOptions);
  this._domEvents.push({
    element,
    event,
    callback
  });
}
function unregisterEvent(element, event, callback) {
  const item = this._domEvents.find((item2) => item2.element == element && item2.event == event && item2.callback == callback);
  if (item == null)
    return;
  element.removeEventListener(item.event, item.callback);
  this._domEvents.splice(this._domEvents.indexOf(item), 1);
  delete item.element;
  delete item.callback;
  delete item.event;
}
export {
  disableEvents,
  enableEvents
};
