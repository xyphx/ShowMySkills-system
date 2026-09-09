import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur px-6 flex items-center justify-between">
      <Link href="/" className="font-bold text-xl text-indigo-400">
        ShowMySkills
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link href="/dashboard" className="text-slate-300 hover:text-white transition">
          Dashboard
        </Link>
        <Link href="/login" className="text-slate-300 hover:text-white transition">
          Login
        </Link>
      </nav>
    </header>
  );
}
