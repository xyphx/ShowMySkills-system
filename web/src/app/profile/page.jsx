"use client";

import { MessageSquare, Bell } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import ProfileHeader from "@/features/profile/ProfileHeader";
import CompletionBanner from "@/features/profile/CompletionBanner";
import ReputationCard from "@/features/profile/ReputationCard";
import AboutCard from "@/features/profile/AboutCard";
import SkillsCard from "@/features/profile/SkillsCard";
import ProjectsCard from "@/features/profile/ProjectsCard";
import { studentProfileData } from "@/features/profile/mockData";

/**
 * StudentProfilePage — Task STU-02 - Student Profile View.
 *
 * Follows the same Sidebar + Header + Content layout pattern
 * established by the Internships page. Renders data-driven
 * profile cards from studentProfileData mock.
 */
export default function StudentProfilePage() {
  const data = studentProfileData;

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      {/* ──── Left Sidebar ──── */}
      <DashboardSidebar />

      {/* ──── Main Content Area ──── */}
      <div className="flex-1 ml-[220px] flex flex-col min-h-screen">
        {/* ──── Top Header Bar ──── */}
        <header
          id="profile-page-header"
          className="sticky top-0 z-30 bg-white px-6 sm:px-8 py-4 flex items-center justify-between border-b border-gray-100"
        >
          {/* Left: Page Title */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Student Profile
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Manage and showcase your verified achievements, skills and
              projects
            </p>
          </div>

          {/* Right: Plan Badge + Icons + Avatar */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center text-xs font-semibold text-[#2EB89D] bg-[#E6F7F3] border border-[#2EB89D]/20 rounded-full px-4 py-1.5">
              Free Plane
            </span>

            <button
              id="profile-header-chat-btn"
              aria-label="Messages"
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            <button
              id="profile-header-notification-btn"
              aria-label="Notifications"
              className="relative w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <div
              id="profile-header-avatar"
              className="w-9 h-9 rounded-full bg-[#2EB89D] text-white flex items-center justify-center text-sm font-bold cursor-pointer hover:ring-2 hover:ring-[#2EB89D]/30 transition-all"
            >
              B
            </div>
          </div>
        </header>

        {/* ──── Scrollable Content ──── */}
        <main className="flex-1 overflow-y-auto px-6 sm:px-8 py-6">
          <div className="max-w-[900px] mx-auto space-y-5">
            {/* Profile Identity Card */}
            <ProfileHeader data={data} />

            {/* Profile Completion Progress */}
            <CompletionBanner percentage={data.completionPercentage} />

            {/* Skill Reputation Score */}
            <ReputationCard data={data} />

            {/* About */}
            <AboutCard text={data.aboutText} />

            {/* Skills */}
            <SkillsCard skills={data.skillsList} />

            {/* Projects */}
            <ProjectsCard projects={data.projectsList} />
          </div>
        </main>
      </div>
    </div>
  );
}
