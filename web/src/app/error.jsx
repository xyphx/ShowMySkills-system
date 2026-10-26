"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, Activity } from "lucide-react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log uncaught error for telemetry
    console.error("ShowMySkills Global Error Boundary Caught:", error);
  }, [error]);

  const is503OrNetwork =
    error?.message?.includes("503") ||
    error?.message?.includes("Failed to fetch") ||
    error?.message?.includes("NetworkError");

  return (
    <div className="min-h-screen bg-[#F7F9F9] flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-inner">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
            {is503OrNetwork ? "Service Unavailable (503)" : "Application Error"}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {is503OrNetwork
              ? "Backend or Database Unavailable"
              : "Something Went Wrong"}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
            {is503OrNetwork
              ? "The backend API or MongoDB database is currently offline or unreachable."
              : error?.message ||
                "An unexpected application error occurred while processing your request."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/error"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#4B9C93] hover:bg-[#3d867e] active:scale-95 text-white font-semibold text-sm transition-all shadow-xs"
          >
            <Activity className="w-4 h-4" />
            <span>Open System Diagnostics (/error)</span>
          </Link>

          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-semibold text-sm transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
