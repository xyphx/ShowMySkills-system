import Link from "next/link";
import { Sparkles, Github, BookOpen, ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 py-12 px-6 md:px-12 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-lg text-white">
              ShowMy<span className="text-indigo-400">Skills</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The open-source benchmark platform for developers to verify coding skills, showcase hands-on work, and get hired.
          </p>
          <div className="flex items-center space-x-3 pt-2">
            <a
              href="https://github.com/xyphx/ShowMySkills-system"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub repository"
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://showmyskills.xyphx.com/api/docs"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              title="API Docs"
            >
              <BookOpen className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-200 mb-3 uppercase tracking-wider">Platform</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="#explore" className="hover:text-white transition-colors">Skill Directory</Link></li>
            <li><Link href="#how-it-works" className="hover:text-white transition-colors">Skill Benchmarks</Link></li>
            <li><Link href="#showcase" className="hover:text-white transition-colors">Developer Profile Cards</Link></li>
            <li><Link href="/dashboard" className="hover:text-white transition-colors">Candidate Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-200 mb-3 uppercase tracking-wider">Resources</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="https://showmyskills.xyphx.com/api/docs" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Swagger API Specs</a></li>
            <li><Link href="https://github.com/xyphx/ShowMySkills-system" className="hover:text-white transition-colors">Monorepo GitHub</Link></li>
            <li><Link href="/login" className="hover:text-white transition-colors">Sign In & Authentication</Link></li>
            <li><span className="text-slate-500">CI/CD AWS EC2 Automated</span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-200 mb-3 uppercase tracking-wider">Verification Guarantee</h4>
          <p className="text-xs text-slate-400 mb-3 leading-relaxed">
            All skill badges are backed by containerized test execution and cryptographic proof hashes.
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>Anti-Cheat AI Sandboxed</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div>
          © {new Date().getFullYear()} ShowMySkills System. Open-source under MIT License.
        </div>
        <div className="flex items-center gap-1">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
          <span>using Next.js & Tailwind CSS</span>
        </div>
      </div>
    </footer>
  );
}
