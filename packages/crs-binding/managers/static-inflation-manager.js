import "./../expressions/code-factories/if.js";
import "./../expressions/code-factories/case.js";
class StaticInflationManager {
  async inflateElements(elements, context) {
    for (const element of elements) {
      await this.inflateElement(element, context);
    }
  }
  async inflateElement(element, context) {
    await this.#parseTextContent(element, context);
    await this.#parseAttributes(element, context);
    await this.inflateElements(element.children, context);
  }
  async #parseTextContent(element, context) {
    if (element.children.length > 0)
      return;
    if (element.textContent.indexOf("&{") != -1) {
      return element.textContent = await crs.binding.translations.get_with_markup(element.textContent);
    }
    if (element.textContent.indexOf("${") != -1) {
      const sanitized = await crs.binding.expression.sanitize(element.textContent);
      const code = sanitized.expression;
      const fn = new Function("context", ["return ", "`", code, "`"].join(""));
      element.textContent = fn(context);
    }
  }
  async #parseAttributes(element, context) {
    for (const attribute of element.attributes) {
      await this.#parseAttribute(attribute, context);
    }
  }
  async #parseAttribute(attribute, context) {
    if (attribute.name.indexOf(".attr") != -1) {
      return this.#attributeAttr(attribute, context);
    }
    let fn;
    if (attribute.name.indexOf(".if") != -1) {
      fn = await crs.binding.expression.ifFactory(attribute.value);
    } else if (attribute.name.indexOf(".case") != -1) {
      fn = await crs.binding.expression.caseFactory(attribute.value);
    }
    if (fn != null) {
      const value = await fn.function(context);
      if (attribute.name.indexOf("classlist.") != -1) {
        return await this.#attrClassList(attribute, value);
      }
      if (attribute.name.indexOf("style.") != -1) {
        return await this.#attrStyle(attribute, value);
      }
      await this.#attrIf(attribute, value);
      attribute.ownerElement.removeAttribute(attribute.name);
    }
    fn = null;
  }
  async #attrIf(attribute, value) {
    const attr = attribute.name.replace(".if", "").replace(".case", "");
    if (attribute.value.indexOf("?") == -1) {
      if (value) {
        attribute.ownerElement.setAttribute(attr, value);
      } else {
        attribute.ownerElement.removeAttribute(attr);
      }
      return;
    }
    if (value == void 0) {
      attribute.ownerElement.removeAttribute(attr);
    } else {
      attribute.ownerElement.setAttribute(attr, value);
    }
  }
  async #attrStyle(attribute, value) {
    const prop = attribute.name.split(".")[1];
    attribute.ownerElement.style[prop] = value || "";
  }
  async #attrClassList(attribute, value) {
    attribute.ownerElement.classList.add(value);
  }
  async #attributeAttr(attribute, context) {
    const name = attribute.name.replace(".attr", "");
    const code = crs.binding.expression.sanitize(attribute.value).expression;
    const fn = new Function("context", ["return ", "`", code, "`"].join(""));
    const value = fn(context);
    attribute.ownerElement.setAttribute(name, value);
  }
}
crs.binding.staticInflationManager = new StaticInflationManager();
export {
  StaticInflationManager
};
