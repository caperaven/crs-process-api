function getValueOnPath(obj, path) {
  if (obj == null || (path || "").length == 0)
    return;
  if (path.indexOf(".") == -1) {
    return obj[path];
  }
  const parts = path.split(".");
  const property = parts.pop();
  for (const part of parts) {
    obj = obj[part];
    if (obj == null)
      return null;
  }
  return obj[property];
}
export {
  getValueOnPath
};
