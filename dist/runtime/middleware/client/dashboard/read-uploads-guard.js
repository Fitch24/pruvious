import { addRouteMiddleware } from "#imports";
import { useAuth } from "../../../composables/auth.js";
import { navigateToPruviousDashboardPath } from "../../../composables/dashboard/dashboard.js";
import { useUser } from "../../../composables/user.js";
import { getCapabilities } from "../../../utils/users.js";
export default addRouteMiddleware("pruvious-read-uploads-guard", (to) => {
  const auth = useAuth();
  const user = useUser();
  if (!auth.value.isLoggedIn || !user.value?.isAdmin && !getCapabilities(user.value)["collection-uploads-read"]) {
    return navigateToPruviousDashboardPath("/", { replace: true });
  }
});
