class ValueConvertersManager {
  constructor() {
    this._converters = /* @__PURE__ */ new Map();
  }
  add(key, converter) {
    this._converters.set(key, converter);
  }
  get(key) {
    return this._converters.get(key);
  }
  remove(key) {
    this._converters.delete(key);
  }
  convert(value, key, direction, args) {
    const converter = this._converters.get(key);
    if (converter == null)
      return null;
    return converter[direction](value, args);
  }
}
crs.binding.valueConvertersManager = new ValueConvertersManager();
export {
  ValueConvertersManager
};
