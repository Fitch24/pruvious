import { addRouteMiddleware } from "#imports";
import { fetchDirectories } from "../../../composables/dashboard/media.js";
import { useUser } from "../../../composables/user.js";
import { getCapabilities } from "../../../utils/users.js";
export default addRouteMiddleware("pruvious-fetch-directories", async () => {
  const user = useUser();
  const userCapabilities = getCapabilities(user.value);
  if (user.value?.isAdmin || userCapabilities["collection-uploads-read-many"]) {
    await fetchDirectories();
  }
});
