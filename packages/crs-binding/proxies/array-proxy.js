import "./../utils/dom-collection-manager.js";
class ArrayProxyFunctions {
  static push(...items) {
    this.push(...items);
    updateDom.call(this, (uuid) => {
      crs.binding.dom.collection.append(uuid, ...items);
    });
  }
  static splice(start, deleteCount, ...items) {
    this.splice(start, deleteCount, ...items);
    updateDom.call(this, (uuid) => {
      crs.binding.dom.collection.splice(uuid, start, deleteCount, ...items);
    });
  }
  static shift() {
    this.shift();
    updateDom.call(this, (uuid) => {
      crs.binding.dom.collection.shift(uuid);
    });
  }
  static pop() {
    this.pop();
    updateDom.call(this, (uuid) => {
      crs.binding.dom.collection.pop(uuid);
    });
  }
}
function updateDom(callback) {
  const bid = this["__bid"];
  const property = this["__property"];
  if (bid == null || property == null)
    return;
  const uuids = crs.binding.data.getCallbacks(bid, property);
  for (const uuid of uuids) {
    callback(uuid);
  }
}
const arrayHandler = {
  get(target, prop, receiver) {
    if (ArrayProxyFunctions[prop]) {
      return ArrayProxyFunctions[prop].bind(target);
    }
    return target[prop];
  }
};
function wrapArrayForUpdate(array) {
  return new Proxy(array, arrayHandler);
}
export {
  wrapArrayForUpdate as default
};
