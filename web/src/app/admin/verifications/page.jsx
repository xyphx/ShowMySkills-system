"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  ShieldCheck,
  Search,
  Filter,
  GraduationCap,
  Building2,
  ExternalLink,
  Eye,
  CheckCircle2,
  AlertCircle,
  UserCheck,
} from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { adminService } from "@/services/apiClient";

export default function AdminVerificationsPage() {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedVer, setSelectedVer] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    adminService.getVerifications({}).then((res) => {
      if (isMounted && res && Array.isArray(res)) {
        setVerifications(res);
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

  const filteredVerifications = useMemo(() => {
    return verifications.filter((item) => {
      const matchSearch =
        item.applicantName.toLowerCase().includes(search.toLowerCase()) ||
        item.applicantEmail.toLowerCase().includes(search.toLowerCase()) ||
        item.institution.toLowerCase().includes(search.toLowerCase());

      const matchStatus = statusFilter === "all" ? true : item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [verifications, search, statusFilter]);

  const handleApprove = (id) => {
    setVerifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "approved" } : item
      )
    );
    adminService.reviewVerification(id, "verified");
    triggerToast("Verification approved! User granted verified status.");
    if (selectedVer?.id === id) {
      setSelectedVer((prev) => ({ ...prev, status: "approved" }));
    }
  };

  const handleReject = (id) => {
    const note = rejectionReason || "Document could not be validated against records.";
    setVerifications((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "rejected",
              notes: note,
            }
          : item
      )
    );
    adminService.reviewVerification(id, "rejected", note);
    setRejectionReason("");
    triggerToast("Verification request rejected with feedback note.");
    if (selectedVer?.id === id) {
      setSelectedVer((prev) => ({ ...prev, status: "rejected" }));
    }
  };

  const counts = {
    total: verifications.length,
    pending: verifications.filter((v) => v.status === "pending").length,
    approved: verifications.filter((v) => v.status === "approved").length,
    rejected: verifications.filter((v) => v.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-[#F7F9F9] flex">
      <DashboardSidebar />

      <div className="flex-1 md:ml-[220px] ml-0 flex flex-col min-h-screen relative">
        <DashboardHeader
          title="Verification Approvals"
          subtitle="Audit submitted student college IDs, corporate credentials, and skill certifications"
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="p-4 rounded-2xl bg-[#E6F7F3] border border-[#4B9C93]/30 text-[#0D9488] text-sm font-semibold flex items-center gap-2 shadow-sm animate-fade-in">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Metric Counters */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total Requests</p>
                <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{counts.total}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-700 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Pending Audit</p>
                <h3 className="text-2xl font-extrabold text-amber-600 mt-1">{counts.pending}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Approved & Verified</p>
                <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">{counts.approved}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Rejected</p>
                <h3 className="text-2xl font-extrabold text-rose-600 mt-1">{counts.rejected}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <XCircle className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Filter & Table Container */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, email or college..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-[#4B9C93] bg-gray-50/50"
                />
              </div>

              {/* Status Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
                {[
                  { id: "all", label: "All Requests" },
                  { id: "pending", label: "Pending" },
                  { id: "approved", label: "Approved" },
                  { id: "rejected", label: "Rejected" },
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

            {/* Verifications Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    <th className="py-3 px-3">Applicant & Role</th>
                    <th className="py-3 px-3">Verification Type</th>
                    <th className="py-3 px-3">Institution / Org</th>
                    <th className="py-3 px-3">Submitted</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs sm:text-sm">
                  {filteredVerifications.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                      onClick={() => setSelectedVer(item)}
                    >
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100 text-[#4B9C93] flex items-center justify-center font-bold shrink-0">
                            {item.role === "company" ? (
                              <Building2 className="w-5 h-5" />
                            ) : (
                              <GraduationCap className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 group-hover:text-[#4B9C93] transition-colors">
                              {item.applicantName}
                            </span>
                            <p className="text-xs text-gray-500 mt-0.5">{item.applicantEmail}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 font-medium text-gray-700">
                        {item.type}
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="text-gray-900 font-semibold">{item.institution}</span>
                        <p className="text-[11px] text-gray-400">{item.department}</p>
                      </td>

                      <td className="py-3.5 px-3 text-gray-500">
                        {item.submittedDate}
                      </td>

                      <td className="py-3.5 px-3">
                        {item.status === "approved" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Approved
                          </span>
                        )}
                        {item.status === "pending" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                            <Clock className="w-3 h-3" />
                            Pending
                          </span>
                        )}
                        {item.status === "rejected" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                            <XCircle className="w-3 h-3" />
                            Rejected
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            title="Inspect Document"
                            onClick={() => setSelectedVer(item)}
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {item.status !== "approved" && (
                            <button
                              title="Approve"
                              onClick={() => handleApprove(item.id)}
                              className="p-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                          {item.status !== "rejected" && (
                            <button
                              title="Reject"
                              onClick={() => setSelectedVer(item)}
                              className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 cursor-pointer"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredVerifications.length === 0 && (
                <div className="text-center py-12 text-gray-400 text-sm">
                  No verification items match your query.
                </div>
              )}
            </div>
          </div>

          {/* Modal Audit View */}
          {selectedVer && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E6F7F3] text-[#0D9488]">
                      {selectedVer.type}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-2">
                      {selectedVer.applicantName}
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {selectedVer.applicantEmail} · {selectedVer.institution}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedVer(null)}
                    className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 cursor-pointer"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Document Uploaded:</span>
                    <span className="font-bold text-gray-800">{selectedVer.docName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Applicant Notes:</span>
                    <span className="text-gray-700 text-right max-w-sm">{selectedVer.notes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Current Status:</span>
                    <span className="font-bold capitalize text-emerald-600">{selectedVer.status}</span>
                  </div>
                </div>

                {/* Document Preview Box */}
                <div className="border border-gray-200 rounded-2xl overflow-hidden bg-slate-900 text-white p-4 flex flex-col items-center justify-center min-h-[200px] text-center">
                  <FileText className="w-12 h-12 text-[#4B9C93] mb-2" />
                  <p className="text-sm font-semibold">{selectedVer.docName}</p>
                  <p className="text-xs text-slate-400 mt-1">Encrypted High-Resolution Document Verification</p>
                  <a
                    href={selectedVer.docPreview}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    Open Full Inspection Scan <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Rejection Feedback Note input */}
                {selectedVer.status === "pending" && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Rejection Reason (if rejecting)</label>
                    <input
                      type="text"
                      placeholder="e.g. Document image is blurry or expired"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#4B9C93]"
                    />
                  </div>
                )}

                <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                  <button
                    onClick={() => handleReject(selectedVer.id)}
                    className="px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold cursor-pointer"
                  >
                    Reject Application
                  </button>
                  <button
                    onClick={() => handleApprove(selectedVer.id)}
                    className="px-6 py-2 rounded-xl bg-[#4B9C93] hover:bg-[#3d867e] text-white text-xs font-bold cursor-pointer shadow-sm"
                  >
                    Approve & Grant Verified Badge
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
