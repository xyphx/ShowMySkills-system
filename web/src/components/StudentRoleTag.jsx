"use client";

import { ShieldCheck, GitMerge, Megaphone, Code2, Crown } from "lucide-react";

/**
 * Valid student platform role tags:
 * - Admin
 * - Maintainer
 * - Promoter
 * - Contributor
 * - Ambassador
 *
 * Each student has strictly ONE of these tags, assigned by Admin.
 */
export const STUDENT_ROLE_TAGS = {
  Admin: {
    label: "Admin",
    icon: ShieldCheck,
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    dot: "bg-purple-600",
    ring: "ring-purple-500/20",
    desc: "Platform administration & governance",
  },
  Maintainer: {
    label: "Maintainer",
    icon: GitMerge,
    bg: "bg-[#E6F7F3]",
    text: "text-[#0D9488]",
    border: "border-[#0D9488]/30",
    dot: "bg-[#0D9488]",
    ring: "ring-[#0D9488]/20",
    desc: "Core codebase & architecture maintainer",
  },
  Promoter: {
    label: "Promoter",
    icon: Megaphone,
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-600",
    ring: "ring-emerald-500/20",
    desc: "Active verified community promoter",
  },
  Contributor: {
    label: "Contributor",
    icon: Code2,
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    dot: "bg-sky-600",
    ring: "ring-sky-500/20",
    desc: "Active open-source & project contributor",
  },
  Ambassador: {
    label: "Ambassador",
    icon: Crown,
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    dot: "bg-amber-500",
    ring: "ring-amber-500/20",
    desc: "Campus community & outreach lead",
  },
};

export default function StudentRoleTag({
  tag,
  size = "sm",
  showIcon = true,
  className = "",
}) {
  if (!tag) return null;

  const resolvedTag = tag === "Intern" ? "Promoter" : tag;
  const config = STUDENT_ROLE_TAGS[resolvedTag] || {
    label: tag,
    icon: Code2,
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
    dot: "bg-slate-500",
    ring: "ring-slate-500/20",
    desc: "Student",
  };

  const Icon = config.icon;

  const sizeClasses = {
    xs: "px-1.5 py-0.2 text-[9px] gap-1",
    sm: "px-2 py-0.5 text-[10px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3 py-1.5 text-sm gap-2",
  };

  const iconSizes = {
    xs: "w-2.5 h-2.5",
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  };

  return (
    <span
      title={`System Tag: ${config.label} — ${config.desc}`}
      className={`inline-flex items-center font-bold uppercase tracking-wider rounded-full border shadow-2xs transition-all ${
        config.bg
      } ${config.text} ${config.border} ${sizeClasses[size] || sizeClasses.sm} ${className}`}
    >
      {showIcon && <Icon className={`${iconSizes[size] || iconSizes.sm} shrink-0`} />}
      <span>{config.label}</span>
    </span>
  );
}
