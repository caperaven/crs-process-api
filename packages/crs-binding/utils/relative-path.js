function relativePathFrom(source, target) {
  const folder = getPathOfFile(source);
  const processParts = ["", "."];
  const targetParts = target.split("./");
  const sourceParts = folder.split("/");
  sourceParts.pop();
  let count = 0;
  for (let i = 0; i < targetParts.length; i++) {
    const str = targetParts[i];
    if (processParts.indexOf(str) === -1) {
      break;
    }
    if (str == ".") {
      sourceParts.pop();
    }
    count += 1;
  }
  targetParts.splice(0, count);
  const targetStr = targetParts.join("/");
  const sourceStr = sourceParts.join("/");
  return `${sourceStr}/${targetStr}`;
}
function getPathOfFile(file) {
  if (file == null)
    return file;
  if (file[file.length - 1] == "/") {
    return file;
  }
  const parts = file.split("/");
  parts.pop();
  return `${parts.join("/")}/`;
}
export {
  relativePathFrom
};
