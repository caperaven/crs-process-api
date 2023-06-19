var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/utils/dom-collection-manager.js
var DomCollection;
var init_dom_collection_manager = __esm({
  "src/utils/dom-collection-manager.js"() {
    DomCollection = class {
      static append(uuid, ...items) {
        const element = crs.binding.elements[uuid];
        if (element == null)
          return;
        const details = crs.binding.inflation.store.get(uuid);
        const fragment = document.createDocumentFragment();
        for (const item of items) {
          const instance = details.template.content.cloneNode(true);
          details.fn(instance, item);
          fragment.appendChild(instance);
        }
        element.appendChild(fragment);
      }
      static splice(uuid, start, deleteCount, ...items) {
        const element = crs.binding.elements[uuid];
        if (element == null)
          return;
        for (let i = start; i < start + deleteCount; i++) {
          if (i > element.children.length) {
            break;
          }
          if (element.children[i]) {
            element.removeChild(element.children[i]);
          }
        }
        const details = crs.binding.inflation.store.get(uuid);
        const fragment = document.createDocumentFragment();
        for (const item of items || []) {
          const instance = details.template.content.cloneNode(true);
          details.fn(instance, item);
          fragment.appendChild(instance);
        }
        const target = element.children[start];
        element.insertBefore(fragment, target);
      }
      static pop(uuid) {
        const element = crs.binding.elements[uuid];
        if (element == null)
          return;
        if (element.lastElementChild) {
          element.removeChild(element.lastElementChild);
        }
      }
      static shift(uuid) {
        const element = crs.binding.elements[uuid];
        if (element == null)
          return;
        if (element.firstElementChild) {
          element.removeChild(element.firstElementChild);
        }
      }
    };
    crs.binding.dom ||= {};
    crs.binding.dom.collection = DomCollection;
  }
});

// src/proxies/array-proxy.js
var array_proxy_exports = {};
__export(array_proxy_exports, {
  default: () => wrapArrayForUpdate
});
function updateDom(callback) {
  const bid = this["__bid"];
  const property = this["__property"];
  if (bid == null || property == null)
    return;
  const uuids = crs.binding.data.getCallbacks(bid, property);
  for (const uuid of uuids) {
    callback(uuid);
  }
}
function wrapArrayForUpdate(array) {
  return new Proxy(array, arrayHandler);
}
var ArrayProxyFunctions, arrayHandler;
var init_array_proxy = __esm({
  "src/proxies/array-proxy.js"() {
    init_dom_collection_manager();
    ArrayProxyFunctions = class {
      static push(...items) {
        this.push(...items);
        updateDom.call(this, (uuid) => {
          crs.binding.dom.collection.append(uuid, ...items);
        });
      }
      static splice(start, deleteCount, ...items) {
        this.splice(start, deleteCount, ...items);
        updateDom.call(this, (uuid) => {
          crs.binding.dom.collection.splice(uuid, start, deleteCount, ...items);
        });
      }
      static shift() {
        this.shift();
        updateDom.call(this, (uuid) => {
          crs.binding.dom.collection.shift(uuid);
        });
      }
      static pop() {
        this.pop();
        updateDom.call(this, (uuid) => {
          crs.binding.dom.collection.pop(uuid);
        });
      }
    };
    arrayHandler = {
      get(target, prop, receiver) {
        if (ArrayProxyFunctions[prop]) {
          return ArrayProxyFunctions[prop].bind(target);
        }
        return target[prop];
      }
    };
  }
});

// src/providers.js
var Providers = class {
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
};

// src/parsers/element.js
var ignoreElements = ["STYLE", "CRS-ROUTER", "SCRIPT"];
async function parseElement(element, context, options) {
  if (element["__inflated"] === true || ignoreElements.indexOf(element.nodeName) != -1)
    return;
  if (element.dataset.ref != null) {
    context[element.dataset.ref] = element;
  }
  let ctxName = options?.ctxName || "context";
  const elementProvider = await crs.binding.providers.getElementProvider(element);
  if (elementProvider != null) {
    return elementProvider.parse(element, context, ctxName);
  }
  if (ignore(element, crs.binding.ignore)) {
    return;
  }
  await crs.binding.parsers.parseAttributes(element, context, ctxName);
  if (ignore(element, crs.binding.ignoreChildren)) {
    return;
  }
  if (element.children?.length > 0) {
    return await crs.binding.parsers.parseElements(element.children, context, options);
  }
  for (const provider of crs.binding.providers.textProviders) {
    await provider.parseElement(element, context, ctxName);
  }
}
function ignore(element, options) {
  for (const query of options) {
    if (element.matches(query)) {
      return true;
    }
  }
  return false;
}

