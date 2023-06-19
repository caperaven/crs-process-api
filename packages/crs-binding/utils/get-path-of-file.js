function getPathOfFile(file) {
  if (file == null)
    return;
  if (file.endsWith("/"))
    return file;
  const parts = file.split("/");
  parts.pop();
  return `${parts.join("/")}/`;
}
export {
  getPathOfFile
};
