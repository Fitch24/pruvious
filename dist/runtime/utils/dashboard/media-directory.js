import { toArray } from "../array.js";
import { parseMediaDirectoryName } from "../uploads.js";
export function addMediaDirectories(directories, tree) {
  for (const directory of toArray(directories)) {
    const parts = directory.split("/").filter(Boolean);
    let current = tree;
    for (const part of parts) {
      if (!current[part]) {
        current[part] = { children: {} };
      }
      current = current[part].children;
    }
  }
  return tree;
}
export function deleteMediaDirectories(directories, tree) {
  for (const directory of toArray(directories)) {
    const parts = directory.split("/").filter(Boolean);
    let current = tree;
    for (const [i, part] of parts.entries()) {
      if (i === parts.length - 1) {
        delete current[part];
      } else if (current[part]) {
        current = current[part].children;
      } else {
        break;
      }
    }
  }
  return tree;
}
export function listMediaDirectory(directory, tree) {
  const parts = directory.split("/").filter(Boolean);
  let current = tree;
  for (const part of parts) {
    if (current[part]) {
      current = current[part].children;
    } else {
      return null;
    }
  }
  return current;
}
export function listMediaDirectoryWithPath(directory, tree) {
  const parts = directory.split("/").filter(Boolean);
  let current = tree;
  let path = "";
  for (const part of parts) {
    if (current[part]) {
      current = current[part].children;
      path += `${part}/`;
    } else {
      return null;
    }
  }
  return Object.keys(current).map((name) => ({ name, path: parseMediaDirectoryName(`${path}/${name}`) }));
}
export function moveMediaDirectory(source, dest, tree) {
  if (parseMediaDirectoryName(source) === parseMediaDirectoryName(dest)) {
    return tree;
  }
  const sourceDirectory = listMediaDirectory(source, tree);
  if (sourceDirectory) {
    addMediaDirectories(dest, tree);
    const toDirectory = listMediaDirectory(dest, tree);
    Object.assign(toDirectory, { [source.split("/").filter(Boolean).pop()]: { children: sourceDirectory } });
    deleteMediaDirectories(source, tree);
  }
  return tree;
}
export function renameMediaDirectory(from, to, tree) {
  const fromParsed = parseMediaDirectoryName(from);
  const toParsed = parseMediaDirectoryName(to);
  const fromParent = fromParsed.slice(0, -1).split("/").slice(0, -1).join("/");
  const toParent = toParsed.slice(0, -1).split("/").slice(0, -1).join("/");
  if (fromParsed === toParsed || fromParent !== toParent) {
    return tree;
  }
  const parent = listMediaDirectory(fromParent, tree);
  if (parent) {
    const oldName = fromParsed.slice(0, -1).split("/").pop();
    const newName = toParsed.slice(0, -1).split("/").pop();
    parent[newName] = parent[oldName];
    delete parent[oldName];
  }
  return tree;
}
