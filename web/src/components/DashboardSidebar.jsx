"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Building2,
  FolderKanban,
  User,
  Settings,
  HelpCircle,
  GraduationCap,
  Rocket,
} from "lucide-react";

/**
 * DashboardSidebar — Fixed left sidebar matching the Figma design.
 *
 * Solid teal background, white text, active state highlight,
 * and an "Upgrade Plan" promotional card.
 */

const topNavItems = [
  { label: "Dashboard", href: "/internships", icon: LayoutDashboard },
  { label: "Internships", href: "/internships#internships", icon: Briefcase },
  { label: "Jobs", href: "/internships#jobs", icon: Briefcase },
  { label: "Companies", href: "/internships#companies", icon: Building2 },
  { label: "Projects", href: "/internships#projects", icon: FolderKanban },
];

const bottomNavItems = [
  { label: "Profile", href: "/profile", icon: User },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Help & Support", href: "/help", icon: HelpCircle },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === "/internships") return pathname === "/internships";
    if (href === "/profile") return pathname === "/profile";
    return pathname === href;
  };

  return (
    <aside
      id="dashboard-sidebar"
      className="fixed left-0 top-0 bottom-0 w-[220px] bg-[#2EB89D] flex flex-col z-40 overflow-y-auto"
      style={{ borderTopRightRadius: "24px", borderBottomRightRadius: "24px" }}
    >
      {/* ──── Logo ──── */}
      <div className="flex items-center gap-2.5 px-5 pt-6 pb-8">
        <div className="h-9 w-9 rounded-lg bg-white/20 flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <span className="text-[17px] font-bold text-white tracking-tight">
          ShowMySkills
        </span>
      </div>

      {/* ──── Top Navigation ──── */}
      <nav className="flex-1 flex flex-col px-3">
        <ul className="space-y-1">
          {topNavItems.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <li key={label}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-white text-[#2EB89D] shadow-sm"
                      : "text-white/90 hover:bg-white/15 hover:text-white"
                  }`}
                >
                  <Icon className="w-[18px] h-[18px] shrink-0" />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* ──── Upgrade Plan Card ──── */}
        <div className="mt-8 mx-1 bg-white rounded-2xl p-4 shadow-lg shadow-black/5">
          <div className="flex items-center justify-center mb-2">
            <div className="h-8 w-8 rounded-full bg-[#2EB89D]/10 flex items-center justify-center">
              <Rocket className="w-4 h-4 text-[#2EB89D]" />
            </div>
          </div>
          <h4 className="text-sm font-bold text-gray-900 text-center mb-1">
            Upgrade Plan
          </h4>
          <p className="text-[11px] text-gray-500 text-center leading-relaxed mb-3">
            To explore more opportunities, more recommendations and for more filters upgrade your plan
          </p>
          <button
            id="upgrade-plan-btn"
            className="w-full py-2 rounded-full bg-[#2EB89D] text-white text-xs font-semibold hover:bg-[#28A78E] transition-colors cursor-pointer"
          >
            Upgrade Plan
          </button>
        </div>

        {/* ──── Bottom Navigation ──── */}
        <ul className="mt-6 mb-6 space-y-1">
          {bottomNavItems.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <li key={label}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-white text-[#2EB89D] shadow-sm"
                      : "text-white/90 hover:bg-white/15 hover:text-white"
                  }`}
                >
                  <Icon className="w-[18px] h-[18px] shrink-0" />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
