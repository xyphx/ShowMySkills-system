"use client";

import { ArrowRight } from "lucide-react";

/**
 * CompletionBanner — Horizontal profile-completion progress bar
 * with teal fill and "Complete your profile →" link.
 */
export default function CompletionBanner({ percentage }) {
  return (
    <section
      id="profile-completion-banner"
      className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3"
    >
      {/* Label */}
      <span className="text-sm font-bold text-gray-900 whitespace-nowrap">
        {percentage}% Profile Complete
      </span>

      {/* Progress Track */}
      <div className="flex-1 w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#14b8a6] rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* CTA */}
      <a
        href="#"
        className="text-sm font-semibold text-[#14b8a6] hover:text-[#0d9488] whitespace-nowrap flex items-center gap-1 transition-colors"
      >
        Complete your profile
        <ArrowRight className="w-4 h-4" />
      </a>
    </section>
  );
}
