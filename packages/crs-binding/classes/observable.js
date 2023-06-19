class Observable {
  #events = [];
  #eventEmitter = new EventTarget();
  get events() {
    return Object.freeze(this.#events);
  }
  dispose() {
    for (const { event, listener } of this.#events) {
      this.#eventEmitter.removeEventListener(event, listener);
    }
    this.#events.length = 0;
  }
  addEventListener(event, listener) {
    this.#eventEmitter.addEventListener(event, listener);
    this.#events.push({ event, listener });
  }
  removeEventListener(event, listener) {
    this.#eventEmitter.removeEventListener(event, listener);
    this.#events.splice(this.#events.indexOf({ event, listener }), 1);
  }
  notify(event, detail) {
    this.#eventEmitter.dispatchEvent(new CustomEvent(event, { detail }));
  }
}
crs.classes.Observable = Observable;
export {
  Observable
};
