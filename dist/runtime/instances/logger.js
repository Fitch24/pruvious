import { cyan, green, red, underline, yellow } from "colorette";
import { consola } from "consola";
import { clearArray } from "../utils/array.js";
const queue = [];
export const logger = consola.create({}).withTag("pruvious");
export function log(message, ...args) {
  logger.log(applyFormats(message, ...args));
}
export function error(message, ...args) {
  logger.error(applyFormats(message, ...args));
}
export function info(message, ...args) {
  logger.info(applyFormats(message, ...args));
}
export function success(message, ...args) {
  logger.success(applyFormats(message, ...args));
}
export function warn(message, ...args) {
  logger.warn(applyFormats(message, ...args));
}
export function queueError(message, ...args) {
  queue.push({ level: "error", message, args });
}
export function queueInfo(message, ...args) {
  queue.push({ level: "info", message, args });
}
export function queueSuccess(message, ...args) {
  queue.push({ level: "success", message, args });
}
export function queueWarn(message, ...args) {
  queue.push({ level: "warn", message, args });
}
export function clearLogQueue() {
  clearArray(queue);
}
export function processLogQueue() {
  for (const { level, message, args } of queue) {
    logger[level](applyFormats(message, ...args));
  }
  clearLogQueue();
}
export function applyFormats(message, ...args) {
  return [message, ...args].map(
    (text) => text?.toString().replace(/\$(c|g|r|u|y){{(.+?)}}/g, (_, f, value) => {
      const trimmed = value.trim();
      return f === "c" ? cyan(trimmed) : f === "g" ? green(trimmed) : f === "r" ? red(trimmed) : f === "u" ? underline(trimmed) : yellow(trimmed);
    })
  ).join(" ");
}
