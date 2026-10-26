"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  Globe,
  Award,
  ShieldCheck,
  Edit3,
  Users,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Save,
} from "lucide-react";

import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { authService } from "@/services/apiClient";

export default function CollegeProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    collegeName: "",
    tagline: "",
    about: "",
    establishedYear: "",
    nirfRank: "Not ranked",
    accreditation: "Pending accreditation",
    location: "",
    email: "",
    tpoEmail: "",
    phone: "",
    website: "",
    linkedin: "",
    totalStudents: 0,
    placementRate: "0%",
    highestPackage: "—",
    averagePackage: "—",
    departments: [],
    topRecruiters: [],
  });

  useEffect(() => {
    let isMounted = true;
    authService.getCurrentUser().then((user) => {
      if (isMounted && user) {
        setProfile((prev) => ({
          ...prev,
          collegeName: user.collegeProfile?.collegeName || user.name || prev.collegeName,
          email: user.email || prev.email,
          location: user.location || prev.location,
          website: user.website || prev.website,
          about: user.bio || prev.about,
        }));
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <DashboardSidebar />

      <main className="flex-1 md:ml-[220px] flex flex-col min-w-0 pb-16">
        <DashboardHeader />

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* ──── Hero Header Banner ──── */}
          <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-xs">
            {/* Cover Banner */}
            <div className="h-44 sm:h-56 bg-gradient-to-r from-[#2b8a78] via-[#3d867e] to-[#1e5d51] relative">
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute right-6 top-6 flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-3.5 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold rounded-xl border border-white/30 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>
            </div>

            {/* Profile Avatar & Primary Info */}
            <div className="px-6 sm:px-8 pb-6 pt-0 relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-14 sm:-mt-16">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white p-2 shadow-lg border border-slate-200 flex items-center justify-center shrink-0">
                  <div className="w-full h-full rounded-xl bg-teal-50 flex items-center justify-center text-[#2b8a78]">
                    <Building2 className="w-12 h-12" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                      {profile.collegeName}
                    </h1>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Verified Institution
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {profile.tagline} • Est. {profile.establishedYear}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {profile.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors inline-flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5" />
                  Website
                </a>
                <Link
                  href="/college/students"
                  className="px-3.5 py-2 bg-[#2b8a78] hover:bg-[#237062] text-white text-xs font-semibold rounded-xl transition-colors inline-flex items-center gap-1.5 shadow-xs"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  Student Roster
                </Link>
              </div>
            </div>
          </div>

          {/* ──── Key Institutional Highlights ──── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Overall Placement
              </span>
              <p className="text-2xl font-extrabold text-[#2b8a78] mt-1">
                {profile.placementRate}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">2025-2026 Season</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Highest Package
              </span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                {profile.highestPackage}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Campus Recruit</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Average Package
              </span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                {profile.averagePackage}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Engineering cohorts</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Enrolled Students
              </span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                {profile.totalStudents}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Across 8 departments</p>
            </div>
          </div>

          {/* ──── Main Content Grid ──── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: About & Departments */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Institution */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-3">
                <h2 className="text-base font-bold text-slate-900">
                  About Institution
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {profile.about}
                </p>
              </div>

              {/* Academic Departments */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
                <h2 className="text-base font-bold text-slate-900">
                  Academic Departments & Engineering Faculties
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {profile.departments.length === 0 ? (
                    <p className="text-xs text-slate-400">No departments configured yet.</p>
                  ) : (
                    profile.departments.map((dept) => (
                      <div
                        key={dept}
                        className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center gap-2.5 text-xs font-semibold text-slate-800"
                      >
                        <div className="w-2 h-2 rounded-full bg-[#2b8a78]" />
                        <span>{dept}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Top Recruiting Partners */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
                <h2 className="text-base font-bold text-slate-900">
                  Key Corporate Recruiting Partners
                </h2>
                <div className="flex flex-wrap gap-2">
                  {profile.topRecruiters.length === 0 ? (
                    <p className="text-xs text-slate-400">No recruiting partners configured yet.</p>
                  ) : (
                    profile.topRecruiters.map((company) => (
                      <span
                        key={company}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {company}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Contact & Accreditations */}
            <div className="space-y-6">
              {/* Accreditations */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  Recognitions & Standards
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 text-amber-900">
                    <p className="font-bold">Accreditation</p>
                    <p className="text-[11px] text-amber-800 mt-0.5">
                      {profile.accreditation}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-200/60 text-blue-900">
                    <p className="font-bold">NIRF Ranking</p>
                    <p className="text-[11px] text-blue-800 mt-0.5">
                      {profile.nirfRank}
                    </p>
                  </div>
                </div>
              </div>

              {/* Placement Cell Contacts */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Placement & TPO Contacts
                </h3>
                <div className="space-y-3 text-xs text-slate-600">
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">TPO Email</p>
                      <p className="font-medium text-slate-800">{profile.tpoEmail}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Contact Phone</p>
                      <p className="font-medium text-slate-800">{profile.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Official Website</p>
                      <a href={profile.website} target="_blank" rel="noreferrer" className="font-medium text-[#2b8a78] hover:underline">
                        {profile.website}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
