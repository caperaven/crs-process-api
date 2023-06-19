class TemplateSrcProvider {
  async parse(element, context) {
    crs.binding.utils.unmarkElement(element);
    const path = await getPath(element, context);
    const content = await fetch(path).then((result) => result.text());
    const template = document.createElement("template");
    template.innerHTML = content;
    const newContent = template.content.cloneNode(true);
    await crs.binding.translations.parseElement(newContent);
    element.replaceWith(newContent);
  }
}
async function getPath(element, context) {
  const path = element.getAttribute("src");
  if (path.indexOf("$context") === -1) {
    return path;
  }
  const parts = path.split("/");
  const property = parts[0].replace("$context.", "");
  const value = await crs.binding.data.getProperty(context, property);
  parts[0] = value;
  return parts.join("/");
}
export {
  TemplateSrcProvider as default
};
