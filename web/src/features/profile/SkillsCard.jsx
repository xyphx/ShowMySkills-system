"use client";

/**
 * SkillsCard — Rounded skill pills with colored proficiency dots.
 *
 * Dot colour legend:
 *   expert       → green  (#22c55e)
 *   advanced     → amber  (#f59e0b)
 *   intermediate → orange (#f97316)
 */
const dotColors = {
  expert: "#22c55e",
  advanced: "#f59e0b",
  intermediate: "#f97316",
};

export default function SkillsCard({ skills }) {
  return (
    <section
      id="skills-card"
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8"
    >
      <h3 className="text-lg font-bold text-gray-900 mb-4">Skills</h3>
      <div className="flex flex-wrap gap-2.5">
        {skills.map((skill) => (
          <span
            key={skill.name}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200"
          >
            {skill.name}
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{
                backgroundColor: dotColors[skill.level] || "#94a3b8",
              }}
              title={skill.level}
            />
          </span>
        ))}
      </div>
    </section>
  );
}