// src/parsers/elements.js
async function parseElements(collection, context, options) {
  if (collection == null)
    return;
  for (let element of collection) {
    await crs.binding.parsers.parseElement(element, context, options);
  }
}

// src/parsers/attribute.js
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

// src/parsers/attributes.js
async function parseAttributes(element, context, ctxName, parentId) {
  if (element.attributes == null)
    return;
  const attributes = Array.from(element.attributes);
  for (const attribute of attributes) {
    await crs.binding.parsers.parseAttribute(attribute, context, ctxName, parentId);
  }
}

// src/store/binding-data.js
var BindingData = class {
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
      value = (await Promise.resolve().then(() => (init_array_proxy(), array_proxy_exports))).default(value);
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
};

// src/expressions/exp-tokenizer.js
var TokenTypes = Object.freeze({
  WORD: "word",
  LITERAL: "literal",
  FUNCTION: "function",
  PROPERTY: "property",
  OBJECT: "object",
  KEYWORD: "keyword",
  OPERATOR: "operator",
  NUMBER: "number",
  SPACE: "space",
  STRING: "string"
});
function tokenize(exp, isLiteral) {
  const result = [];
  let word = [];
  let i = 0;
  function step(type, value) {
    if (word.length > 0) {
      const value2 = word.join("");
      pushWord(value2);
    }
    result.push({ type, value });
  }
  function pushWord(value) {
    let wordType = TokenTypes.WORD;
    if (keywords.indexOf(value) != -1) {
      wordType = TokenTypes.KEYWORD;
    }
    if (isNaN(Number(value)) == false) {
      wordType = TokenTypes.NUMBER;
    }
    result.push({ type: wordType, value });
    word.length = 0;
  }
  for (i; i < exp.length; i++) {
    const char = exp[i];
    if (char == " ") {
      step(TokenTypes.SPACE, " ");
      continue;
    }
    if (char == "`") {
      step(TokenTypes.LITERAL, "`");
      continue;
    }
    if (char == "$") {
      if (exp[i + 1] == "{") {
        step(TokenTypes.KEYWORD, "${");
        i++;
        continue;
      }
    }
    if (char == "'" || char == '"') {
      const lastIndex = i + exp.length - i;
      let hasLiteral = false;
      if (exp[i + 1] == void 0) {
        step(TokenTypes.STRING, char);
        break;
      }
      let j = i + 1;
      for (j; j < lastIndex; j++) {
        if (exp[j] == "$" && exp[j + 1] == "{") {
          hasLiteral = true;
          break;
        }
        if (exp[j] == char) {
          const value = exp.substring(i, j + 1);
          step(TokenTypes.STRING, value);
          break;
        }
      }
      if (hasLiteral == true) {
        step(TokenTypes.STRING, char);
      } else {
        i = j;
      }
      continue;
    }
    if (keywords.indexOf(char) != -1) {
      step(TokenTypes.KEYWORD, char);
      continue;
    }
    if (operatorStart.indexOf(char) != -1) {
      for (let j = i; j < i + 4; j++) {
        const charNext = exp[j];
        if (operatorStart.indexOf(charNext) == -1) {
          const value = exp.substring(i, j);
          step(TokenTypes.OPERATOR, value);
          i = j - 1;
          break;
        }
      }
      continue;
    }
    word.push(char);
  }
  if (word.length > 0) {
    pushWord(word.join(""));
  }
  return postProcessTokens(result, isLiteral);
}
function postProcessTokens(tokens, isLiteral) {
  if (tokens.length == 1 && tokens[0].type == TokenTypes.WORD) {
    tokens[0].type = TokenTypes.PROPERTY;
    return tokens;
  }
  let state = [];
  let i = 0;
  while (tokens[i] != void 0) {
    const token = tokens[i];
    const currentState = state.length == 0 ? "none" : state[state.length - 1];
    const index = token.value.indexOf(".");
    if (token.type == TokenTypes.WORD) {
      if (currentState == TokenTypes.LITERAL) {
        if (token.value[0] == "." && tokens[i + 1].value == "(") {
          token.type = TokenTypes.FUNCTION;
          i++;
          continue;
        }
        token.type = TokenTypes.PROPERTY;
      } else if (index != -1) {
        if (tokens[i - 1]?.value === ")" && index === 0) {
          token.type = TokenTypes.FUNCTION;
        } else {
          token.type = TokenTypes.PROPERTY;
        }
      } else if (isOperator(tokens[i + 1]) || isOperator(tokens[i + 2])) {
        if (isLiteral !== true && currentState !== TokenTypes.OBJECT) {
          token.type = TokenTypes.PROPERTY;
        }
      } else if (isLiteral !== true && isOperator(tokens[i - 1]) || isOperator(tokens[i - 2])) {
        if (currentState !== TokenTypes.OBJECT) {
          token.type = TokenTypes.PROPERTY;
        }
      } else if (i === 0 && tokens[i + 1]?.value === "(") {
        token.type = TokenTypes.PROPERTY;
      }
    }
    if (token.type == TokenTypes.KEYWORD && token.value == "(" && (tokens[i - 1] && tokens[i - 1].type == TokenTypes.PROPERTY && tokens[i - 1].value[0] != "$")) {
      const path = tokens[i - 1].value;
      if (path.indexOf(".") == -1) {
        tokens[i - 1].type = TokenTypes.FUNCTION;
      } else {
        let dotIndex = path.length - 1;
        for (let i2 = path.length - 1; i2 >= 0; i2--) {
          if (path[i2] == ".") {
            dotIndex = i2;
            break;
          }
        }
        if (dotIndex > 0) {
          const property = path.substring(0, dotIndex);
          const fnName = path.substring(dotIndex, path.length);
          tokens[i - 1].value = property;
          tokens.splice(i, 0, { type: TokenTypes.FUNCTION, value: fnName });
          i++;
        } else {
          tokens[i - 1].type = TokenTypes.FUNCTION;
        }
      }
    }
    if (token.value == "${") {
      state.push(TokenTypes.LITERAL);
    } else if (token.value == "{") {
      state.push(TokenTypes.OBJECT);
    } else if (token.value == "}") {
      state.pop();
    }
    i++;
  }
  if (tokens[0].type === TokenTypes.FUNCTION) {
    tokens[0].type = TokenTypes.PROPERTY;
  }
  return tokens;
}
function isOperator(token) {
  if (token == null)
    return false;
  return token.type == TokenTypes.OPERATOR;
}
var operatorStart = ["=", "!", "<", ">", "+", "-", "*", "/", "&", "|", "?", ":"];
var keywords = ["{", "}", "(", ")", ",", "true", "false", "null", "undefined", "[]"];

