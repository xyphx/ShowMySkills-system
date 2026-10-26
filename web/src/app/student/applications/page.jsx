"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  MessageSquare,
  Building2,
  MapPin,
  ExternalLink,
  Search,
  Filter,
  ArrowRight,
  Briefcase,
  AlertCircle,
} from "lucide-react";

import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { applicationService } from "@/services/apiClient";

const statusStyles = {
  Applied: {
    bg: "bg-slate-100 text-slate-700 border-slate-200",
    icon: Clock,
  },
  Reviewing: {
    bg: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Clock,
  },
  Shortlisted: {
    bg: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: CheckCircle2,
  },
  Interviewing: {
    bg: "bg-purple-50 text-purple-700 border-purple-200",
    icon: Calendar,
  },
  Offered: {
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200 font-bold",
    icon: CheckCircle2,
  },
  Rejected: {
    bg: "bg-rose-50 text-rose-700 border-rose-200",
    icon: XCircle,
  },
};

export default function StudentApplicationsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    applicationService.getMyApplications().then((res) => {
      if (isMounted && res && Array.isArray(res)) {
        const mapped = res.map((app) => ({
          id: app._id || app.id,
          internshipId: app.internship?._id || app.internshipId || "",
          companyName: app.internship?.company || app.companyName || "Partner Company",
          role: app.internship?.role || app.role || "Internship Role",
          location: app.internship?.location || app.location || "Remote",
          workType: app.internship?.mode || app.workType || "Remote",
          stipend: app.internship?.stipendText || app.stipend || "Competitive",
          appliedDate: app.createdAt
            ? new Date(app.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            : "Recently",
          status: app.status
            ? app.status.charAt(0).toUpperCase() + app.status.slice(1).toLowerCase()
            : "Applied",
          stageNotes: app.notes || "Application submitted successfully.",
          recruiterName: app.internship?.postedBy?.name || "Hiring Team",
          recruiterRole: "Talent Acquisition",
          skillsMatched: app.internship?.skills || [],
          logo: app.internship?.companyLogo || "",
        }));
        setApplications(mapped);
      }
      setLoading(false);
    }).catch(() => {
      if (isMounted) setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const tabs = [
    "All",
    "Applied",
    "Reviewing",
    "Shortlisted",
    "Interviewing",
    "Offered",
    "Rejected",
  ];

  const filteredApplications = applications.filter((app) => {
    const matchesTab = activeTab === "All" || app.status === activeTab;
    const matchesSearch =
      app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.skillsMatched.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <DashboardSidebar />

      <main className="flex-1 md:ml-[220px] flex flex-col min-w-0 pb-16">
        <DashboardHeader />

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <FileText className="w-6 h-6 text-[#4B9C93]" />
                My Internship Applications
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Track your active hiring pipelines, recruiter interview schedules, and released offers
              </p>
            </div>

            <Link
              href="/student/internships"
              className="px-4 py-2.5 bg-[#4B9C93] hover:bg-[#3d867e] text-white text-xs font-semibold rounded-xl transition-colors shadow-2xs inline-flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Briefcase className="w-4 h-4" />
              Discover More Internships
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Total Applied
              </p>
              <p className="text-xl font-extrabold text-slate-900 mt-0.5">
                {applications.length}
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                In Active Stages
              </p>
              <p className="text-xl font-extrabold text-blue-600 mt-0.5">
                {applications.filter((a) => ["Reviewing", "Shortlisted", "Interviewing"].includes(a.status)).length}
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Offers Received
              </p>
              <p className="text-xl font-extrabold text-emerald-600 mt-0.5">
                {applications.filter((a) => a.status === "Offered").length}
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Response Rate
              </p>
              <p className="text-xl font-extrabold text-[#4B9C93] mt-0.5">
                100%
              </p>
            </div>
          </div>

          {/* Search & Tabs */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by company, role title, or skill..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4B9C93]"
                />
              </div>

              {/* Status Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      activeTab === tab
                        ? "bg-[#4B9C93] text-white shadow-2xs"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Applications List */}
          <div className="space-y-4">
            {filteredApplications.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-sm text-slate-800">
                  No applications found
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  You do not have any applications matching "{activeTab}". Browse open internships to submit an application.
                </p>
                <Link
                  href="/student/internships"
                  className="inline-block mt-2 px-4 py-2 bg-[#4B9C93] text-white text-xs font-semibold rounded-xl hover:bg-[#3d867e] transition-colors"
                >
                  Browse Internships
                </Link>
              </div>
            ) : (
              filteredApplications.map((app) => {
                const StatusIcon = statusStyles[app.status]?.icon || Clock;
                const statusBadgeStyle = statusStyles[app.status]?.bg || "bg-slate-100 text-slate-700";

                return (
                  <div
                    key={app.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all p-5 sm:p-6 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <img
                          src={app.logo}
                          alt={app.companyName}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="space-y-1">
                          <h3 className="font-bold text-sm sm:text-base text-slate-900">
                            {app.role}
                          </h3>
                          <p className="text-xs font-semibold text-[#4B9C93]">
                            {app.companyName}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {app.location}
                            </span>
                            <span>•</span>
                            <span className="font-medium text-slate-700">
                              {app.stipend}
                            </span>
                            <span>•</span>
                            <span>Applied on {app.appliedDate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Status Tag */}
                      <div className="self-start sm:self-auto">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border ${statusBadgeStyle}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {app.status}
                        </span>
                      </div>
                    </div>

                    {/* Stage Notes / Next Steps */}
                    {app.stageNotes && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-[#4B9C93] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-900">Stage Update: </span>
                          <span>{app.stageNotes}</span>
                        </div>
                      </div>
                    )}

                    {/* Matched Skills & Footer Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-100">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-semibold text-slate-400 mr-1">
                          Skills Matched:
                        </span>
                        {app.skillsMatched.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 rounded-md bg-teal-50 text-[#2b8a78] text-[10px] font-medium"
                          >
                            ✓ {skill}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <Link
                          href="/student/chats"
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                          Chat Recruiter
                        </Link>
                        <Link
                          href={`/internships/${app.internshipId}`}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                        >
                          View Posting
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
