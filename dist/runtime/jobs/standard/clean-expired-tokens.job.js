import { defineJob } from "../job.definition.js";
export default defineJob({
  name: "clean-expired-tokens",
  callback: async () => import("../../http/auth.js").then(({ cleanExpiredTokens }) => cleanExpiredTokens()),
  interval: 1800
});