// src/expressions/exp-sanitizer.js
var sanitizeKeywords = ["false", "true", "null"];
async function sanitize(exp, ctxName = "context") {
  let isHTML = false;
  if (typeof exp == "string" && exp.indexOf("$html") != -1) {
    isHTML = true;
    exp = exp.split("$html.").join("");
  }
  if (exp == null || exp == "null" || exp == "undefined" || sanitizeKeywords.indexOf(exp.toString()) != -1 || isNaN(exp) == false || exp.trim() == ctxName) {
    return {
      isLiteral: true,
      expression: exp,
      isHTML
    };
  }
  const namedExp = ctxName != "context";
  if (namedExp == true && exp == ["${", ctxName, "}"].join("")) {
    return {
      isLiteral: true,
      expression: exp
    };
  }
  const properties = /* @__PURE__ */ new Set();
  const isLiteral = exp.indexOf("${") != -1 || exp.indexOf("&{") != -1;
  const tokens = tokenize(exp, isLiteral);
  const expression = [];
  for (let token of tokens) {
    if (token.type == "property") {
      if (token.value.indexOf("$globals") != -1) {
        expression.push(token.value.replace("$globals", "crs.binding.data.globals"));
      } else if (token.value.indexOf("$event") != -1) {
        expression.push(token.value.replace("$event", "event"));
      } else if (token.value.indexOf("$context") != -1) {
        expression.push(token.value.replace("$context", "context"));
      } else if (token.value.indexOf("$data") != -1) {
        expression.push(token.value.replace("$data", "crs.binding.data.getValue"));
      } else if (token.value.indexOf("$parent") != -1) {
        expression.push(token.value.replace("$parent", "parent"));
      } else if (ctxName !== "context" && token.value.indexOf(`${ctxName}.`) != -1) {
        expression.push(token.value);
      } else if (token.value === "new") {
        expression.push(token.value);
      } else {
        expression.push(`${ctxName}.${token.value}`);
      }
      addProperty(properties, token.value, ctxName);
    } else {
      expression.push(token.value);
    }
  }
  let expr = expression.join("").replaceAll("context.[", "[").replaceAll("context.]", "]");
  expr = await crs.binding.expression.translateFactory(expr);
  return {
    isLiteral,
    isHTML,
    expression: expr,
    properties: Array.from(properties)
  };
}
var fnNames = [".trim", ".toLowerCase", "toUpperCase"];
var ignoreProperties = ["$data", "$event", "[", "]"];
function addProperty(set, property, ctxName) {
  if (property.length == 0)
    return;
  for (let ignore2 of ignoreProperties) {
    if (property.indexOf(ignore2) != -1)
      return;
  }
  let propertyValue = property;
  const ctxPrefix = `${ctxName}.`;
  if (propertyValue.indexOf(ctxPrefix) == 0) {
    propertyValue = propertyValue.replace(ctxPrefix, "");
  }
  for (let fnName of fnNames) {
    if (propertyValue.indexOf(fnName) != -1) {
      propertyValue = propertyValue.split(fnName).join("");
    }
  }
  set.add(propertyValue);
}

