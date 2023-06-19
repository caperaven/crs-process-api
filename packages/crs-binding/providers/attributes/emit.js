import "./../../events/event-emitter.js";
import { createEventPacket, createEventParameters } from "./utils/create-event-parameters.js";
import { parseEvent } from "./utils/parse-event.js";
class EmitProvider {
  async onEvent(event, bid, intent) {
    await emit(intent.value, event);
  }
  async parse(attr, context) {
    parseEvent(attr, this.getIntent);
  }
  getIntent(attrValue) {
    const parts = attrValue.split("(");
    const event = parts[0];
    if (parts.length === 1)
      return { provider: ".emit", value: { event, args: {} } };
    parts[1] = parts[1].replace(")", "");
    const value = createEventParameters(event, parts[1]);
    return { provider: ".emit", value };
  }
  async clear(uuid) {
    crs.binding.eventStore.clear(uuid);
  }
}
function emit(intent, event) {
  const args = createEventPacket(intent, event);
  crs.binding.events.emitter.emit(intent.event, args).catch((error) => console.error(error));
}
export {
  EmitProvider as default
};
