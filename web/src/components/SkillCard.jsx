import { CheckCircle2, TrendingUp, Users, ArrowUpRight, Flame } from "lucide-react";

export default function SkillCard({ skill }) {
  const levelColors = {
    Expert: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Advanced: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    Intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Foundational: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };

  return (
    <div className="group relative bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              {skill.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                {skill.name}
                {skill.isHot && (
                  <span title="High In-Demand">
                    <Flame className="w-4 h-4 text-orange-400 fill-orange-400/20" />
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">{skill.category}</p>
            </div>
          </div>

          <span
            className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
              levelColors[skill.level] || levelColors.Intermediate
            }`}
          >
            {skill.level}
          </span>
        </div>

        <p className="text-sm text-slate-300 line-clamp-2 mb-4 leading-relaxed">
          {skill.description}
        </p>

        {/* Progress & Benchmarks */}
        <div className="space-y-1.5 mb-4">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Pass Rate Benchmark</span>
            <span className="font-semibold text-slate-200">{skill.passRate}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${skill.passRate}%` }}
            />
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {skill.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-800/70 text-slate-300 border border-slate-700/40"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Users className="w-3.5 h-3.5 text-slate-500" />
          <span>{skill.verifiedDevs.toLocaleString()} certified</span>
        </div>

        <button className="flex items-center gap-1 font-semibold text-indigo-400 group-hover:text-indigo-300 group-hover:translate-x-0.5 transition-all">
          <span>Take Test</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