// src/expressions/code-factories/translate.js
async function translateFactory(exp) {
  if (exp?.length > 0 && exp.indexOf("&{") == -1)
    return exp;
  return replaceTranslation(exp.split("")).join("");
}
function replaceTranslation(expArray) {
  const start = expArray.indexOf("&");
  if (start == -1 || expArray[start + 1] != "{")
    return expArray;
  const end = expArray.indexOf("}", start);
  const exp = expArray.slice(start + 2, end).join("");
  const code = ["${await crs.binding.translations.get('", exp.replace("context.", ""), "')}"].join("");
  expArray.splice(start, exp.length + 3, code);
  return replaceTranslation(expArray);
}

// src/expressions/compiler.js
async function compile(exp, parameters, options) {
  const ctxName = options?.ctxName || "context";
  const key = `${ctxName}:${exp}`;
  if (crs.binding.functions.has(key)) {
    const result2 = crs.binding.functions.get(key);
    result2.count += 1;
    return result2;
  }
  parameters = parameters || [];
  const sanitize2 = options?.sanitize ?? true;
  let san;
  let src = exp;
  if (sanitize2 == true) {
    san = await crs.binding.expression.sanitize(exp, ctxName);
    src = san.isLiteral === true ? ["return `", san.expression, "`"].join("") : ["return ", san.expression].join("");
  } else {
    san = {
      expression: exp
    };
  }
  const result = {
    key,
    function: new crs.classes.AsyncFunction(ctxName, ...parameters, src),
    parameters: san,
    count: 1
  };
  crs.binding.functions.set(key, result);
  return result;
}
function release(exp) {
  if (exp == null || typeof exp != "object")
    return;
  const key = exp.key;
  if (crs.binding.functions.has(key)) {
    const x = crs.binding.functions.get(key);
    x.count -= 1;
    if (x.count == 0) {
      crs.binding.utils.disposeProperties(x);
      crs.binding.functions.delete(key);
    }
  }
}

