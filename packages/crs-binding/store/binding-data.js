class BindingData {
  #nextId = 1;
  #context = {};
  #data = {
    0: {
      name: "global",
      type: "data",
      data: {}
    }
  };
  #callbacks = {};
  #contextCallbacks = {};
  #elementProviders = {};
  #getNextId() {
    const result = this.#nextId;
    this.#nextId += 1;
    return result;
  }
  #getContextId(id) {
    if (typeof id == "object") {
      return id.bid;
    }
    return id;
  }
  get globals() {
    return this.#data[0].data;
  }
  async #performUpdate(bid, property) {
    if (this.#callbacks[bid] == null)
      return;
    const uuids = this.#callbacks[bid]?.[property];
    if (uuids != null) {
      for (const uuid of uuids.values()) {
        if (typeof uuid === "function") {
          await uuid();
        } else {
          await crs.binding.providers.update(uuid, property);
        }
      }
      return;
    }
    for (const dataProperty of Object.keys(this.#callbacks[bid])) {
      if (dataProperty.indexOf(property) == 0) {
        await this.#performUpdate(bid, dataProperty);
      }
    }
  }
  setCallback(uuid, bid, properties, provider) {
    const obj = this.#callbacks[bid] ||= {};
    for (const property of properties) {
      if (property.indexOf(GLOBALS) !== -1) {
        this.setCallback(uuid, 0, [property.replace(GLOBALS, "")], provider);
        continue;
      }
      if (obj[property] == null) {
        obj[property] = /* @__PURE__ */ new Set();
      }
      obj[property].add(uuid);
      this.#elementProviders[uuid] ||= /* @__PURE__ */ new Set();
      this.#elementProviders[uuid].add(provider);
    }
  }
  addContextCallback(bid, callback) {
    if (this.#contextCallbacks[bid] == null) {
      this.#contextCallbacks[bid] = /* @__PURE__ */ new Set();
    }
    this.#contextCallbacks[bid].add(callback);
  }
  removeContextCallback(bid, callback) {
    if (this.#contextCallbacks[bid] == null) {
      return;
    }
    this.#contextCallbacks[bid].delete(callback);
    if (this.#contextCallbacks[bid].size == 0) {
      delete this.#contextCallbacks[bid];
    }
  }
  addObject(name, struct = {}) {
    const id = this.#getNextId();
    this.#data[id] = {
      name,
      type: "data",
      data: struct
    };
    this.#callbacks[id] = {};
    return id;
  }
  addContext(id, obj) {
    this.#context[id] = obj;
  }
  getContext(id) {
    return this.#context[id];
  }
  getData(id) {
    id = this.#getContextId(id);
    return this.#data[id];
  }
  getCallbacks(id, property) {
    const set = this.#callbacks[id]?.[property];
    return set == null ? [] : Array.from(set);
  }
  getDataForElement(element) {
    const bid = element?.["__bid"];
    if (bid == null)
      return;
    const data = crs.binding.data.getData(bid);
    return data.data;
  }
  remove(id) {
    id = this.#getContextId(id);
    const context = this.#context[id];
    if (context == null)
      return;
    if (context.boundElements != null) {
      for (const uuid of context.boundElements) {
        delete this.#elementProviders[uuid];
      }
      delete context.boundElements;
    }
    crs.binding.utils.disposeProperties(this.#data[id]);
    crs.binding.utils.disposeProperties(this.#context[id]);
    crs.binding.utils.disposeProperties(this.#callbacks[id]);
    delete this.#data[id];
    delete this.#context[id];
    delete this.#callbacks[id];
    delete this.#contextCallbacks[id];
    if (crs.binding.dataDef != null) {
      crs.binding.dataDef.remove(id);
    }
  }
  getProperty(id, property) {
    if (property === "bid") {
      return id;
    }
    if (property.indexOf(GLOBALS) !== -1) {
      id = 0;
      property = property.replace(GLOBALS, "");
    }
    id = this.#getContextId(id);
    return crs.binding.utils.getValueOnPath(this.getData(id)?.data, property);
  }
  async setProperty(id, property, value) {
    const oldValue = this.getProperty(id, property);
    let setProperty = property;
    if (setProperty.indexOf(GLOBALS) !== -1) {
      id = 0;
      setProperty = property.replace(GLOBALS, "");
    }
    id = this.#getContextId(id);
    if (Array.isArray(value)) {
      value.__bid = id;
      value.__property = setProperty;
      value = (await import("./../proxies/array-proxy.js")).default(value);
    }
    crs.binding.utils.setValueOnPath(this.getData(id)?.data, setProperty, value);
    await this.#performUpdate(id, setProperty);
    if (id !== 0) {
      const context = this.#context[id];
      if (context != null) {
        context["propertyChanged"]?.(property, value, oldValue);
        context[`${property}Changed`]?.(value, oldValue);
      }
    }
    if (this.#contextCallbacks[id] != null) {
      for (const callback of this.#contextCallbacks[id]) {
        callback?.(property, value, oldValue);
      }
    }
    if (crs.binding.dataDef != null) {
      await crs.binding.dataDef.automateValues(id, property);
      await crs.binding.dataDef.automateValidations(id, property);
    }
  }
  setName(id, name) {
    id = this.#getContextId(id);
    const data = crs.binding.data.getData(id);
    data.name = name;
  }
  async updateElement(element) {
    const bid = element["__bid"];
    const uuid = element["__uuid"];
    if (bid == null || uuid == null)
      return;
    for (const property of Object.keys(this.#callbacks[bid])) {
      await crs.binding.providers.update(uuid, property);
    }
  }
  async updateContext(bid) {
    const context = this.getContext(bid);
    if (context == null || context.boundElements == null)
      return;
    for (const uuid of context.boundElements) {
      const providers = this.#elementProviders[uuid];
      if (providers == null)
        continue;
      const providersCollection = Array.from(providers);
      await crs.binding.providers.updateProviders(uuid, ...providersCollection);
    }
  }
  async updateUI(bid, property) {
    const context = this.getContext(bid);
    if (context == null || context.boundElements == null)
      return;
    await this.#performUpdate(bid, property);
  }
  async addCallback(bid, property, callback) {
    const obj = this.#callbacks[bid];
    if (obj[property] == null) {
      obj[property] = /* @__PURE__ */ new Set();
    }
    obj[property].add(callback);
  }
  async removeCallback(bid, property, callback) {
    const obj = this.#callbacks[bid];
    if (obj[property] == null)
      return;
    obj[property].delete(callback);
  }
}
export {
  BindingData
};
