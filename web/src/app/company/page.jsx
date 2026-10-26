import { redirect } from "next/navigation";

/**
 * /company root route.
 * Automatically redirects to the company applications ATS.
 */
export default function CompanyRootRoute() {
  redirect("/company/applications");
}
