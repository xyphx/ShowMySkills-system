"use client";

import { MessageSquare, Bell } from "lucide-react";

/**
 * DashboardHeader — Top header bar for the dashboard layout.
 *
 * Renders the user greeting, plan badge, chat/notification icons,
 * and user avatar. Sticky-positioned at the top of the main content area.
 */
export default function DashboardHeader() {
  return (
    <header
      id="dashboard-header"
      className="sticky top-0 z-30 bg-white px-6 sm:px-8 py-4 flex items-center justify-between border-b border-gray-100"
    >
      {/* ──── Left: Greeting ──── */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Welcome back, Bindhu
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Here&apos;s how your profile is performing this week
        </p>
      </div>

      {/* ──── Right: Plan Badge + Icons + Avatar ──── */}
      <div className="flex items-center gap-3">
        {/* Free Plan Badge */}
        <span className="hidden sm:inline-flex items-center text-xs font-semibold text-[#2EB89D] bg-[#E6F7F3] border border-[#2EB89D]/20 rounded-full px-4 py-1.5">
          Free Plan
        </span>

        {/* Chat Icon */}
        <button
          id="header-chat-btn"
          aria-label="Messages"
          className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
        </button>

        {/* Notification Bell */}
        <button
          id="header-notification-btn"
          aria-label="Notifications"
          className="relative w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User Avatar */}
        <div
          id="header-avatar"
          className="w-9 h-9 rounded-full bg-[#2EB89D] text-white flex items-center justify-center text-sm font-bold cursor-pointer hover:ring-2 hover:ring-[#2EB89D]/30 transition-all"
        >
          B
        </div>
      </div>
    </header>
  );
}