// src/utils/dispose-properties.js
var ignoreDispose = ["_element"];
function disposeProperties(obj) {
  if (obj == null || obj.autoDispose == false)
    return;
  if (typeof obj != "object")
    return;
  if (Object.isFrozen(obj))
    return;
  if (Array.isArray(obj)) {
    return disposeArray(obj);
  }
  if (obj.constructor.name === "Set" || obj.constructor.name === "Map") {
    return disposeMapSet(obj);
  }
  const properties = Object.getOwnPropertyNames(obj).filter((name) => ignoreDispose.indexOf(name) == -1);
  for (let property of properties) {
    let pObj = obj[property];
    if (typeof pObj == "object") {
      if (Array.isArray(pObj)) {
        disposeArray(pObj);
      } else if (pObj.constructor.name === "Set" || pObj.constructor.name === "Map") {
        disposeMapSet(pObj);
      } else {
        if (pObj.dispose != null) {
          pObj.dispose();
        }
        disposeProperties(pObj);
      }
    }
    try {
      pObj = null;
      delete obj[property];
    } catch {
    }
  }
}
function disposeArray(array) {
  if (array.length === 0)
    return;
  for (const item of array) {
    disposeProperties(item);
  }
  array = null;
}
function disposeMapSet(obj) {
  obj.forEach((item) => disposeProperties(item));
  obj.clear();
  obj = null;
}

// src/utils/get-value-on-path.js
function getValueOnPath(obj, path) {
  if (obj == null || (path || "").length == 0)
    return;
  if (path.indexOf(".") == -1) {
    return obj[path];
  }
  const parts = path.split(".");
  const property = parts.pop();
  for (const part of parts) {
    obj = obj[part];
    if (obj == null)
      return null;
  }
  return obj[property];
}

// src/utils/get-path-of-file.js
function getPathOfFile(file) {
  if (file == null)
    return;
  if (file.endsWith("/"))
    return file;
  const parts = file.split("/");
  parts.pop();
  return `${parts.join("/")}/`;
}

// src/utils/set-value-on-path.js
function setValueOnPath(obj, path, value) {
  if (obj == null || (path || "").length == 0)
    return;
  const parts = path.split(".");
  const field = parts.pop();
  for (const part of parts) {
    obj = obj[part] ||= {};
  }
  obj[field] = value;
}

