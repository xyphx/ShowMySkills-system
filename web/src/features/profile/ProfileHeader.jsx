"use client";

import { BadgeCheck, Pencil, Download } from "lucide-react";

/**
 * ProfileHeader — Top card showing user identity, verification status,
 * action buttons, open-to-work status, and primary skill pills.
 */
export default function ProfileHeader({ data }) {
  const initials = data.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <section
      id="profile-header-card"
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        {/* ──── Avatar ──── */}
        <div className="relative shrink-0">
          <div className="w-20 h-20 sm:w-[88px] sm:h-[88px] rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-2xl font-bold text-gray-500 ring-4 ring-white shadow-md overflow-hidden">
            {data.avatarUrl ? (
              <img
                src={data.avatarUrl}
                alt={data.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>
        </div>

        {/* ──── Info + Buttons ──── */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Name row */}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-gray-900 leading-tight">
                  {data.name}
                </h2>
                {data.verified && (
                  <span className="inline-flex items-center gap-1 bg-[#14b8a6] text-white text-[10px] font-bold uppercase tracking-wider rounded px-2 py-0.5">
                    <BadgeCheck className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-500 mt-0.5">
                {data.title} • Student at {data.college}
              </p>

              <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-full bg-gray-300 text-center leading-3 text-[8px] text-white font-bold">
                  ●
                </span>
                {data.location}
              </p>

              <p className="text-xs text-[#14b8a6] font-medium mt-1">
                {data.openToWorkMessage}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                id="edit-profile-btn"
                className="px-4 py-2 rounded-lg border border-[#14b8a6] text-[#14b8a6] text-sm font-semibold hover:bg-[#14b8a6]/5 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit Profile
              </button>
              <button
                id="download-resume-btn"
                className="px-4 py-2 rounded-lg bg-[#14b8a6] text-white text-sm font-semibold hover:bg-[#0d9488] transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm shadow-[#14b8a6]/20"
              >
                <Download className="w-3.5 h-3.5" />
                Download Resume
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ──── Primary Skill Pills ──── */}
      <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-gray-50">
        {data.primarySkills.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F9F5] text-[#14b8a6] border border-[#14b8a6]/15"
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}
