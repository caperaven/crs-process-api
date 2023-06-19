import { parseEvent } from "./utils/parse-event.js";
class CallProvider {
  async onEvent(event, bid, intent) {
    await execute(bid, intent.value, event);
  }
  async parse(attr) {
    parseEvent(attr, this.getIntent);
  }
  getIntent(attrValue) {
    return { provider: ".call", value: attrValue };
  }
  async clear(uuid) {
    crs.binding.eventStore.clear(uuid);
  }
}
async function execute(bid, expr, event) {
  const context = crs.binding.data.getContext(bid);
  if (context == null)
    return;
  const parts = expr.replace(")", "").split("(");
  const fn = parts[0];
  const args = parts.length == 1 ? [event] : processArgs(parts[1], event);
  await context[fn].call(context, ...args);
}
function processArgs(expr, event) {
  const args = [];
  const parts = expr.split(",");
  for (let part of parts) {
    part = part.trim();
    if (part === "$event") {
      args.push(event);
    } else if (Number.isNaN(part) == true) {
      args.push(Number(part));
    } else {
      args.push(part);
    }
  }
  return args;
}
export {
  CallProvider as default
};
