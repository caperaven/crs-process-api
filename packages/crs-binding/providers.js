class Providers {
  #regex = {};
  #attrProviders = {};
  #elementProviders = {};
  #textProviders = [];
  #attrPartialKeys = [];
  #elementQueries = [];
  get attrProviders() {
    return this.#attrProviders;
  }
  get textProviders() {
    return this.#textProviders;
  }
  get elementProviders() {
    return this.#elementProviders;
  }
  constructor(attrProviders, elementProviders) {
    for (const key of Object.keys(attrProviders)) {
      this.addAttributeProvider(key, attrProviders[key]);
    }
    for (const key of Object.keys(elementProviders)) {
      this.addElementProvider(key, elementProviders[key]);
    }
  }
  async #loadModule(file) {
    file = file.replace("$root", crs.binding.root);
    return new (await import(file)).default();
  }
  async getAttrModule(key) {
    const module = this.#attrProviders[key];
    if (typeof module !== "string")
      return module;
    this.#attrProviders[key] = await this.#loadModule(module);
    return this.#attrProviders[key];
  }
  addAttributeProvider(key, file) {
    this.#attrProviders[key] = file;
    if (key.indexOf(".") != -1) {
      this.#attrPartialKeys.push(key);
    }
  }
  addElementProvider(key, file) {
    this.#elementProviders[key] = file;
    this.#elementQueries.push(key);
  }
  async addTextProvider(file) {
    this.#textProviders.push(await this.#loadModule(file));
  }
  async getAttrProvider(attrName) {
    if (attrName === "ref")
      return await this.getAttrModule("ref");
    if (attrName.indexOf(".") == -1)
      return null;
    if (this.#attrProviders[attrName] != null)
      return await this.getAttrModule(attrName);
    for (const key of this.#attrPartialKeys) {
      if (key[0] === "^") {
        let regex = this.#regex[key];
        if (regex == null) {
          regex = new RegExp(key);
          this.#regex[key] = regex;
        }
        if (regex.test(attrName)) {
          return await this.getAttrModule(key);
        }
      }
      if (attrName.indexOf(key) != -1) {
        return await this.getAttrModule(key);
      }
    }
  }
  async getElementProvider(element) {
    for (const query of this.#elementQueries) {
      if (element.matches(query)) {
        if (typeof this.#elementProviders[query] === "object") {
          return this.#elementProviders[query];
        }
        this.#elementProviders[query] = await this.#loadModule(this.#elementProviders[query]);
        return this.#elementProviders[query];
      }
    }
  }
  async getTextProviders() {
    return this.#textProviders;
  }
  async update(uuid, ...properties) {
    const element = crs.binding.elements[uuid];
    if (element.__events != null && element.__events.indexOf("change") != -1) {
      this.#attrProviders[".bind"].update(uuid);
    }
    for (const textProvider of this.#textProviders) {
      if (textProvider.store[uuid] != null) {
        textProvider.update(uuid);
      }
    }
    for (const key of this.#attrPartialKeys) {
      const provider = this.#attrProviders[key];
      if (typeof provider === "string")
        continue;
      if (provider.store?.[uuid] != null) {
        provider.update?.(uuid, ...properties);
      }
    }
  }
  async updateProviders(uuid, ...providerKeys) {
    for (const providerKey of providerKeys) {
      let provider;
      if (providerKey === ".textContent") {
        provider = this.#textProviders[0];
      } else {
        provider = this.#attrProviders[providerKey] || this.#elementProviders[providerKey];
      }
      provider.update(uuid);
    }
  }
  async clear(uuid) {
    for (const textProvider of this.#textProviders) {
      textProvider.clear(uuid);
    }
    for (const key of this.#attrPartialKeys) {
      this.#attrProviders[key].clear?.(uuid);
    }
  }
}
export {
  Providers
};
