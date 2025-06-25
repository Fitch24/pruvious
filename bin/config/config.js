"use strict";
import { loadConfig as _loadConfig } from "c12";
import { cyan } from "colorette";
import consola from "consola";
import fs from "fs-extra";
import { loadFile, writeFile } from "magicast";
import path from "path";
const configFilePath = path.join(process.cwd(), ".ssh.ts");
export async function loadConfig() {
  const config = (await _loadConfig({ name: ".ssh", configFile: ".ssh", rcFile: ".sshrc" })).config;
  if (config?.servers && typeof config.servers === "object") {
    return config;
  }
  return { servers: [] };
}
export async function readConfigFile() {
  if (fs.existsSync(configFilePath)) {
    const module = await loadFile(configFilePath);
    if (module?.exports.default?.$type === "function-call") {
      return module.exports.default.$args[0];
    } else if (module?.exports.default) {
      return module.exports.default;
    }
  }
  return { servers: [] };
}
export async function mergeConfigFile(config) {
  if (!fs.existsSync(configFilePath)) {
    fs.writeFileSync(
      configFilePath,
      [
        `import { definePruviousConfig } from 'pruvious/config'`,
        ``,
        `export default definePruviousConfig({`,
        `  servers: [],`,
        `})`,
        ``
      ].join("\n")
    );
  }
  const module = await loadFile(configFilePath);
  if (module?.exports.default?.$type === "function-call") {
    module.exports.default.$args[0] = config;
  } else if (module?.exports.default) {
    module.exports.default = config;
  } else {
    consola.error(`Invalid ${cyan(".ssh.ts")} file`);
    process.exit(1);
  }
  await writeFile(module, configFilePath);
}
