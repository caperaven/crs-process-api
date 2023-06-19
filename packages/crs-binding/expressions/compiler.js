async function compile(exp, parameters, options) {
  const ctxName = options?.ctxName || "context";
  const key = `${ctxName}:${exp}`;
  if (crs.binding.functions.has(key)) {
    const result2 = crs.binding.functions.get(key);
    result2.count += 1;
    return result2;
  }
  parameters = parameters || [];
  const sanitize = options?.sanitize ?? true;
  let san;
  let src = exp;
  if (sanitize == true) {
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
export {
  compile,
  release
};
