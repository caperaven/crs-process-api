class OnceProvider {
  async parse(attr, context) {
    const parts = attr.name.split(".");
    const property = capitalizePropertyPath(parts[0]);
    const value = await crs.binding.data.getProperty(context.bid, attr.value);
    attr.ownerElement[property] = value;
    attr.ownerElement.removeAttribute(attr.name);
  }
}
function capitalizePropertyPath(str) {
  if (str.indexOf("-") == -1)
    return str;
  const parts = str.split("-");
  for (let i = 1; i < parts.length; i++) {
    parts[i] = parts[i].capitalize();
  }
  let result = parts.join("");
  if (result === "innerHtml") {
    result = "innerHTML";
  }
  return result;
}
export {
  OnceProvider as default
};
