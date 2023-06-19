async function ifFactory(exp, ctxName = "context") {
  const key = `${ctxName}:${exp}`;
  if (crs.binding.functions.has(key)) {
    const result = crs.binding.functions.get(key);
    result.count += 1;
    return result;
  }
  const code = [];
  const expo = await crs.binding.expression.sanitize(exp);
  exp = expo.expression.replaceAll("context.[", "[");
  if (exp.indexOf("?") == -1) {
    return setFunction(key, expo, `return ${exp}`, ctxName);
  }
  const parts = exp.split("?").map((item) => item.trim());
  const left = parts[0];
  const right = parts[1];
  const rightParts = right.split(":");
  code.push(`if (${left}) {`);
  code.push(`    return ${rightParts[0].trim()};`);
  code.push("}");
  if (rightParts.length > 1) {
    code.push("else {");
    code.push(`    return ${rightParts[1].trim()};`);
    code.push("}");
  }
  return setFunction(key, expo, code.join("\r"), ctxName);
}
function setFunction(key, exp, src, ctxName) {
  const result = {
    key,
    function: new crs.classes.AsyncFunction(ctxName, src),
    parameters: exp,
    count: 1
  };
  crs.binding.functions.set(key, result);
  return result;
}
crs.binding.expression.ifFactory = ifFactory;
export {
  ifFactory
};
