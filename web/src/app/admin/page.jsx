import { redirect } from "next/navigation";

/**
 * /admin root route.
 * Automatically redirects to the admin analytics dashboard.
 */
export default function AdminRootRoute() {
  redirect("/admin/analytics");
}
