import { redirect } from "next/navigation";

/**
 * /college root route.
 * Automatically redirects to the college placement dashboard.
 */
export default function CollegeRootRoute() {
  redirect("/college/dashboard");
}
