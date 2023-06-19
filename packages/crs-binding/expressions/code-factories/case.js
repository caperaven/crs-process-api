async function caseFactory(exp, ctxName = "context") {
  const key = `${ctxName}:${exp}`;
  if (crs.binding.functions.has(key)) {
    const result2 = crs.binding.functions.get(key);
    result2.count += 1;
    return result2;
  }
  const code = [];
  const expo = await crs.binding.expression.sanitize(exp);
  exp = sanitizeArrays(expo.expression);
  const parts = exp.split(",");
  for (let part of parts) {
    const expParts = part.split(":").map((item) => item.trim());
    if (expParts[0] == "context.default") {
      code.push(`return ${expParts[1]};`);
    } else {
      code.push(`if (${expParts[0]}) {`);
      code.push(`    return ${expParts[1]};`);
      code.push("}");
    }
  }
  const result = {
    key,
    function: new crs.classes.AsyncFunction(ctxName, code.join("\r").replaceAll("@", ",")),
    parameters: expo,
    count: 1
  };
  crs.binding.functions.set(key, result);
  return result;
}
function sanitizeArrays(exp) {
  if (exp.indexOf("[") == -1) {
    return exp;
  }
  const code = [];
  const parts = exp.split("[");
  for (const part of parts) {
    if (part.indexOf("]") == -1) {
      code.push(part);
      continue;
    }
    const subParts = part.split("]");
    const array = `[${subParts[0].replaceAll(",", "@")}] ${subParts[1]}`;
    code.push(array);
  }
  return code.join("");
}
crs.binding.expression.caseFactory = caseFactory;
export {
  caseFactory
};
