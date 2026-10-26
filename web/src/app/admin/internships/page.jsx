"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building2,
  MapPin,
  ExternalLink,
  Eye,
  SlidersHorizontal,
  ChevronDown,
  Trash2,
  ShieldCheck,
  Star,
  Clock,
  ArrowRight,
} from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { internshipService, adminService, apiRequest } from "@/services/apiClient";

export default function AdminInternshipsPage() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    internshipService.list({}).then((res) => {
      if (isMounted && res && Array.isArray(res)) {
        const mapped = res.map((item) => ({
          id: item._id || item.id,
          company: item.company,
          role: item.role,
          location: item.location || "Remote",
          mode: item.mode || "remote",
          stipend: item.stipendText || (item.stipendMin ? `₹${item.stipendMin} - ₹${item.stipendMax} / mo` : "Competitive"),
          duration: item.duration || "3 Months",
          postedDate: item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent",
          status: item.status || "active",
          isVerified: item.isVerified ?? true,
          isFeatured: item.isFeatured ?? false,
          applicantsCount: item.applicantsCount || 0,
          skills: item.skills || [],
          applicationUrl: item.applicationUrl || "",
          description: item.description || "",
        }));
        setInternships(mapped);
      }
      setLoading(false);
    }).catch(() => {
      if (isMounted) setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const filteredInternships = useMemo(() => {
    return internships.filter((item) => {
      const matchSearch =
        item.role.toLowerCase().includes(search.toLowerCase()) ||
        item.company.toLowerCase().includes(search.toLowerCase()) ||
        item.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));

      const matchStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "featured"
          ? item.isFeatured
          : item.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [internships, search, statusFilter]);

  const handleApprove = (id) => {
    setInternships((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "active", isVerified: true } : item
      )
    );
    adminService.moderateInternship(id, { status: "active", isVerified: true });
    triggerToast("Internship approved and marked active!");
    if (selectedJob?.id === id) {
      setSelectedJob((prev) => ({ ...prev, status: "active", isVerified: true }));
    }
  };

  const handleSuspend = (id) => {
    setInternships((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "suspended", isFeatured: false } : item
      )
    );
    adminService.moderateInternship(id, { status: "suspended", isFeatured: false });
    triggerToast("Internship posting suspended.");
    if (selectedJob?.id === id) {
      setSelectedJob((prev) => ({ ...prev, status: "suspended", isFeatured: false }));
    }
  };

  const handleToggleFeature = (id) => {
    setInternships((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const next = !item.isFeatured;
          adminService.moderateInternship(id, { isFeatured: next });
          triggerToast(next ? "Added to Launchpad Featured!" : "Removed from Featured.");
          return { ...item, isFeatured: next };
        }
        return item;
      })
    );
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to permanently delete this posting?")) {
      setInternships((prev) => prev.filter((item) => item.id !== id));
      if (selectedJob?.id === id) setSelectedJob(null);
      try {
        await apiRequest(`/admin/internships/${id}`, "DELETE");
      } catch {}
      triggerToast("Internship deleted successfully.");
    }
  };

  const counts = {
    total: internships.length,
    active: internships.filter((i) => i.status === "active").length,
    pending: internships.filter((i) => i.status === "pending_review").length,
    featured: internships.filter((i) => i.isFeatured).length,
  };

  return (
    <div className="min-h-screen bg-[#F7F9F9] flex">
      <DashboardSidebar />

      <div className="flex-1 md:ml-[220px] ml-0 flex flex-col min-h-screen relative">
        <DashboardHeader
          title="Internship Moderation & Review"
          subtitle="Audit campus listings, approve new company submissions, and feature opportunities on Launchpad"
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="p-4 rounded-2xl bg-[#E6F7F3] border border-[#4B9C93]/30 text-[#0D9488] text-sm font-semibold flex items-center gap-2 shadow-sm animate-fade-in">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Metric Cards Header */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total Listings</p>
                <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{counts.total}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-700 flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Active & Live</p>
                <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">{counts.active}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Pending Review</p>
                <h3 className="text-2xl font-extrabold text-amber-600 mt-1">{counts.pending}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Featured Launchpad</p>
                <h3 className="text-2xl font-extrabold text-[#4B9C93] mt-1">{counts.featured}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#E6F7F3] text-[#4B9C93] flex items-center justify-center">
                <Star className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Controls: Search & Tabs */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by role, company or skills..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-[#4B9C93] bg-gray-50/50"
                />
              </div>

              {/* Status Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
                {[
                  { id: "all", label: "All Listings" },
                  { id: "active", label: "Active" },
                  { id: "pending_review", label: "Pending Review" },
                  { id: "suspended", label: "Suspended" },
                  { id: "featured", label: "Featured" },
                ].map((chip) => (
                  <button
                    key={chip.id}
                    onClick={() => setStatusFilter(chip.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                      statusFilter === chip.id
                        ? "bg-[#4B9C93] text-white shadow-xs"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Internships Table / Grid */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    <th className="py-3 px-3">Role & Company</th>
                    <th className="py-3 px-3">Location & Mode</th>
                    <th className="py-3 px-3">Stipend</th>
                    <th className="py-3 px-3">Applicants</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs sm:text-sm">
                  {filteredInternships.map((job) => (
                    <tr
                      key={job.id}
                      className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                      onClick={() => setSelectedJob(job)}
                    >
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100 text-[#4B9C93] flex items-center justify-center font-bold shrink-0">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-gray-900 group-hover:text-[#4B9C93] transition-colors">
                                {job.role}
                              </span>
                              {job.isFeatured && (
                                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-extrabold border border-amber-200">
                                  <Star className="w-3 h-3 text-amber-500" />
                                  Featured
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">{job.company}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="text-gray-700 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          <span>{job.location}</span>
                        </div>
                        <span className="text-[11px] capitalize text-gray-400 font-medium">
                          {job.mode}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 font-semibold text-gray-800">
                        {job.stipend}
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">
                          {job.applicantsCount} Applied
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        {job.status === "active" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Active
                          </span>
                        )}
                        {job.status === "pending_review" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                            <Clock className="w-3 h-3" />
                            Pending
                          </span>
                        )}
                        {job.status === "suspended" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                            <XCircle className="w-3 h-3" />
                            Suspended
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            title={job.isFeatured ? "Unfeature" : "Feature on Launchpad"}
                            onClick={() => handleToggleFeature(job.id)}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                              job.isFeatured
                                ? "bg-amber-50 border-amber-300 text-amber-600"
                                : "border-gray-200 text-gray-400 hover:text-amber-500 hover:bg-amber-50"
                            }`}
                          >
                            <Star className="w-4 h-4 fill-current" />
                          </button>

                          {job.status !== "active" ? (
                            <button
                              title="Approve & Publish"
                              onClick={() => handleApprove(job.id)}
                              className="p-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              title="Suspend Listing"
                              onClick={() => handleSuspend(job.id)}
                              className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 cursor-pointer"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            title="Delete"
                            onClick={() => handleDelete(job.id)}
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredInternships.length === 0 && (
                <div className="text-center py-12 text-gray-400 text-sm">
                  No internships match your filter criteria.
                </div>
              )}
            </div>
          </div>

          {/* Job Details Modal Drawer */}
          {selectedJob && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E6F7F3] text-[#0D9488]">
                      {selectedJob.company}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-2">
                      {selectedJob.role}
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {selectedJob.location} · {selectedJob.mode} · {selectedJob.duration}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 cursor-pointer"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <p className="text-gray-400 font-semibold">Stipend</p>
                    <p className="font-bold text-gray-800 mt-0.5">{selectedJob.stipend}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-semibold">Applicants</p>
                    <p className="font-bold text-gray-800 mt-0.5">{selectedJob.applicantsCount} candidates</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-semibold">Status</p>
                    <p className="font-bold text-emerald-600 mt-0.5 capitalize">{selectedJob.status}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Description</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{selectedJob.description}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map((sk, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-xl bg-gray-100 text-gray-700 text-xs font-semibold">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Application URL</h4>
                  <a
                    href={selectedJob.applicationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#4B9C93] hover:underline flex items-center gap-1 font-semibold"
                  >
                    {selectedJob.applicationUrl} <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                  <button
                    onClick={() => handleToggleFeature(selectedJob.id)}
                    className="px-4 py-2 rounded-xl border border-amber-300 bg-amber-50 text-amber-800 text-xs font-bold cursor-pointer"
                  >
                    {selectedJob.isFeatured ? "Remove Featured" : "Feature on Launchpad"}
                  </button>

                  {selectedJob.status !== "active" ? (
                    <button
                      onClick={() => handleApprove(selectedJob.id)}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                    >
                      Approve & Publish
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSuspend(selectedJob.id)}
                      className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
                    >
                      Suspend Listing
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
