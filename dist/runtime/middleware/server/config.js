import { useRuntimeConfig } from "#imports";
import { defineEventHandler } from "h3";
import { cacheModuleOptions } from "../../instances/state.js";
import { initJobQueueProcessing } from "../../jobs/job.utils.js";
export default defineEventHandler(async () => {
  const runtimeConfig = useRuntimeConfig();
  cacheModuleOptions(runtimeConfig);
  initJobQueueProcessing(runtimeConfig);
});
