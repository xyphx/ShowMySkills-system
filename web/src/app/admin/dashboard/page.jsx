"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  Building2,
  Briefcase,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  Sliders,
  Settings,
  Search,
} from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import StudentRoleTag, { STUDENT_ROLE_TAGS } from "@/components/StudentRoleTag";
import { adminService } from "@/services/apiClient";

export default function AdminDashboardPage() {
  const [verifications, setVerifications] = useState([]);
  const [adminApplications, setAdminApplications] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedTagFilter, setSelectedTagFilter] = useState("all");
  const [studentSearch, setStudentSearch] = useState("");
  const [tagToast, setTagToast] = useState("");
  const [adminActionToast, setAdminActionToast] = useState("");
  const [overview, setOverview] = useState({
    totalStudents: 0,
    totalCompanies: 0,
    totalInternships: 0,
    totalApplications: 0,
  });

  useEffect(() => {
    let isMounted = true;
    adminService.getOverview().then((res) => {
      if (isMounted && res) {
        setOverview(res);
      }
    }).catch(() => {});

    adminService.getUsers({ role: "student" }).then((res) => {
      if (isMounted && res && Array.isArray(res)) {
        const mapped = res.map((u, i) => ({
          id: u._id || u.id || i + 1,
          name: u.name,
          email: u.email,
          college: u.college || "",
          department: u.branch || u.course || "",
          tag: u.roleTag || "Student",
          avatar: u.profileIcon || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || "Student")}&background=4B9C93&color=fff&size=180`,
          score: u.reputationScore ?? u.score ?? 0,
        }));
        setStudents(mapped);
      }
    }).catch(() => {});

    adminService.getVerifications({}).then((res) => {
      if (isMounted && res && Array.isArray(res)) {
        setVerifications(res);
      }
    }).catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const tagOptions = Object.keys(STUDENT_ROLE_TAGS);

  const handleApproveAdminApp = async (appId) => {
    const targetApp = adminApplications.find((a) => a.id === appId);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      await fetch(
        `${baseUrl.replace(/\/$/, "")}/admin-applications/${appId}/approve`,
        { method: "POST" }
      ).catch(() => {});
    } catch {}

    setAdminApplications((prev) => prev.filter((a) => a.id !== appId));
    setAdminActionToast(
      `Approved ${targetApp?.name || "Applicant"}. Admin access granted, and their photo is now activated as their public profile icon.`
    );
    setTimeout(() => setAdminActionToast(""), 5000);
  };

  const handleRejectAdminApp = async (appId) => {
    const targetApp = adminApplications.find((a) => a.id === appId);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      await fetch(
        `${baseUrl.replace(/\/$/, "")}/admin-applications/${appId}/reject`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason: "Declined by core admin review" }),
        }
      ).catch(() => {});
    } catch {}

    setAdminApplications((prev) => prev.filter((a) => a.id !== appId));
    setAdminActionToast(`Declined application for ${targetApp?.name || "Applicant"}.`);
    setTimeout(() => setAdminActionToast(""), 4000);
  };

  const handleApprove = (id) => {
    setVerifications((prev) => prev.filter((item) => item.id !== id));
    adminService.reviewVerification(id, "verified");
  };

  const handleTagChange = (studentId, newTag) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          return { ...s, tag: newTag };
        }
        return s;
      })
    );
    adminService.updateRoleTag(studentId, newTag);
    const targetStudent = students.find((s) => s.id === studentId);
    setTagToast(`Updated ${targetStudent?.name || "Student"}'s tag to ${newTag}`);
    setTimeout(() => setTagToast(""), 3500);
  };

  const filteredStudents = students.filter((s) => {
    if (selectedTagFilter !== "all" && s.tag !== selectedTagFilter) {
      return false;
    }
    if (!studentSearch.trim()) return true;
    const q = studentSearch.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.college.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q) ||
      s.tag.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#F7F9F9] flex">
      <DashboardSidebar />

      <div className="flex-1 md:ml-[220px] ml-0 flex flex-col min-h-screen relative">
        <DashboardHeader />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full">
    
          {/* Toast / Notification Banners */}
          {adminActionToast && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-semibold flex items-center justify-between shadow-xs">
              <span className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                {adminActionToast}
              </span>
              <button
                onClick={() => setAdminActionToast("")}
                className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* KPI Cards */}
          {(() => {
            const kpiList = [
              { label: "Registered Students", value: (overview.totalStudents ?? 0).toLocaleString(), status: "Live campus students", icon: Users, color: "text-[#4B9C93]", bg: "bg-[#E6F7F3]" },
              { label: "Partner Companies", value: (overview.totalCompanies ?? 0).toLocaleString(), status: "Registered employers", icon: Building2, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Active Internships", value: (overview.totalInternships ?? 0).toLocaleString(), status: "Open positions", icon: Briefcase, color: "text-purple-600", bg: "bg-purple-50" },
              { label: "Applications Tracked", value: (overview.totalApplications ?? 0).toLocaleString(), status: "Total student submissions", icon: CheckCircle, color: "text-amber-600", bg: "bg-amber-50" },
            ];

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {kpiList.map(({ label, value, status, icon: Icon, color, bg }) => (
                  <div
                    key={label}
                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        {label}
                      </span>
                      <div className={`w-9 h-9 rounded-xl ${bg} ${color} flex items-center justify-center`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-extrabold text-gray-900">{value}</div>
                      <div className="text-xs text-emerald-600 font-medium mt-1">{status}</div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* ──── Admin Access Requests Review (Core Admin Authorization) ──── */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#009689]" />
                  <h3 className="text-lg font-bold text-gray-900">
                    Admin Access Applications (Core Admin Review)
                  </h3>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Applicants request admin access with fixed official destination verification and consent. Accounts are only created after approval.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 self-start sm:self-auto">
                {adminApplications.length} Pending Application{adminApplications.length === 1 ? "" : "s"}
              </span>
            </div>

            {adminApplications.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400">
                No pending admin access applications to review.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-[#F9FAFB] text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    <tr>
                      <th className="py-3.5 px-6">Applicant</th>
                      <th className="py-3.5 px-6">DOB & Contact</th>
                      <th className="py-3.5 px-6">Recommender</th>
                      <th className="py-3.5 px-6">Photo Consent</th>
                      <th className="py-3.5 px-6">Applicant Note</th>
                      <th className="py-3.5 px-6 text-right">Core Admin Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {adminApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={app.photoUrl}
                              alt={app.name}
                              className="w-10 h-10 rounded-full object-cover border border-[#009689]"
                            />
                            <div>
                              <div className="font-bold text-gray-900 text-sm">
                                {app.name}
                              </div>
                              <div className="text-xs text-gray-500 font-mono">
                                {app.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-xs text-gray-600">
                          <div>DOB: <span className="font-semibold text-gray-800">{app.dob}</span></div>
                          <div className="text-gray-500">{app.phone}</div>
                        </td>
                        <td className="py-4 px-6 text-xs font-medium text-gray-800">
                          {app.recommendedBy}
                        </td>
                        <td className="py-4 px-6">
                          {app.photoConsent ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              Public Icon Consent Given
                            </span>
                          ) : (
                            <span className="text-xs text-red-600 font-bold">
                              No Consent
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-xs text-gray-500 max-w-[200px] truncate" title={app.notes}>
                          {app.notes || <span className="italic text-gray-400">No notes provided</span>}
                        </td>
                        <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                          <button
                            onClick={() => handleApproveAdminApp(app.id)}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#009689] text-white hover:bg-[#007e73] transition-colors cursor-pointer shadow-2xs"
                          >
                            Approve Admin
                          </button>
                          <button
                            onClick={() => handleRejectAdminApp(app.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Verification & Moderation Queue */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Verification & Credential Approvals
                </h3>
                <p className="text-xs text-gray-500">
                  Pending audits for institution handles, company profiles, and student skill verifications
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                {verifications.length} Pending
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-[#F9FAFB] text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="py-3.5 px-6">Entity / User</th>
                    <th className="py-3.5 px-6">Institution / Region</th>
                    <th className="py-3.5 px-6">Credential / Skill</th>
                    <th className="py-3.5 px-6">Audit Type</th>
                    <th className="py-3.5 px-6 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {verifications.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 font-bold text-gray-900">
                        {item.name}
                      </td>
                      <td className="py-4 px-6 text-xs text-gray-500">
                        {item.college}
                      </td>
                      <td className="py-4 px-6 font-medium text-gray-800">
                        <span className="inline-flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-[#4B9C93]" />
                          {item.skill}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium">
                          {item.type}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => handleApprove(item.id)}
                          className="px-3 py-1 rounded-lg text-xs font-bold bg-[#4B9C93] text-white hover:bg-[#3d867e] transition-colors cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleApprove(item.id)}
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                          Dismiss
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ──── Student System Role Tag Management (Admin, Maintainer, Intern, Contributor, Ambassador) ──── */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E6F7F3] text-[#0D9488] text-[11px] font-bold border border-[#0D9488]/20 mb-1">
                  <span>Single-Tag Assignment Policy</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Student System Role Tags Assignment
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Students run platform functions with strictly one assigned system role: <span className="font-semibold text-gray-700">Admin, Maintainer, Promoter, Contributor, or Ambassador</span>
                </p>
              </div>

              {/* Toast confirmation */}
              {tagToast && (
                <div className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold animate-in fade-in">
                  ✓ {tagToast}
                </div>
              )}
            </div>

            {/* Quick Tag Filter & Search */}
            <div className="p-6 border-b border-gray-100 bg-[#F8FAFC] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-1">
                  Filter:
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedTagFilter("all")}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    selectedTagFilter === "all"
                      ? "bg-[#181E29] text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-slate-100"
                  }`}
                >
                  All ({students.length})
                </button>
                {tagOptions.map((tagKey) => {
                  const count = students.filter((s) => s.tag === tagKey).length;
                  const isSelected = selectedTagFilter === tagKey;
                  return (
                    <button
                      key={tagKey}
                      type="button"
                      onClick={() => setSelectedTagFilter(isSelected ? "all" : tagKey)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 bg-white border ${
                        isSelected
                          ? "ring-2 ring-[#4B9C93] border-transparent shadow-xs"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <StudentRoleTag tag={tagKey} size="xs" />
                      <span className="text-[10px] text-gray-400">({count})</span>
                    </button>
                  );
                })}
              </div>

              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Search students..."
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#4B9C93]"
                />
              </div>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-[#F9FAFB] text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="py-3.5 px-6">Student Profile</th>
                    <th className="py-3.5 px-6">College / Department</th>
                    <th className="py-3.5 px-6">Current Assigned Tag</th>
                    <th className="py-3.5 px-6">Assign New Tag (1 Per Student)</th>
                    <th className="py-3.5 px-6 text-right">Reputation Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={st.avatar}
                            alt={st.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-100"
                          />
                          <div>
                            <div className="font-bold text-gray-900 text-sm flex items-center gap-2">
                              <span>{st.name}</span>
                              <StudentRoleTag tag={st.tag} size="xs" />
                            </div>
                            <div className="text-xs text-gray-400 font-mono mt-0.5">{st.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-xs text-gray-600">
                        <div className="font-semibold text-gray-800">{st.college}</div>
                        <div className="text-gray-500 text-[11px] mt-0.5">{st.department}</div>
                      </td>

                      <td className="py-4 px-6">
                        <StudentRoleTag tag={st.tag} size="sm" />
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <select
                            value={st.tag}
                            onChange={(e) => handleTagChange(st.id, e.target.value)}
                            aria-label={`Assign tag for ${st.name}`}
                            className="text-xs font-semibold text-gray-800 bg-white border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#4B9C93] focus:ring-1 focus:ring-[#4B9C93] shadow-2xs cursor-pointer"
                          >
                            {tagOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt} ({STUDENT_ROLE_TAGS[opt]?.desc.split(" ")[0]})
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <span className="font-mono font-bold text-xs text-[#0D9488] bg-[#CCFBF1] px-2.5 py-1 rounded-md">
                          ★ {st.score}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
