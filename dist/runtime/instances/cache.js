import { createClient } from "redis";
import { sleep } from "../utils/function.js";
import { getModuleOption } from "./state.js";
let client;
let status = "initial";
export async function cache(force = false) {
  if (status === "initial" || !client && force) {
    const url = getModuleOption("redis");
    if (url) {
      client = createClient({ url });
      status = "connecting";
      try {
        await client.connect();
        await client.flushDb();
      } catch {
      }
    }
    status = "ready";
  }
  while (status === "connecting") {
    sleep(50);
  }
  return client ?? null;
}
