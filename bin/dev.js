"use strict";
import { defineCommand } from "citty";
import { execa } from "execa";
import { getArgs as getListhenArgs } from "listhen/cli";
import { debounce } from "perfect-debounce";
import { isBun, isTest } from "std-env";
import { execaOptions } from "./default.js";
import { sortArgs } from "./shared.js";
const forkSupported = !isBun && !isTest;
export default defineCommand({
  meta: {
    name: "dev",
    description: "Run development server"
  },
  args: sortArgs({
    cwd: {
      type: "string",
      description: "Current working directory"
    },
    logLevel: {
      type: "string",
      description: "Log level"
    },
    rootDir: {
      type: "positional",
      description: "Root Directory",
      required: false
    },
    ...getListhenArgs(),
    dotenv: {
      type: "string",
      description: "Path to .env file"
    },
    clear: {
      type: "boolean",
      description: "Clear console on restart"
    },
    fork: {
      type: "boolean",
      description: forkSupported ? "Disable forked mode" : "Enable forked mode",
      default: forkSupported
    }
  }),
  run({ rawArgs }) {
    startDev(rawArgs);
  }
});
let dev;
let buffer = "";
function startDev(args) {
  dev = execa("nuxi dev", args, { ...execaOptions, stderr: "pipe" });
  dev.stderr.setEncoding("utf8");
  dev.stderr.on("data", (data) => onData(data, args));
  return dev;
}
function onData(data, args) {
  buffer += data;
  restartOnSqlite3Error(args);
}
const restartOnSqlite3Error = debounce((args) => {
  if (buffer.includes("Error") && buffer.includes("sqlite3@")) {
    dev.stderr.off("data", onData);
    dev.kill();
    buffer = "";
    startDev(args);
  } else {
    process.stdout.write(buffer);
  }
}, 50);
