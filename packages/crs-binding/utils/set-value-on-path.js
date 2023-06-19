function setValueOnPath(obj, path, value) {
  if (obj == null || (path || "").length == 0)
    return;
  const parts = path.split(".");
  const field = parts.pop();
  for (const part of parts) {
    obj = obj[part] ||= {};
  }
  obj[field] = value;
}
export {
  setValueOnPath
};
