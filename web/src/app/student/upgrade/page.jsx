"use client";

import Link from "next/link";
import { ArrowLeft, Rocket, CheckCircle2, ShieldCheck } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";

export default function UpgradePlanPage() {
  return (
    <div className="min-h-screen bg-[#F7F9F9] flex">
      <DashboardSidebar />

      <div className="flex-1 md:ml-[220px] ml-0 flex flex-col min-h-screen relative">
        <DashboardHeader
          title="Plans & Membership"
          subtitle="All platform tools and internship applications are currently 100% free"
        />

        <main className="flex-1 p-4 sm:p-8 max-w-4xl mx-auto w-full flex items-center justify-center">
          <div className="w-full bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm text-center flex flex-col items-center max-w-2xl">
            {/* Status Icon */}
            <div className="w-16 h-16 rounded-3xl bg-[#E6F7F3] text-[#4B9C93] flex items-center justify-center mb-6 shadow-xs ring-8 ring-[#E6F7F3]/50">
              <Rocket className="w-8 h-8" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200 mb-3">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Paid Plans Currently Not Available
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
              Everything is Free for All Students
            </h2>

            <p className="text-sm sm:text-base text-gray-500 max-w-lg mb-8 leading-relaxed">
              ShowMySkills is dedicated to student talent. All features — including internship searches, verified skill assessments, direct chat, and recruiter spotlights — are fully available at zero cost.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md text-left mb-8">
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-gray-50 border border-gray-100 text-xs font-semibold text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-[#4B9C93] shrink-0" />
                <span>Unlimited Internship Applications</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-gray-50 border border-gray-100 text-xs font-semibold text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-[#4B9C93] shrink-0" />
                <span>Direct Peer & Recruiter Chat</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-gray-50 border border-gray-100 text-xs font-semibold text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-[#4B9C93] shrink-0" />
                <span>Verified Skill Assessments</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-gray-50 border border-gray-100 text-xs font-semibold text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-[#4B9C93] shrink-0" />
                <span>Custom Public Portfolio & Roles</span>
              </div>
            </div>

            <Link
              href="/student/internships"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#4B9C93] hover:bg-[#3d867e] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#4B9C93]/20 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Internships</span>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}

