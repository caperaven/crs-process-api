import { parseEvent } from "./utils/parse-event.js";
class ProcessProvider {
  async onEvent(event, bid, intent) {
    const context = await crs.binding.data.getContext(bid);
    await callProcess(intent.value, event, context);
  }
  async parse(attr) {
    parseEvent(attr, this.getIntent);
  }
  getIntent(attrValue) {
    if (attrValue.startsWith("{")) {
      return createStepIntent(attrValue);
    }
    return createSchemaIntent(attrValue);
  }
  async clear(uuid) {
    crs.binding.eventStore.clear(uuid);
  }
}
function createStepIntent(exp) {
  const parts = exp.split(",").map((item) => item.trim());
  const type = parts[0].replace("type:", "").replaceAll("'", "").replace("{", "").trim();
  const action = parts[1].replace("action:", "").replaceAll("'", "").trim();
  const argsExp = parts.slice(2).join(",");
  const args = createArgs(argsExp.slice(0, -1));
  const value = { type, action, args };
  return { provider: ".process", value };
}
function createSchemaIntent(exp) {
  const schemaParts = exp.split("[").map((item) => item.trim());
  const schema = schemaParts[0].trim();
  const stepParts = schemaParts[1].split("(").map((item) => item.trim());
  const process = stepParts[0].trim();
  const args = createArgs(`{${stepParts[1].replace(")]", "")}}`);
  const value = { schema, process, args };
  return { provider: ".process", value };
}
function createArgs(exp) {
  let trimmedString = exp.slice(1, -1).trim();
  if (trimmedString.length == 0) {
    return {};
  }
  trimmedString = markArrays(trimmedString);
  const properties = trimmedString.split(",");
  const obj = {};
  for (const property of properties) {
    const propertyParts = property.split(":").map((item) => item.trim());
    const name = propertyParts[0];
    const value = processPropertyValue(propertyParts[1]);
    obj[name] = value;
  }
  return obj;
}
function processPropertyValue(exp) {
  if (exp.startsWith("[")) {
    return exp.slice(1, -1).split("&44").map((item) => item.replaceAll("'", "").trim());
  }
  return exp;
}
function markArrays(exp, lookStart = 0) {
  if (exp.indexOf("[") === -1) {
    return exp;
  }
  let startIndex = exp.indexOf("[", lookStart);
  if (startIndex === -1) {
    return exp;
  }
  let endIndex = exp.indexOf("]", startIndex);
  const oldArray = exp.substring(startIndex, endIndex + 1);
  const newArray = oldArray.replaceAll(",", "&44");
  exp = exp.replace(oldArray, newArray);
  return markArrays(exp, endIndex + 1);
}
async function parseArgsForCalling(args, event, context) {
  const newArgs = {};
  for (const [key, value] of Object.entries(args)) {
    if (Array.isArray(value)) {
      const newArray = [];
      for (let i = 0; i < value.length; i++) {
        newArray[i] = await getValue(value[i], event, context);
      }
      newArgs[key] = newArray;
    } else {
      newArgs[key] = await getValue(value, event, context);
    }
  }
  return newArgs;
}
async function getValue(exp, event, context) {
  if (typeof exp !== "string")
    return exp;
  if (exp == "$event") {
    return event;
  }
  if (exp == "$context") {
    return context;
  }
  if (exp.startsWith("$event.")) {
    const path = exp.replace("$event.", "");
    return crs.binding.utils.getValueOnPath(event, path);
  }
  if (exp.startsWith("$context.")) {
    const path = exp.replace("$context.", "");
    return crs.binding.utils.getValueOnPath(context, path);
  }
  if (exp.startsWith("'") && exp.endsWith("'")) {
    exp = exp.slice(1, -1);
  }
  return exp;
}
async function callProcess(intent, event, context) {
  if (intent.schema != null) {
    return await callSchema(intent, event, context);
  }
  const args = await parseArgsForCalling(intent.args, event, context);
  await crs.call(intent.type, intent.action, args);
}
async function callSchema(intent, event, context) {
  const parameters = await parseArgsForCalling(intent.args, event, context);
  const args = {
    context,
    step: {
      action: intent.process,
      args: {
        schema: intent.schema
      }
    }
  };
  if (parameters != null) {
    args.parameters = parameters;
  }
  await crs.binding.events.emitter.emit("run-process", args);
}
export {
  ProcessProvider as default
};
