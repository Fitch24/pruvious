import { addRouteMiddleware } from "#imports";
import { navigateToPruviousDashboardPath } from "../../../composables/dashboard/dashboard.js";
import { useMediaDirectories } from "../../../composables/dashboard/media.js";
import { listMediaDirectory } from "../../../utils/dashboard/media-directory.js";
import { parseMediaDirectoryName } from "../../../utils/uploads.js";
export default addRouteMiddleware("pruvious-uploads-directory-guard", async (to) => {
  const directory = parseMediaDirectoryName(to.params.catchAll);
  const mediaDirectories = useMediaDirectories();
  if (!listMediaDirectory(directory, mediaDirectories.value)) {
    return navigateToPruviousDashboardPath("/404", { replace: true }, { ...to, query: { from: to.fullPath } });
  }
});
