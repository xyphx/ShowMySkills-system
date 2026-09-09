import Header from "@/components/Header";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-slate-900 to-slate-950">
      <Header />
      <div className="max-w-2xl text-center space-y-6 mt-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
          Fresh Next.js Web App
        </h1>
        <p className="text-lg text-slate-400">
          Your frontend application is ready. Edit <code className="bg-slate-800 px-2 py-1 rounded text-indigo-300">src/app/page.jsx</code> to get started.
        </p>
      </div>
    </main>
  );
}
