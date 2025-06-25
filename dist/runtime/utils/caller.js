import path from "path";
import { resolveAppPath } from "../instances/path.js";
export function getCallerFile(appDirname) {
  let filePath;
  const prepareStackTrace = Error.prepareStackTrace;
  Error.prepareStackTrace = (_, stack) => stack;
  try {
    const error = new Error();
    const dirPath = resolveAppPath(appDirname);
    while (error.stack.length) {
      const caller = error.stack.shift().getFileName();
      const callerDir = path.dirname(caller);
      if (callerDir === dirPath) {
        filePath = caller;
        break;
      }
    }
  } catch {
  }
  Error.prepareStackTrace = prepareStackTrace;
  return filePath;
}
