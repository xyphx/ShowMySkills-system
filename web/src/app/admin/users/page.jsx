"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  SlidersHorizontal,
  ShieldCheck,
  CheckCircle,
  X,
  ArrowRight,
  Filter,
} from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import StudentRoleTag, { STUDENT_ROLE_TAGS } from "@/components/StudentRoleTag";
import { adminService } from "@/services/apiClient";

export default function AdminUsersPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTagFilter, setSelectedTagFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    adminService.getUsers({ role: "student" }).then((res) => {
      if (isMounted && res && Array.isArray(res)) {
        const mapped = res.map((u, i) => ({
          id: u._id || u.id || i + 1,
          name: u.name,
          email: u.email,
          college: u.college || u.collegeName || "N/A",
          department: u.branch || u.course || u.department || "General",
          tag: u.roleTag || "Regular",
          avatar: u.profileIcon || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || "User")}&background=4B9C93&color=fff&size=180`,
          score: u.reputationScore ?? u.score ?? 0,
          status: "Active",
          joined: u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Recently",
        }));
        setStudents(mapped);
      }
      setLoading(false);
    }).catch(() => {
      if (isMounted) setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const tagOptions = Object.keys(STUDENT_ROLE_TAGS);

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
    const target = students.find((s) => s.id === studentId);
    setToastMessage(`Assigned '${newTag}' system tag to ${target?.name || "Student"}`);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const filtered = students.filter((s) => {
    if (selectedTagFilter !== "all" && s.tag !== selectedTagFilter) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.college.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q) ||
      s.tag.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#F7F9F9] flex">
      <DashboardSidebar />

      <div className="flex-1 md:ml-[220px] ml-0 flex flex-col min-h-screen relative pb-12">
        <DashboardHeader
          title="Users & Handles"
          subtitle="Manage student community tags, single-role policy, and platform privileges"
        />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full">
          {/* Header Banner */}
          <div className="bg-[#181E29] text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Tag Governance</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Student System Role Tags Directory
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
                Students drive all platform features. Each student profile has <strong className="text-white">strictly one tag</strong>: Admin, Maintainer, Promoter, Contributor, or Ambassador.
              </p>
            </div>

            {toastMessage && (
              <div className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold shadow-md animate-in fade-in">
                ✓ {toastMessage}
              </div>
            )}
          </div>

          {/* Tag Policy Reference Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-8">
            {tagOptions.map((tagKey) => {
              const conf = STUDENT_ROLE_TAGS[tagKey];
              const count = students.filter((s) => s.tag === tagKey).length;
              return (
                <div
                  key={tagKey}
                  onClick={() => setSelectedTagFilter(selectedTagFilter === tagKey ? "all" : tagKey)}
                  className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer shadow-xs ${
                    selectedTagFilter === tagKey
                      ? "ring-2 ring-[#4B9C93] border-transparent"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <StudentRoleTag tag={tagKey} size="xs" />
                    <span className="text-lg font-extrabold text-gray-900">{count}</span>
                  </div>
                  <div className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                    {conf.desc}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Directory Panel */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
            {/* Filter / Search Bar */}
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#F8FAFC]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-1">
                  Tag Filter:
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedTagFilter("all")}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    selectedTagFilter === "all"
                      ? "bg-[#181E29] text-white shadow-xs"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-slate-100"
                  }`}
                >
                  All ({students.length})
                </button>
                {tagOptions.map((tagKey) => {
                  const isSelected = selectedTagFilter === tagKey;
                  return (
                    <button
                      key={tagKey}
                      type="button"
                      onClick={() => setSelectedTagFilter(isSelected ? "all" : tagKey)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 bg-white border ${
                        isSelected
                          ? "ring-2 ring-[#4B9C93] border-transparent shadow-xs"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <StudentRoleTag tag={tagKey} size="xs" />
                    </button>
                  );
                })}
              </div>

              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search students, emails, colleges..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#4B9C93]"
                />
              </div>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-[#F9FAFB] text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="py-3.5 px-6">Student</th>
                    <th className="py-3.5 px-6">College / Program</th>
                    <th className="py-3.5 px-6">Current Tag</th>
                    <th className="py-3.5 px-6">Assign New Tag (Admin Control)</th>
                    <th className="py-3.5 px-6 text-right">Reputation Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400">
                        No students found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={st.avatar}
                            alt={st.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-100 shrink-0"
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
