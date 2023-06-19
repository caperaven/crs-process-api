async function inflationFactory(element, ctxName = "context") {
  const code = [];
  const preCode = [];
  if (element.nodeName === "TEMPLATE") {
    element = element.content.cloneNode(true).firstElementChild;
  }
  if (element.nodeName != "#document-fragment") {
    await attributes("element", element, preCode, code, ctxName);
  }
  if (element.children.length === 0) {
    await textContent("element", element, code, ctxName);
  } else {
    await children("element", element, preCode, code, ctxName);
  }
  return new Function("element", ctxName, [...preCode, ...code].join("\n"));
}
async function textContent(path, element, code, ctxName) {
  const exp = await crs.binding.expression.sanitize(element.textContent.trim(), ctxName);
  code.push([path, ".textContent = `", exp.expression, "`;"].join(""));
}
async function children(path, element, preCode, code, ctxName) {
  for (let i = 0; i < element.children.length; i++) {
    const child = element.children[i];
    if (child.children.length > 0) {
      await children(`${path}.children[${i}]`, child, preCode, code, ctxName);
    } else {
      const exp = await crs.binding.expression.sanitize(child.textContent.trim(), ctxName);
      code.push([path, ".children", `[${i}].textContent = `, "`", exp.expression, "`;"].join(""));
    }
    await attributes(`${path}.children[${i}]`, element.children[i], preCode, code, ctxName);
  }
}
async function attributes(path, element, preCode, code, ctxName) {
  if (element instanceof DocumentFragment)
    return;
  for (const attr of element.attributes) {
    if (attr.nodeValue.indexOf("${") != -1) {
      preCode.push(`${path}.removeAttribute("${attr.nodeName}");`);
      const exp = await crs.binding.expression.sanitize(attr.nodeValue.trim(), ctxName);
      code.push([`${path}.setAttribute("${attr.nodeName}",`, "`", exp.expression, "`", ");"].join(""));
    } else if (attr.nodeName.indexOf("style.") != -1) {
      await styles(attr, path, preCode, code, ctxName);
    } else if (attr.nodeName.indexOf("classlist.case") != -1) {
      await classListCase(attr, path, preCode, code, ctxName);
    } else if (attr.nodeName.indexOf("classlist.if") != -1) {
      await classListIf(attr, path, preCode, code, ctxName);
    } else if (attr.nodeName.indexOf(".if") != -1) {
      await ifAttribute(attr, path, preCode, code, ctxName);
    } else if (attr.nodeName.indexOf(".attr") != -1 || attr.nodeName.indexOf(".one-way") != -1) {
      await attrAttribute(attr, path, preCode, code, ctxName);
    }
  }
}
async function classListCase(attr, path, preCode, code, ctxName) {
  const exp = await crs.binding.expression.sanitize(attr.nodeValue.trim(), ctxName);
  const codeParts = exp.expression.split(",");
  const classes = [];
  for (const line of codeParts) {
    const lineParts = line.split("?");
    const condition = lineParts[0].trim();
    const values = (lineParts[1] || lineParts[0]).split(":");
    classes.push(...values);
    code.push(`if (${condition}) {`);
    code.push(`    ${path}.classList.add(${values[0].trim()});`);
    code.push(`}`);
    if (values.length > 1) {
      code.push(`else {`);
      code.push(`    ${path}.classList.add(${values[0].trim()});`);
      code.push(`}`);
    }
  }
  preCode.push(`${path}.classList.remove(${classes.join(",")});`);
}
async function classListIf(attr, path, preCode, code, ctxName) {
  const parts = attr.nodeValue.split("?")[1].split(":");
  preCode.push(`${path}.classList.remove(${parts.join(",")});`);
  const exp = await crs.binding.expression.sanitize(attr.nodeValue.trim(), ctxName);
  code.push([`${path}.classList.add(`, exp.expression, ");"].join(""));
}
async function ifAttribute(attr, path, preCode, code, ctxName) {
  preCode.push(`${path}.removeAttribute("${attr.nodeName}");`);
  const exp = await crs.binding.expression.sanitize(attr.nodeValue.trim(), ctxName);
  code.push([`${path}.setAttribute("${attr.nodeName.replace(".if", "")}",`, exp.expression, ");"].join(""));
}
async function attrAttribute(attr, path, preCode, code, ctxName) {
  preCode.push(`${path}.removeAttribute("${attr.nodeName}");`);
  const exp = await crs.binding.expression.sanitize(attr.nodeValue.trim(), ctxName);
  code.push([`${path}.setAttribute("${attr.nodeName.replace(".attr", "")}",`, exp.expression, ");"].join(""));
}
async function styles(attr, path, preCode, code, ctxName) {
  const parts = attr.nodeName.split(".");
  const exp = await crs.binding.expression.sanitize(attr.nodeValue.trim(), ctxName);
  preCode.push(`${path}.style.${parts[1]} = "";`);
  if (attr.nodeName.indexOf(".case") == -1) {
    code.push([`${path}.style.${parts[1]} =`, exp.expression, ";"].join(""));
  } else {
    const codeParts = exp.expression.split(",");
    for (const line of codeParts) {
      if (line.indexOf("context.default") != -1) {
        preCode.push(`${path}.style.${parts[1]} = ${line.split(":")[1].trim()};`);
        continue;
      }
      const lineParts = line.split("?");
      const condition = lineParts[0].trim();
      const values = (lineParts[1] || lineParts[0]).split(":");
      code.push(`if (${condition}) {`);
      code.push(`    ${path}.style.${parts[1]} = ${values[0].trim()};`);
      code.push(`}`);
      if (values.length > 1) {
        code.push(`else {`);
        code.push(`    ${path}.style.${parts[1]} = ${values[1].trim()};`);
        code.push(`}`);
      }
    }
  }
}
crs.binding.expression.inflationFactory = inflationFactory;
export {
  inflationFactory
};
