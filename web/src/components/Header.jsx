import Link from "next/link";
import { Sparkles, Terminal, Award, LayoutDashboard, LogIn, ArrowRight } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md z-50 px-4 md:px-8 flex items-center justify-between transition-all">
      <div className="flex items-center space-x-6">
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-indigo-300 transition-colors">
            ShowMy<span className="text-indigo-400">Skills</span>
          </span>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            v1.0 Dev
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="#explore" className="text-slate-300 hover:text-white transition-colors">
            Explore Skills
          </Link>
          <Link href="#how-it-works" className="text-slate-300 hover:text-white transition-colors">
            How It Works
          </Link>
          <Link href="#showcase" className="text-slate-300 hover:text-white transition-colors">
            Showcase
          </Link>
          <Link href="https://showmyskills.xyphx.com/api/docs" target="_blank" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1">
            API Docs
          </Link>
        </nav>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4">
        <Link
          href="/dashboard"
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800"
        >
          <LayoutDashboard className="w-4 h-4 text-indigo-400" />
          Dashboard
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-900 border border-slate-800/80"
        >
          <LogIn className="w-4 h-4 text-slate-400" />
          Sign In
        </Link>
        <Link
          href="#explore"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-4 py-2 rounded-lg shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Showcase Skill</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </header>
  );
}
