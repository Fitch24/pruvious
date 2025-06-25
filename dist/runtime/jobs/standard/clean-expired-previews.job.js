import { defineJob } from "../job.definition.js";
export default defineJob({
  name: "clean-expired-previews",
  callback: async () => {
    const { query } = await import("#pruvious/server");
    await query("previews").whereLt("updatedAt", Date.now() - 1e3 * 60 * 60 * 24).delete();
  },
  interval: 1800
});
