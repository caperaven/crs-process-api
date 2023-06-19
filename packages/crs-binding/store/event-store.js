class EventStore {
  #store = {};
  #eventHandler = this.#onEvent.bind(this);
  get store() {
    return this.#store;
  }
  async #onEvent(event) {
    const targets = getTargets(event);
    if (targets.length === 0)
      return;
    for (const target of targets) {
      const uuid = target["__uuid"];
      const data = this.#store[event.type];
      const intent = data[uuid];
      if (intent != null) {
        const bid = target["__bid"];
        let provider = Array.isArray(intent) ? intent[0].provider : intent.provider;
        provider = provider.replaceAll("\\", "");
        const providerInstance = crs.binding.providers.attrProviders[provider];
        await providerInstance.onEvent(event, bid, intent, target);
      }
    }
  }
  getIntent(event, uuid) {
    return this.#store[event]?.[uuid];
  }
  register(event, uuid, intent, isCollection = false) {
    if (this.#store[event] == null) {
      document.addEventListener(event, this.#eventHandler, {
        capture: true,
        passive: true
      });
      this.#store[event] = {};
    }
    if (isCollection) {
      this.#store[event][uuid] ||= [];
      this.#store[event][uuid].push(intent);
      return;
    }
    this.#store[event][uuid] = intent;
  }
  clear(uuid) {
    const element = crs.binding.elements[uuid];
    if (element?.__events == null)
      return;
    const events = element.__events;
    for (const event of events) {
      delete this.#store[event][uuid];
    }
  }
}
function getTargets(event) {
  return event.composedPath().filter((element) => element["__uuid"] != null);
}
export {
  EventStore
};
