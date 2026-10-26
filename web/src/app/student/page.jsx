import { redirect } from "next/navigation";

/**
 * /student root route.
 * Automatically redirects to the active student internships dashboard.
 */
export default function StudentRootRoute() {
  redirect("/student/internships");
}
