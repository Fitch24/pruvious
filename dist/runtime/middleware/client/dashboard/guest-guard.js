import { addRouteMiddleware } from "#imports";
import { useAuth } from "../../../composables/auth.js";
import { navigateToPruviousDashboardPath } from "../../../composables/dashboard/dashboard.js";
export default addRouteMiddleware("pruvious-dashboard-guest-guard", () => {
  const auth = useAuth();
  if (auth.value.isLoggedIn) {
    return navigateToPruviousDashboardPath("/", { replace: true });
  }
});
