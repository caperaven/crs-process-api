import "./../validation/validation-ui.js";
class DataDefStore {
  #store = {};
  #valueAutomation = {};
  #validationAutomation = {};
  #defaultAutomationMap = {};
  #validationAutomationMap = {};
  get store() {
    return this.#store;
  }
  #addAutomationMap(map, bid, path, field, property) {
    let obj = map[bid];
    property = property.replace("$context.", "context.");
    obj[property] ||= /* @__PURE__ */ new Set();
    obj[property].add(`${path}.${field}`);
  }
  async #parseDefinition(bid, def) {
    const path = def.name;
    for (const field of Object.keys(def.fields)) {
      const fieldDef = def.fields[field];
      await this.#parseConditionalDefaults(fieldDef, bid, path, field);
      await this.#parseConditionalValidations(fieldDef, bid, path, field);
    }
  }
  async #parseConditionalDefaults(fieldDef, bid, path, field) {
    if (fieldDef.conditionalDefaults != null) {
      for (const conditionalDefault of fieldDef.conditionalDefaults) {
        const expo = await crs.binding.expression.sanitize(conditionalDefault.conditionExpr);
        for (let property of expo.properties) {
          this.#addAutomationMap(this.#defaultAutomationMap, bid, path, field, property);
        }
        const code = `
                    const context = crs.binding.data.getData(bid).data;
                    return ${expo.expression}
                    `;
        const fn = new crs.classes.AsyncFunction("bid", code);
        this.addDefaultsAutomation(bid, path, field, fn, conditionalDefault.value, conditionalDefault.true_value, conditionalDefault.false_value);
      }
    }
    delete fieldDef.conditionalDefaults;
  }
  async #parseDefaultValidations(fieldDef, bid, path, field) {
    if (fieldDef.defaultValidations != null) {
      for (const key of Object.keys(fieldDef.defaultValidations)) {
        const rule = key;
        const def = fieldDef.defaultValidations[key];
        const fieldPath = `${path}.${field}`.replace("context.", "");
        crs.binding.ui.apply(bid, fieldPath, rule, def);
      }
    }
    delete fieldDef.defaultValidations;
  }
  async #parseConditionalValidations(fieldDef, bid, path, field) {
    if (fieldDef.conditionalValidations != null) {
      for (const conditionalValidation of fieldDef.conditionalValidations) {
        const expo = await crs.binding.expression.sanitize(conditionalValidation.conditionExpr);
        for (let property of expo.properties) {
          this.#addAutomationMap(this.#validationAutomationMap, bid, path, field, property);
        }
        const code = `
                    const context = crs.binding.data.getData(bid).data;
                    return ${expo.expression}
                    `;
        const fn = new crs.classes.AsyncFunction("bid", code);
        const def = [];
        for (const rule of Object.keys(conditionalValidation.rules)) {
          const validationRule = conditionalValidation.rules[rule];
          const value = validationRule.value;
          const required = validationRule.required || true;
          def.push({ rule, value, required });
        }
        this.addValidationAutomation(bid, path, field, fn, def);
      }
    }
    delete fieldDef.conditionalValidations;
  }
  async register(bid, def) {
    def = JSON.parse(JSON.stringify(def));
    const nameParts = def.name.split(".");
    let store = this.#store[bid] ||= {};
    let valueAutomation = this.#valueAutomation[bid] ||= {};
    this.#defaultAutomationMap[bid] ||= {};
    this.#validationAutomationMap[bid] ||= {};
    this.#validationAutomation[bid] ||= {};
    for (let i = 0; i < nameParts.length; i++) {
      if (i < nameParts.length - 1) {
        store = store[nameParts[i]] ||= {};
      }
      valueAutomation = valueAutomation[nameParts[i]] ||= {};
    }
    const name = nameParts[nameParts.length - 1];
    store[name] = def;
    await this.#parseDefinition(bid, def);
  }
  async unRegister(bid) {
    delete this.#store[bid];
    delete this.#valueAutomation[bid];
    delete this.#defaultAutomationMap[bid];
    delete this.#validationAutomationMap[bid];
    delete this.#validationAutomation[bid];
  }
  addDefaultsAutomation(bid, path, field, fn, value, trueValue, falseValue) {
    let obj = this.#valueAutomation[bid];
    for (const prop of path.split(".")) {
      obj = obj[prop];
    }
    const collection = obj[field] ||= [];
    const newItem = { condition: fn };
    if (value != null) {
      newItem.value = value;
    }
    if (trueValue != null) {
      newItem.trueValue = trueValue;
    }
    if (falseValue != null) {
      newItem.falseValue = falseValue;
    }
    collection.push(newItem);
  }
  addValidationAutomation(bid, path, field, fn, def) {
    const propertyPath = `${path}.${field}`.replace("context.", "");
    let obj = this.#validationAutomation[bid];
    let collection = obj[propertyPath] ||= [];
    collection.push({ condition: fn, def });
  }
  removeAutomation(name, field) {
    delete this.#valueAutomation[name][field];
  }
  remove(bid) {
    delete this.#store[bid];
    delete this.#valueAutomation[bid];
    delete this.#defaultAutomationMap[bid];
  }
  async automateValues(bid, fieldPath) {
    if (this.#defaultAutomationMap[bid] == null)
      return;
    if (fieldPath.indexOf(".") == -1) {
      fieldPath = `context.${fieldPath}`;
    }
    const contextMap = this.#defaultAutomationMap[bid][fieldPath];
    if (contextMap == null)
      return;
    for (const path of contextMap) {
      let definition = this.#valueAutomation[bid];
      const pathParts = path.split(".");
      for (const pathPart of pathParts) {
        definition = definition[pathPart];
      }
      for (const item of definition) {
        const result = await item.condition(bid);
        const trueValue = item.value || item.trueValue;
        if (result == true) {
          await crs.binding.data.setProperty(bid, path, trueValue);
        } else if (item.falseValue != null) {
          await crs.binding.data.setProperty(bid, path, item.falseValue);
        }
      }
    }
  }
  async automateValidations(bid, fieldPath) {
    if (this.#validationAutomationMap[bid] == null)
      return;
    const automationFields = this.#validationAutomationMap[bid][fieldPath];
    if (automationFields == null)
      return;
    for (const field of automationFields) {
      const definitions = this.#validationAutomation[bid][field];
      for (const def of definitions) {
        const addRules = await def.condition(bid);
        for (const ruleDef of def.def) {
          ruleDef.required = addRules;
          await crs.binding.ui.apply(bid, field, ruleDef.rule, ruleDef);
        }
      }
    }
  }
  async create(bid, property) {
    let def = this.#store[bid];
    const pathParts = property.split(".");
    for (const pathPart of pathParts) {
      def = def[pathPart];
    }
    const model = {};
    for (const fieldName of Object.keys(def.fields)) {
      model[fieldName] = def.fields[fieldName].default || null;
    }
    await crs.binding.data.setProperty(bid, property, model);
  }
  validate(bid, property, name) {
  }
  async applyValidations(bid) {
    const definitions = this.#store[bid];
    for (const defKey of Object.keys(definitions)) {
      const def = definitions[defKey];
      const path = def.name;
      for (const field of Object.keys(def.fields)) {
        const fieldDef = def.fields[field];
        await this.#parseDefaultValidations(fieldDef, bid, path, field);
      }
    }
  }
}
crs.binding.dataDef = new DataDefStore();
export {
  DataDefStore
};
