function createEventParameters(event, exp) {
  const args = {};
  const params = exp.split(",");
  for (const param of params) {
    const parameter = param.trim();
    switch (parameter) {
      case "$event": {
        args["event"] = parameter;
        break;
      }
      case "$context": {
        args["context"] = parameter;
        break;
      }
      default: {
        const parts = parameter.split("=");
        args[parts[0].trim()] = parts[1].trim().replaceAll("'", "");
        break;
      }
    }
  }
  return { event, args };
}
function createEventPacket(intent, event) {
  const data = intent.args;
  const args = {};
  const target = event.composedPath()[0];
  const bid = target["__bid"];
  for (const tuple of Object.entries(data)) {
    if (tuple[1] === "$event") {
      args["event"] = event;
      continue;
    }
    if (tuple[1] === "$context") {
      const context = crs.binding.data.getContext(bid);
      args["context"] = context;
      continue;
    }
    let exp = tuple[1];
    let value = exp;
    if (exp.startsWith("${")) {
      exp = exp.replace("${", "").replace("}", "");
      value = crs.binding.data.getProperty(bid, exp);
    }
    args[tuple[0]] = value;
  }
  return args;
}
export {
  createEventPacket,
  createEventParameters
};