// src/managers/translations-manager.js
var TranslationsManager = class {
  #dictionary = {};
  async add(obj, context) {
    flattenPropertyPath(context || "", obj, this.#dictionary);
  }
  async delete(context) {
    const filterKey = `${context}.`;
    const keys = Object.keys(this.#dictionary).filter((item) => item.indexOf(filterKey) === 0);
    for (let key of keys) {
      delete this.#dictionary[key];
    }
  }
  async parseElement(element) {
    if (element.children.length == 0 && element.textContent.indexOf("&{") != -1) {
      element.textContent = await this.get_with_markup(element.textContent.trim());
    }
    for (let attribute of element.attributes || []) {
      await this.parseAttribute(attribute);
    }
    for (let child of element.children || []) {
      await this.parseElement(child);
    }
  }
  async parseAttribute(attribute) {
    if (attribute.value.indexOf("&{") !== -1) {
      attribute.value = await this.get_with_markup(attribute.value);
    }
  }
  async get(key) {
    let result = this.#dictionary[key];
    if (result != null) {
      return result;
    }
    result = this.fetch == null ? null : await this.fetch(key);
    if (result != null) {
      this.#dictionary[key] = result;
    }
    return result;
  }
  async get_with_markup(key) {
    key = key.split("&{").join("").split("}").join("");
    return await this.get(key);
  }
};
function flattenPropertyPath(prefix, obj, target) {
  if (typeof obj === "string") {
    if (prefix[0] === ".") {
      prefix = prefix.substring(1);
    }
    target[prefix] = obj;
  } else {
    const keys = Object.keys(obj);
    for (let key of keys) {
      flattenPropertyPath(`${prefix}.${key}`, obj[key], target);
    }
  }
}

// src/utils/mark-element.js
function markElement(element, context) {
  if (element["__uuid"])
    return element["__uuid"];
  const bid = context.bid;
  if (element["__uuid"] == null) {
    element["__uuid"] ||= crypto.randomUUID();
    crs.binding.elements[element["__uuid"]] = element;
  }
  element["__bid"] ||= bid;
  context.boundElements ||= /* @__PURE__ */ new Set();
  context.boundElements.add(element["__uuid"]);
  return element["__uuid"];
}
function unmarkElement(element) {
  if (element.nodeName === "STYLE")
    return;
  if (element.children.length > 0) {
    unmarkElements(element.children);
  }
  const uuid = element["__uuid"];
  if (uuid == null)
    return;
  crs.binding.providers.clear(uuid).catch((error) => console.error(error));
  if (crs.binding.elements[uuid]) {
    delete crs.binding.elements[uuid];
  }
  crs.binding.utils.disposeProperties(element);
}
function unmarkElements(elements) {
  for (const element of elements) {
    unmarkElement(element);
  }
}

// src/events/dom-events.js
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

// src/managers/templates-manager.js
var TemplatesManager = class {
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
};

// src/store/template-inflation-store.js
var TemplateInflationStore = class {
  #store = {};
  add(name, template, fn) {
    this.#store[name] = {
      template,
      fn
    };
  }
  get(name) {
    return this.#store[name];
  }
  remove(name) {
    const item = this.#store[name];
    delete this.#store[name];
    item.template = null;
    item.fn = null;
  }
};

// src/idle/idleCallback.js
globalThis.requestIdleCallback = globalThis.requestIdleCallback || function(cb) {
  const start = Date.now();
  return setTimeout(function() {
    cb({
      didTimeout: false,
      timeRemaining: function() {
        return Math.max(0, 50 - (Date.now() - start));
      }
    });
  }, 1);
};
globalThis.cancelIdleCallback = globalThis.cancelIdleCallback || function(id) {
  clearTimeout(id);
};

// src/idle/idleTaskManager.js
var IdleTaskManager = class {
  #list = [];
  constructor() {
    this.processing = false;
  }
  dispose() {
    this.#list = null;
  }
  async #processQueue() {
    this.processing = true;
    try {
      requestIdleCallback(async () => {
        while (this.#list.length > 0) {
          const fn = this.#list.shift();
          try {
            await fn();
          } catch (e) {
            console.error(e);
          }
        }
      }, { timeout: 1e3 });
    } finally {
      this.processing = false;
    }
  }
  async add(fn) {
    if (typeof fn != "function")
      return;
    if (requestIdleCallback == null)
      return await fn();
    this.#list.push(fn);
    if (this.processing == true)
      return;
    await this.#processQueue();
  }
};

// src/store/event-store.js
var EventStore = class {
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
};
function getTargets(event) {
  return event.composedPath().filter((element) => element["__uuid"] != null);
}

// src/utils/converter-parts.js
function getConverterParts(exp) {
  const result = {
    path: exp.trim()
  };
  clean(result);
  parseConverter(result);
  parseParameter(result);
  return result;
}
function clean(result) {
  if (result.path[0] == "$" && result.path[1] == "{") {
    result.path = result.path.substring(2, result.path.length - 1);
  }
}
function parseConverter(result) {
  const parts = subDivide(result.path, ":");
  result.path = parts[0];
  result.converter = parts[1];
}
function parseParameter(result) {
  const index1 = result.converter.indexOf("(");
  const index2 = result.converter.indexOf(")");
  const parameter = result.converter.substring(index1 + 1, index2).split("'").join('"');
  const converter = result.converter.substring(0, index1);
  const postExp = result.converter.substring(index2 + 1, result.converter.length);
  result.converter = converter;
  result.parameter = parameter.length == 0 ? null : JSON.parse(parameter);
  result.postExp = postExp;
}
function subDivide(str, sep) {
  const index = str.indexOf(sep);
  const result = [];
  result.push(str.substring(0, index));
  result.push(str.substring(index + 1, str.length));
  return result;
}

