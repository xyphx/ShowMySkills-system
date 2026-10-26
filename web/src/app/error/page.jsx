"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  Server,
  Database,
  Globe,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Terminal,
  Activity,
  Layers,
  ExternalLink,
} from "lucide-react";
import { checkBackendHealth, getApiBaseUrl } from "@/services/apiClient";

function ErrorPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromPath = searchParams.get("from") || "/";
  const initialReason = searchParams.get("reason") || "";

  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState(null);
  const [showRawDetails, setShowRawDetails] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [countdown, setCountdown] = useState(10);
  const [lastCheckedTime, setLastCheckedTime] = useState(null);

  // Health state
  const [healthData, setHealthData] = useState({
    online: false,
    statusCode: 503,
    latencyMs: null,
    backend: { status: "checking" },
    database: { status: "checking" },
    message: "Diagnosing system components...",
    raw: null,
  });

  const runDiagnostics = useCallback(async () => {
    setLoading(true);
    try {
      const result = await checkBackendHealth();
      setHealthData(result);
      setLastCheckedTime(new Date().toLocaleTimeString());
    } catch (err) {
      setHealthData({
        online: false,
        statusCode: 503,
        latencyMs: null,
        backend: { status: "offline", error: err.message },
        database: { status: "unknown", error: "Backend server is unreachable" },
        message: "Failed to connect to backend server.",
        raw: { error: err.message },
      });
      setLastCheckedTime(new Date().toLocaleTimeString());
    } finally {
      setLoading(false);
      setCountdown(10);
    }
  }, []);

  // Initial probe on mount
  useEffect(() => {
    runDiagnostics();
  }, [runDiagnostics]);

  // Auto-refresh countdown loop
  useEffect(() => {
    if (!autoRefresh) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          runDiagnostics();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRefresh, runDiagnostics]);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const isBackendUp = healthData.online && healthData.backend?.status === "up";
  const isDatabaseUp =
    healthData.online && healthData.database?.status === "connected";
  const isAllHealthy = isBackendUp && isDatabaseUp;

  // Determine primary failure headline and cause
  let errorTitle = "503 • Service Unavailable";
  let errorSubtitle = "A critical system dependency is currently offline.";
  let badgeLabel = "System Degraded";
  let badgeColor = "bg-rose-50 text-rose-700 border-rose-200";

  if (!isBackendUp) {
    errorTitle = "Backend Server Is Not Running";
    errorSubtitle =
      "The Express API backend is offline or unreachable. Frontend requests cannot be processed.";
    badgeLabel = "Backend Offline (503)";
    badgeColor = "bg-rose-50 text-rose-700 border-rose-200";
  } else if (!isDatabaseUp) {
    errorTitle = "MongoDB Database Is Not Running";
    errorSubtitle =
      "The Express API server is active, but the MongoDB connection has dropped or failed to connect.";
    badgeLabel = "Database Offline (503)";
    badgeColor = "bg-amber-50 text-amber-700 border-amber-200";
  } else if (isAllHealthy) {
    errorTitle = "All Core Systems Operational";
    errorSubtitle =
      "Both the Express backend and MongoDB database are healthy and responding normally.";
    badgeLabel = "Services Operational (200)";
    badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  const apiUrl = getApiBaseUrl();

  return (
    <div className="min-h-screen bg-[#F7F9F9] text-[#181E29] flex flex-col font-sans selection:bg-[#4B9C93]/20 selection:text-[#4B9C93]">
      {/* Top Navbar */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30 px-6 py-3.5 sm:px-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="ShowMySkills Logo"
              className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-102"
            />
            <div className="hidden sm:flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-[#181E29]">
                ShowMy<span className="text-[#4B9C93]">Skills</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400">
                System Diagnostics
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => runDiagnostics()}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 border border-slate-300/80 transition-all cursor-pointer disabled:opacity-60"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-slate-600 ${
                  loading ? "animate-spin text-[#4B9C93]" : ""
                }`}
              />
              <span>{loading ? "Checking..." : "Recheck Status"}</span>
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#4B9C93] hover:bg-[#3d867e] active:scale-95 text-white transition-all shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to App</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-8 py-8 sm:py-12 space-y-8">
        {/* Hero Status Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-[0_4px_30px_rgba(0,0,0,0.04)] p-6 sm:p-10">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-44 h-44 rounded-full bg-[#4B9C93]/10 blur-2xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border tracking-wide uppercase select-none shadow-xs ${badgeColor}">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isAllHealthy
                      ? "bg-emerald-500 animate-pulse"
                      : "bg-rose-500 animate-ping"
                  }`}
                />
                <span className="font-mono">{badgeLabel}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-snug">
                {errorTitle}
              </h1>

              <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
                {errorSubtitle}
              </p>
            </div>

            {/* Quick Status Pill & Countdown */}
            <div className="flex flex-col items-start md:items-end gap-2 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 min-w-[210px]">
              <div className="flex items-center justify-between w-full text-xs text-slate-500 font-medium">
                <span>Auto-Recheck</span>
                <button
                  type="button"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                    autoRefresh
                      ? "bg-[#4B9C93]/15 text-[#4B9C93]"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {autoRefresh ? `Every ${countdown}s` : "Paused"}
                </button>
              </div>

              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-[#4B9C93] h-full transition-all duration-1000 ease-linear rounded-full"
                  style={{
                    width: autoRefresh ? `${(countdown / 10) * 100}%` : "0%",
                  }}
                />
              </div>

              <div className="flex items-center justify-between w-full text-[11px] text-slate-400 mt-1">
                <span>Last checked:</span>
                <span className="font-mono text-slate-600 font-semibold">
                  {lastCheckedTime || "Just now"}
                </span>
              </div>
            </div>
          </div>

          {/* Subsystem Diagnostics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            {/* 1. Backend Server Card */}
            <div
              className={`rounded-2xl p-5 border transition-all ${
                isBackendUp
                  ? "bg-emerald-50/40 border-emerald-200"
                  : "bg-rose-50/50 border-rose-300 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2 rounded-xl ${
                      isBackendUp
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      Backend Server
                    </h3>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Express API (Port 5000)
                    </p>
                  </div>
                </div>

                {isBackendUp ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Running</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Offline</span>
                  </span>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200/60">
                <div className="flex justify-between">
                  <span className="text-slate-400">Endpoint:</span>
                  <span className="font-mono text-[11px] text-slate-700 truncate max-w-[170px]" title={apiUrl}>
                    {apiUrl}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span
                    className={`font-semibold ${
                      isBackendUp ? "text-emerald-700" : "text-rose-700"
                    }`}
                  >
                    {isBackendUp ? "Online & Responding" : "Connection Refused / Stopped"}
                  </span>
                </div>
                {healthData.latencyMs !== null && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ping Latency:</span>
                    <span className="font-mono text-slate-700">
                      {healthData.latencyMs}ms
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 2. MongoDB Database Card */}
            <div
              className={`rounded-2xl p-5 border transition-all ${
                isDatabaseUp
                  ? "bg-emerald-50/40 border-emerald-200"
                  : isBackendUp
                  ? "bg-amber-50/60 border-amber-300 shadow-sm"
                  : "bg-slate-50 border-slate-200 opacity-75"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2 rounded-xl ${
                      isDatabaseUp
                        ? "bg-emerald-100 text-emerald-700"
                        : isBackendUp
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      MongoDB Database
                    </h3>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Port 27017 (showmyskills)
                    </p>
                  </div>
                </div>

                {isDatabaseUp ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Connected</span>
                  </span>
                ) : isBackendUp ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Disconnected</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200 text-slate-600">
                    <span>Unknown</span>
                  </span>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200/60">
                <div className="flex justify-between">
                  <span className="text-slate-400">Connection State:</span>
                  <span
                    className={`font-mono text-[11px] font-semibold ${
                      isDatabaseUp
                        ? "text-emerald-700"
                        : isBackendUp
                        ? "text-amber-700"
                        : "text-slate-500"
                    }`}
                  >
                    {healthData.database?.readyStateText ||
                      (isBackendUp ? "disconnected" : "unreachable")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">DB Host:</span>
                  <span className="font-mono text-[11px] text-slate-700">
                    {healthData.database?.host || "localhost:27017"}
                  </span>
                </div>
                {healthData.database?.pingLatencyMs && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">DB Latency:</span>
                    <span className="font-mono text-slate-700">
                      {healthData.database.pingLatencyMs}ms
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Frontend Web App Card */}
            <div className="rounded-2xl p-5 border bg-emerald-50/40 border-emerald-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      Frontend Web App
                    </h3>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Next.js Client
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Active</span>
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200/60">
                <div className="flex justify-between">
                  <span className="text-slate-400">Client Runtime:</span>
                  <span className="font-mono text-[11px] text-slate-700">
                    React 19 / Next.js
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Network State:</span>
                  <span className="text-emerald-700 font-semibold">
                    Browser Online
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Diagnostics Route:</span>
                  <span className="font-mono text-[11px] text-slate-700">
                    /error (503 Handled)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actionable Troubleshooting & Remediation Guides */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-[0_4px_25px_rgba(0,0,0,0.03)] p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-900 text-white">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                How to Resolve This Issue
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Follow these terminal commands to start the required service.
              </p>
            </div>
          </div>

          {!isBackendUp && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-5 space-y-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-rose-950">
                    Cause: Backend API process is stopped
                  </h4>
                  <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                    The Express server listening on port 5000 is not running. Start it in a new terminal window:
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative flex items-center justify-between bg-slate-900 text-slate-100 rounded-xl px-4 py-3 font-mono text-xs shadow-inner">
                  <span>cd api && npm run dev</span>
                  <button
                    onClick={() => copyToClipboard("cd api && npm run dev", "start_backend")}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-sans font-semibold cursor-pointer transition-colors"
                  >
                    {copiedKey === "start_backend" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-[11px] text-slate-500 pl-1">
                  Ensure your <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">api/.env</code> file has <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">PORT=5000</code> configured.
                </div>
              </div>
            </div>
          )}

          {isBackendUp && !isDatabaseUp && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5 space-y-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-amber-950">
                    Cause: MongoDB database daemon is offline
                  </h4>
                  <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                    The backend is running, but cannot connect to MongoDB at <code className="font-mono font-semibold">mongodb://localhost:27017</code>.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-xs font-semibold text-slate-700">Option A: Start MongoDB on Windows (Local Service)</span>
                  <div className="relative flex items-center justify-between bg-slate-900 text-slate-100 rounded-xl px-4 py-2.5 font-mono text-xs shadow-inner mt-1.5">
                    <span>net start MongoDB</span>
                    <button
                      onClick={() => copyToClipboard("net start MongoDB", "mongo_win")}
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-sans font-semibold cursor-pointer transition-colors"
                    >
                      {copiedKey === "mongo_win" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === "mongo_win" ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-700">Option B: Start MongoDB via Docker Compose</span>
                  <div className="relative flex items-center justify-between bg-slate-900 text-slate-100 rounded-xl px-4 py-2.5 font-mono text-xs shadow-inner mt-1.5">
                    <span>docker compose up -d mongodb</span>
                    <button
                      onClick={() => copyToClipboard("docker compose up -d mongodb", "mongo_docker")}
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-sans font-semibold cursor-pointer transition-colors"
                    >
                      {copiedKey === "mongo_docker" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === "mongo_docker" ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-700">Option C: Run mongod CLI directly</span>
                  <div className="relative flex items-center justify-between bg-slate-900 text-slate-100 rounded-xl px-4 py-2.5 font-mono text-xs shadow-inner mt-1.5">
                    <span>mongod --dbpath C:\data\db</span>
                    <button
                      onClick={() => copyToClipboard("mongod --dbpath C:\\data\\db", "mongod_cli")}
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-sans font-semibold cursor-pointer transition-colors"
                    >
                      {copiedKey === "mongod_cli" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === "mongod_cli" ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isAllHealthy && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-emerald-950">
                    Services Restored Successfully!
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Backend and database are connected and responding properly. You may safely return to your work.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push(fromPath)}
                className="px-5 py-2.5 rounded-full bg-[#4B9C93] hover:bg-[#3d867e] active:scale-95 text-white font-semibold text-xs transition-all shadow-xs shrink-0 cursor-pointer"
              >
                Continue to Application
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => runDiagnostics()}
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4B9C93] hover:bg-[#3d867e] active:scale-95 text-white font-semibold text-sm transition-all shadow-xs cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? "Testing Services..." : "Run Diagnostics Again"}</span>
            </button>

            <button
              type="button"
              onClick={() => router.push(fromPath)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 active:scale-95 text-slate-800 border border-slate-300 font-semibold text-sm transition-all shadow-xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Previous Page</span>
            </button>

            <a
              href={`${apiUrl}/health`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer ml-auto"
            >
              <span>Raw Healthcheck API</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>

        {/* Collapsible Technical Details / Raw Telemetry */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => setShowRawDetails(!showRawDetails)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-slate-500" />
              <span className="font-bold text-sm text-slate-800">
                Technical Diagnostics & Raw Telemetry
              </span>
              <span className="text-xs text-slate-400 font-mono">
                (HTTP {healthData.statusCode})
              </span>
            </div>
            {showRawDetails ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {showRawDetails && (
            <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-900 text-slate-200">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs text-slate-400">
                <span>Payload from {apiUrl}/health:</span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      JSON.stringify(healthData.raw || healthData, null, 2),
                      "raw_json"
                    )
                  }
                  className="inline-flex items-center gap-1 hover:text-white cursor-pointer"
                >
                  {copiedKey === "raw_json" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedKey === "raw_json" ? "Copied" : "Copy JSON"}</span>
                </button>
              </div>
              <pre className="text-xs font-mono overflow-x-auto text-emerald-400 leading-relaxed max-h-80">
                {JSON.stringify(healthData.raw || healthData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-400 border-t border-slate-200">
        <p>ShowMySkills • Self-Healing Diagnostic & Reliability Monitor</p>
      </footer>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F7F9F9] flex items-center justify-center">
          <div className="flex items-center gap-3 text-slate-600 font-medium">
            <RefreshCw className="w-5 h-5 animate-spin text-[#4B9C93]" />
            <span>Loading System Diagnostics...</span>
          </div>
        </div>
      }
    >
      <ErrorPageContent />
    </Suspense>
  );
}
