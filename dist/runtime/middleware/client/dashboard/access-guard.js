import { addRouteMiddleware } from "#imports";
import { useAuth } from "../../../composables/auth.js";
import { navigateToPruviousDashboardPath } from "../../../composables/dashboard/dashboard.js";
import { useUser } from "../../../composables/user.js";
import { getCapabilities } from "../../../utils/users.js";
export default addRouteMiddleware("pruvious-dashboard-access-guard", (to) => {
  const auth = useAuth();
  const user = useUser();
  if (!auth.value.isLoggedIn || !user.value?.isAdmin && !getCapabilities(user.value)["access-dashboard"]) {
    return navigateToPruviousDashboardPath("/", { replace: true });
  }
});