// src/utils/relative-path.js
function relativePathFrom(source, target) {
  const folder = getPathOfFile2(source);
  const processParts = ["", "."];
  const targetParts = target.split("./");
  const sourceParts = folder.split("/");
  sourceParts.pop();
  let count = 0;
  for (let i = 0; i < targetParts.length; i++) {
    const str = targetParts[i];
    if (processParts.indexOf(str) === -1) {
      break;
    }
    if (str == ".") {
      sourceParts.pop();
    }
    count += 1;
  }
  targetParts.splice(0, count);
  const targetStr = targetParts.join("/");
  const sourceStr = sourceParts.join("/");
  return `${sourceStr}/${targetStr}`;
}
function getPathOfFile2(file) {
  if (file == null)
    return file;
  if (file[file.length - 1] == "/") {
    return file;
  }
  const parts = file.split("/");
  parts.pop();
  return `${parts.join("/")}/`;
}

// src/store/template-provider-store.js
var TemplateProviderStore = class {
  #keys = [];
  #items = {};
  add(key, fn) {
    this.#keys.push(key);
    this.#items[key] = fn;
  }
  remove(key) {
    this.#keys.splice(this.#keys.indexOf(key), 1);
    delete this.#items[key];
  }
  async executeTemplateAction(element, context) {
    if (element.attributes.length === 0)
      return;
    for (const key of this.#keys) {
      if (element.getAttribute(key) != null) {
        const fn = this.#items[key];
        await fn(element, context);
      }
    }
  }
};

// src/crs-binding.js
globalThis.GLOBALS = "$globals.";
globalThis.crs ||= {};
globalThis.crs.classes ||= {};
globalThis.crs.classes.AsyncFunction = Object.getPrototypeOf(async function() {
}).constructor;
globalThis.crs.binding = {
  root: import.meta.url.replace("/crs-binding.js", ""),
  idleTaskManager: new IdleTaskManager(),
  eventStore: new EventStore(),
  templateProviders: new TemplateProviderStore(),
  ignore: ["TEMPLATE", "SCRIPT", "STYLE"],
  ignoreChildren: ["PERSPECTIVE-ELEMENT"],
  data: new BindingData(),
  translations: new TranslationsManager(),
  functions: /* @__PURE__ */ new Map(),
  elements: {},
  dom: {
    enableEvents,
    disableEvents
  },
  providers: new Providers(
    {
      "^style..*.if$": "$root/providers/attributes/style-if.js",
      "^style..*.case$": "$root/providers/attributes/style-case.js",
      "^(keydown|keyup)..+..*$": "$root/providers/events/keyboard-event.js",
      "classlist.if": "$root/providers/attributes/classlist-if.js",
      "classlist.case": "$root/providers/attributes/classlist-case.js",
      ".bind": "$root/providers/properties/bind.js",
      ".two-way": "$root/providers/properties/bind.js",
      ".one-way": "$root/providers/properties/one-way.js",
      ".once": "$root/providers/properties/once.js",
      ".setvalue": "$root/providers/attributes/set-value.js",
      ".attr": "$root/providers/attributes/attr.js",
      ".if": "$root/providers/attributes/attr-if.js",
      ".case": "$root/providers/attributes/attr-case.js",
      "style.": "$root/providers/attributes/style-property.js",
      "ref": "$root/providers/attributes/ref.js",
      ".call": "$root/providers/attributes/call.js",
      ".emit": "$root/providers/attributes/emit.js",
      ".post": "$root/providers/attributes/post.js",
      ".process": "$root/providers/attributes/process.js"
    },
    {
      "template[for]": "$root/providers/element/template-repeat-for.js",
      "template[src]": "$root/providers/element/template-src.js",
      "template": "$root/providers/element/template.js"
    }
  ),
  parsers: {
    parseElement,
    parseElements,
    parseAttribute,
    parseAttributes
  },
  expression: {
    sanitize,
    compile,
    release,
    translateFactory
  },
  utils: {
    disposeProperties,
    getValueOnPath,
    setValueOnPath,
    getPathOfFile,
    markElement,
    unmarkElement,
    getConverterParts,
    relativePathFrom
  },
  inflation: {
    store: new TemplateInflationStore()
  },
  templates: new TemplatesManager()
};
Object.defineProperty(globalThis.crs.binding, "$global", {
  value: 0,
  writable: false
});
await crs.binding.providers.addTextProvider("$root/providers/text/text.js");
/**
 * @file crs-binding.js - This is the main file of the binding engine.
 * All the core features are defined here and exported to the global scope.
 *
 * @version 1.0.0
 * @license MIT for free and opensource software
 */
