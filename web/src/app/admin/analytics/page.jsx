"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Users,
  Building2,
  Briefcase,
  CheckCircle2,
  GraduationCap,
  Calendar,
  Download,
  ArrowUpRight,
  Award,
  Layers,
  Activity,
  ArrowRight,
} from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { adminService } from "@/services/apiClient";

const defaultKpis = [
  {
    title: "Registered Students",
    value: "0",
    change: "Platform students",
    isPositive: true,
    icon: Users,
    bg: "bg-[#E6F7F3]",
    text: "text-[#0D9488]",
  },
  {
    title: "Partner Companies",
    value: "0",
    change: "Registered partners",
    isPositive: true,
    icon: Building2,
    bg: "bg-blue-50",
    text: "text-blue-600",
  },
  {
    title: "Active Internships",
    value: "0",
    change: "Active listings",
    isPositive: true,
    icon: Briefcase,
    bg: "bg-purple-50",
    text: "text-purple-600",
  },
  {
    title: "Applications Placed",
    value: "0",
    change: "Shortlist rate",
    isPositive: true,
    icon: CheckCircle2,
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
];

const skillColors = ["bg-[#4B9C93]", "bg-blue-500", "bg-purple-500", "bg-amber-500", "bg-emerald-500"];

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d");
  const [exportNotice, setExportNotice] = useState(false);
  const [statsData, setStatsData] = useState(defaultKpis);
  const [topSkills, setTopSkills] = useState([]);
  const [collegeLeaderboard, setCollegeLeaderboard] = useState([]);
  const [conversionFunnel, setConversionFunnel] = useState([]);

  useEffect(() => {
    let isMounted = true;
    adminService.getAnalytics().then((analytics) => {
      if (!isMounted || !analytics) return;
      if (analytics.kpi) {
        setStatsData([
          {
            title: "Registered Students",
            value: (analytics.kpi.registeredStudents ?? 0).toLocaleString(),
            change: "Platform students",
            isPositive: true,
            icon: Users,
            bg: "bg-[#E6F7F3]",
            text: "text-[#0D9488]",
          },
          {
            title: "Partner Companies",
            value: (analytics.kpi.partnerCompanies ?? 0).toLocaleString(),
            change: "Registered partners",
            isPositive: true,
            icon: Building2,
            bg: "bg-blue-50",
            text: "text-blue-600",
          },
          {
            title: "Active Internships",
            value: (analytics.kpi.activeInternships ?? 0).toLocaleString(),
            change: "Active listings",
            isPositive: true,
            icon: Briefcase,
            bg: "bg-purple-50",
            text: "text-purple-600",
          },
          {
            title: "Applications Placed",
            value: (analytics.kpi.totalApplications ?? 0).toLocaleString(),
            change: `${analytics.kpi.shortlistRate || "0%"} shortlist rate`,
            isPositive: true,
            icon: CheckCircle2,
            bg: "bg-emerald-50",
            text: "text-emerald-600",
          },
        ]);
      }
      if (Array.isArray(analytics.topSkills)) {
        setTopSkills(
          analytics.topSkills.map((s, i) => ({
            ...s,
            color: skillColors[i % skillColors.length],
          }))
        );
      }
      if (Array.isArray(analytics.funnel)) {
        setConversionFunnel(analytics.funnel);
      }
      if (Array.isArray(analytics.collegeLeaderboard)) {
        setCollegeLeaderboard(analytics.collegeLeaderboard);
      }
    }).catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const handleExport = () => {
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F7F9F9] flex">
      <DashboardSidebar />

      <div className="flex-1 md:ml-[220px] ml-0 flex flex-col min-h-screen relative">
        <DashboardHeader
          title="Platform Intelligence & Analytics"
          subtitle="System telemetry, campus engagement velocity, and university hiring conversion rates"
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Timeframe:</span>
              <div className="inline-flex p-1 bg-white border border-gray-200 rounded-2xl shadow-2xs">
                {[
                  { id: "7d", label: "7 Days" },
                  { id: "30d", label: "30 Days" },
                  { id: "90d", label: "90 Days" },
                  { id: "1y", label: "Past Year" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTimeRange(t.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      timeRange === t.id
                        ? "bg-[#4B9C93] text-white shadow-xs"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-all shadow-2xs cursor-pointer self-start sm:self-auto"
            >
              <Download className="w-4 h-4 text-[#4B9C93]" />
              <span>Export Telemetry (CSV)</span>
            </button>
          </div>

          {exportNotice && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Full metrics report generated and queued for download!
            </div>
          )}

          {/* KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsData.map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {kpi.title}
                    </span>
                    <div className={`w-10 h-10 rounded-2xl ${kpi.bg} ${kpi.text} flex items-center justify-center font-bold`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                      {kpi.value}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {kpi.change}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Funnel & Skills Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Trending Skills */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    Most In-Demand Skills On Campus
                  </h3>
                  <p className="text-xs text-gray-500">Based on recruiter job postings & verified tests</p>
                </div>
                <TrendingUp className="w-5 h-5 text-amber-400" />
              </div>

              <div className="space-y-4 pt-1">
                {topSkills.length === 0 ? (
                  <div className="py-8 text-center text-xs text-gray-400">
                    No campus skill telemetry recorded yet.
                  </div>
                ) : (
                  topSkills.map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-gray-800">{item.skill}</span>
                        <span className="text-gray-500">{item.count}</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full transition-all duration-500`}
                          style={{ width: `${item.demand}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Hiring Conversion Pipeline Funnel */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  Campus Placement Funnel
                </h3>
                <p className="text-xs text-gray-500">Conversion efficiency through the application cycle</p>
              </div>

              <div className="space-y-3 pt-1">
                {conversionFunnel.length === 0 ? (
                  <div className="py-8 text-center text-xs text-gray-400">
                    No application funnel conversions recorded yet.
                  </div>
                ) : (
                  conversionFunnel.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-gray-50/70 border border-gray-100 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#E6F7F3] text-[#0D9488] font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-gray-800">{step.stage}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-xs sm:text-sm text-gray-900">{step.count}</span>
                        <span className="text-[11px] text-gray-400 block font-medium">({step.percent})</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* College Engagement Leaderboard */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  Institutional Placement Leaderboard
                </h3>
                <p className="text-xs text-gray-500">Top engineering institutions by verified student profiles & placement offers</p>
              </div>
              <Award className="w-5 h-5 text-[#4B9C93]" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    <th className="py-3 px-3">Rank & University</th>
                    <th className="py-3 px-3">Verified Talent</th>
                    <th className="py-3 px-3">Total Hires</th>
                    <th className="py-3 px-3">Skill Index</th>
                    <th className="py-3 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs sm:text-sm">
                  {collegeLeaderboard.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-xs text-gray-400">
                        No institutional placement records found.
                      </td>
                    </tr>
                  ) : (
                    collegeLeaderboard.map((col) => (
                      <tr key={col.rank} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                                col.rank === 1
                                  ? "bg-amber-100 text-amber-800 font-extrabold"
                                  : col.rank === 2
                                  ? "bg-slate-200 text-slate-800"
                                  : col.rank === 3
                                  ? "bg-amber-50 text-amber-900"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              #{col.rank}
                            </span>
                            <span className="font-bold text-gray-900">{col.name}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-3 font-semibold text-gray-700">
                          {col.verifiedStudents} Students
                        </td>

                        <td className="py-3.5 px-3 font-semibold text-emerald-600">
                          {col.hires} Offers
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="px-2.5 py-1 rounded-full bg-teal-50 text-[#0D9488] font-bold text-xs">
                            {col.score} / 100
                          </span>
                        </td>

                        <td className="py-3.5 px-3 text-right">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Accredited Partner
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
