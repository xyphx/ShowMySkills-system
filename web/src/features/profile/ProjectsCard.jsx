"use client";

import { BadgeCheck, ExternalLink } from "lucide-react";

/**
 * ProjectsCard — Grid of student projects with tags, verification
 * badge, and a subtle hover lift effect.
 */
export default function ProjectsCard({ projects }) {
  return (
    <section
      id="projects-card"
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8"
    >
      <h3 className="text-lg font-bold text-gray-900 mb-4">Projects</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <div
            key={project.id}
            className="group relative bg-gray-50 rounded-xl border border-gray-100 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            {/* Title Row */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="text-sm font-bold text-gray-900 leading-snug">
                {project.title}
              </h4>
              <div className="flex items-center gap-1.5 shrink-0">
                {project.verified && (
                  <span
                    className="text-[#14b8a6]"
                    title="Verified project"
                  >
                    <BadgeCheck className="w-4 h-4" />
                  </span>
                )}
                <ExternalLink className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
              {project.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E6F9F5] text-[#14b8a6]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
