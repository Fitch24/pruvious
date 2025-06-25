import { jobs } from "#pruvious/server";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { db } from "../instances/database.js";
import { getModuleOption, intervals } from "../instances/state.js";
import { isObject } from "../utils/object.js";
import { joinRouteParts } from "../utils/string.js";
let jobQueueProcessingInitialized = false;
export function initJobQueueProcessing(runtimeConfig) {
  if (!jobQueueProcessingInitialized) {
    if (runtimeConfig.pruvious.jobs) {
      processJobQueue();
      intervals.push(setInterval(() => processJobQueue(), runtimeConfig.pruvious.jobs.searchInterval * 1e3));
      for (const definition of Object.values(jobs)) {
        if (definition.interval !== false) {
          processJob(definition.name);
          intervals.push(setInterval(() => processJob(definition.name), definition.interval * 1e3));
        }
      }
    }
    jobQueueProcessingInitialized = true;
  }
}
export async function processJob(name, ...args) {
  const apiOptions = getModuleOption("api");
  const job = await queueJob(name, ...args);
  if (apiOptions.routes["process-job.post"]) {
    const token = jwt.sign({ jti: job.jti }, getModuleOption("jwt").secretKey, { expiresIn: "1 minute" });
    return $fetch(joinRouteParts(apiOptions.prefix, apiOptions.routes["process-job.post"]), {
      method: "post",
      headers: { Authorization: `Bearer ${token}` }
    }).catch((error) => ({
      success: false,
      duration: 0,
      processedAt: Date.now(),
      error: isObject(error.data) && error.data.message ? error.data.message : error.data
    }));
  }
  return { success: false, duration: 0, processedAt: Date.now(), error: "Job processing route is disabled" };
}
export async function processJobQueue() {
  const database = await db();
  const job = await database.model("_jobs").findOne({
    order: [
      ["priority", "DESC"],
      ["created_at", "ASC"]
    ]
  });
  if (job) {
    const apiOptions = getModuleOption("api");
    if (apiOptions.routes["process-job.post"]) {
      const jti = nanoid();
      const token = jwt.sign({ jti }, getModuleOption("jwt").secretKey, { expiresIn: "1 minute" });
      await database.model("_jobs").update({ jti }, { where: { id: job.id } });
      await $fetch(joinRouteParts(apiOptions.prefix, apiOptions.routes["process-job.post"]), {
        method: "post",
        headers: { Authorization: `Bearer ${token}` }
      }).catch((error) => {
        return {
          success: false,
          duration: 0,
          processedAt: Date.now(),
          error: isObject(error.data) && error.data.message ? error.data.message : error.data
        };
      });
    }
    await processJobQueue();
  }
}
export async function queueJob(name, ...args) {
  const database = await db();
  const jti = nanoid();
  const createdAt = Date.now();
  const entry = await database.model("_jobs").create({ name, args: JSON.stringify(args), jti, priority: jobs[name].priority, created_at: createdAt });
  return { id: entry.id, name, args, jti, priority: jobs[name].priority, createdAt };
}
