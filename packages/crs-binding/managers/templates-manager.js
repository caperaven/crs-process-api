class TemplatesManager {
  #store = {};
  get(name, path) {
    return new Promise(async (resolve) => {
      this.#store[name] ||= {
        count: 0,
        queue: [],
        loading: false,
        template: null
      };
      this.#store[name].count += 1;
      if (this.#store[name].template == null && this.#store[name].loading === false) {
        this.#store[name].loading = true;
        const html = await fetch(path).then((result) => result.text());
        const template = document.createElement("template");
        template.innerHTML = html;
        this.#store[name].template = { template, html };
        for (const callback of this.#store[name].queue) {
          callback();
        }
        delete this.#store[name].loading;
        delete this.#store[name].queue;
        resolve(html);
      }
      if (this.#store[name].template == null) {
        this.#store[name].queue.push(() => {
          resolve(this.#store[name].template.html);
        });
      } else {
        resolve(this.#store[name].template.html);
      }
    });
  }
  async createStoreFromElement(store, element) {
    const targetStore = this.#store[store] ||= {
      count: 0,
      template: {}
    };
    const templates = element.querySelectorAll("template");
    let defaultView = null;
    for (const template of templates) {
      const id = template.id || template.dataset.id;
      targetStore.template[id] = template;
      if (template.dataset.default === "true") {
        defaultView = id;
      }
    }
    return defaultView;
  }
  async getStoreTemplate(store, name) {
    const targetStore = this.#store[store];
    const template = targetStore?.template[name];
    return template?.content.cloneNode(true);
  }
  async remove(name) {
    if (this.#store[name] == null)
      return;
    this.#store[name].count -= 1;
    if (this.#store[name].count === 0) {
      this.#store[name].count = null;
      this.#store[name].template.template = null;
      this.#store[name].template.html = null;
      this.#store[name].template = null;
      delete this.#store[name];
    }
  }
}
export {
  TemplatesManager
};
