"use client";

import { ArrowRight } from "lucide-react";

/**
 * ReputationCard — Skill Reputation Score breakdown card.
 *
 * Shows the large score (85/100), a teal "Top 10% in UI/UX" pill,
 * and individual metric progress bars with labels/percentages.
 */
export default function ReputationCard({ data }) {
  return (
    <section
      id="reputation-card"
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8"
    >
      {/* ──── Title Row ──── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Skill Reputation Score
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Based on verified projects, endorsements &amp; activity
          </p>
        </div>

        {/* Score + Percentile */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-3xl sm:text-4xl font-extrabold text-gray-900 tabular-nums leading-none">
            {data.reputationScore}
            <span className="text-lg font-semibold text-gray-400">
              /{data.reputationMax}
            </span>
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F9F5] text-[#14b8a6] border border-[#14b8a6]/15">
            {data.topPercentile}
          </span>
        </div>
      </div>

      {/* ──── Metric Bars ──── */}
      <div className="space-y-4">
        {data.metrics.map((metric) => (
          <div key={metric.label}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-semibold text-gray-700">
                {metric.label}
              </span>
              <span className="text-sm font-bold text-gray-500 tabular-nums">
                {metric.value}%
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${metric.value}%`,
                  backgroundColor: metric.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ──── View Details Link ──── */}
      <div className="flex justify-end mt-5 pt-4 border-t border-gray-50">
        <a
          href="#"
          className="text-sm font-semibold text-[#14b8a6] hover:text-[#0d9488] flex items-center gap-1 transition-colors"
        >
          View Details
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}
