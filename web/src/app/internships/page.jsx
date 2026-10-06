"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  X,
  Bookmark,
  Check,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import InternshipCard from "@/features/internships/InternshipCard";
import { mockInternships } from "@/features/internships/mockData";

/**
 * InternshipsPage — Interactive Internship Discovery Feed with Swipe Deck Physics.
 *
 * Features:
 * - Interactive Framer Motion card stack (Tinder-style gesture & button navigation).
 * - Drag physics with horizontal translation, dynamic rotation, and ACCEPT/REJECT overlay stamps.
 * - Stacking depth effect (subtle scaling and Y-offset for background cards).
 * - Synchronized bottom action buttons (Reject, Save, Accept).
 * - Empty state with interactive reload deck button.
 * - Tab navigation and search input filter.
 */
export default function InternshipsPage() {
  const [cards, setCards] = useState(mockInternships);
  const [activeTab, setActiveTab] = useState("Internships");
  const [searchQuery, setSearchQuery] = useState("");
  const [buttonSwipeDirection, setButtonSwipeDirection] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const tabs = ["Internships", "Jobs", "Companies"];

  // Filter cards based on search query
  const filteredCards = cards.filter(
    (card) =>
      card.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Show action feedback toast
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Handle card swipe (drag release or button trigger)
  const handleCardSwipe = (direction) => {
    if (cards.length === 0) return;

    const activeCard = cards[0];
    let actionLabel = "";
    if (direction === "right") actionLabel = `Accepted ${activeCard.roleTitle}`;
    else if (direction === "left") actionLabel = `Passed on ${activeCard.roleTitle}`;
    else if (direction === "save") actionLabel = `Saved ${activeCard.roleTitle}`;

    showToast(actionLabel);

    // Remove top card from state
    setCards((prevCards) => prevCards.slice(1));
    setButtonSwipeDirection(null);
  };

  // Trigger swipe animation from action buttons
  const triggerButtonSwipe = (direction) => {
    if (cards.length === 0 || buttonSwipeDirection) return;
    setButtonSwipeDirection(direction);
    setTimeout(() => {
      handleCardSwipe(direction);
    }, 300);
  };

  // Reload internships when deck is empty
  const handleReloadDeck = () => {
    setCards(mockInternships);
    setSearchQuery("");
    showToast("Reloaded internship deck!");
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      {/* ──── Left Sidebar ──── */}
      <DashboardSidebar />

      {/* ──── Main Content Area ──── */}
      <div className="flex-1 ml-[220px] flex flex-col min-h-screen relative">
        {/* ──── Top Header Bar ──── */}
        <DashboardHeader />

        {/* ──── Toast Notification ──── */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-gray-900/90 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg backdrop-blur-xs flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#2EB89D]" />
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ──── Main Feed Section ──── */}
        <main className="flex-1 flex flex-col items-center px-4 sm:px-6 py-6 overflow-y-auto">
          {/* ──── Search Bar ──── */}
          <div className="w-full max-w-[600px] flex items-center gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                id="internship-search"
                type="text"
                placeholder="search for internships, jobs, companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#2EB89D] focus:ring-2 focus:ring-[#2EB89D]/10 shadow-sm transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Button */}
            <button
              id="filter-btn"
              aria-label="Filters"
              className="w-11 h-11 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-300 shadow-sm transition-all cursor-pointer"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* ──── Tab Toggles ──── */}
          <div className="flex items-center gap-3 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                id={`tab-${tab.toLowerCase()}`}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === tab
                    ? "bg-[#2EB89D] text-white shadow-md shadow-[#2EB89D]/20"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ──── Swipeable Card Stack Deck ──── */}
          <div className="relative w-full max-w-[480px] h-[470px] mb-8 flex items-center justify-center">
            {filteredCards.length > 0 ? (
              <AnimatePresence>
                {filteredCards.slice(0, 3).map((internship, index) => {
                  const isTop = index === 0;
                  return (
                    <InternshipCard
                      key={internship.id}
                      internship={internship}
                      isTopCard={isTop}
                      indexOffset={index}
                      onSwipe={handleCardSwipe}
                      swipeDirection={isTop ? buttonSwipeDirection : null}
                    />
                  );
                })}
              </AnimatePresence>
            ) : (
              /* ──── Empty State Card ──── */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[480px] bg-white rounded-2xl p-8 border border-gray-100 shadow-xl shadow-black/5 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#E6F7F3] border border-[#2EB89D]/20 flex items-center justify-center text-[#2EB89D] mb-4">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  All caught up! 🎉
                </h3>
                <p className="text-sm text-gray-500 max-w-[320px] mb-6 leading-relaxed">
                  No more internships right now. You can reload the list to review the opportunities again.
                </p>
                <button
                  id="reload-deck-btn"
                  onClick={handleReloadDeck}
                  className="px-6 py-2.5 rounded-full bg-[#2EB89D] text-white text-sm font-semibold hover:bg-[#269a83] active:scale-95 shadow-md shadow-[#2EB89D]/25 transition-all duration-200 flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reload Internships
                </button>
              </motion.div>
            )}
          </div>

          {/* ──── Action Controls ──── */}
          <div className="flex items-center gap-8 mb-8">
            {/* Reject */}
            <div className="flex flex-col items-center gap-1.5">
              <button
                id="action-reject"
                onClick={() => triggerButtonSwipe("left")}
                disabled={filteredCards.length === 0}
                aria-label="Reject internship"
                className={`w-14 h-14 rounded-full bg-white border-2 border-red-400 flex items-center justify-center text-red-400 shadow-md shadow-red-100/50 transition-all duration-200 cursor-pointer ${
                  filteredCards.length === 0
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-red-50 hover:scale-110 active:scale-95"
                }`}
              >
                <X className="w-6 h-6" strokeWidth={2.5} />
              </button>
              <span className="text-xs text-gray-500 font-medium">Reject</span>
            </div>

            {/* Save */}
            <div className="flex flex-col items-center gap-1.5">
              <button
                id="action-save"
                onClick={() => triggerButtonSwipe("save")}
                disabled={filteredCards.length === 0}
                aria-label="Save internship"
                className={`w-14 h-14 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center text-gray-400 shadow-md shadow-gray-100/50 transition-all duration-200 cursor-pointer ${
                  filteredCards.length === 0
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-gray-50 hover:border-gray-400 hover:text-gray-600 hover:scale-110 active:scale-95"
                }`}
              >
                <Bookmark className="w-6 h-6" strokeWidth={2} />
              </button>
              <span className="text-xs text-gray-500 font-medium">Save</span>
            </div>

            {/* Accept */}
            <div className="flex flex-col items-center gap-1.5">
              <button
                id="action-accept"
                onClick={() => triggerButtonSwipe("right")}
                disabled={filteredCards.length === 0}
                aria-label="Accept internship"
                className={`w-14 h-14 rounded-full bg-white border-2 border-[#2EB89D] flex items-center justify-center text-[#2EB89D] shadow-md shadow-[#2EB89D]/10 transition-all duration-200 cursor-pointer ${
                  filteredCards.length === 0
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-[#E6F7F3] hover:scale-110 active:scale-95"
                }`}
              >
                <Check className="w-6 h-6" strokeWidth={2.5} />
              </button>
              <span className="text-xs text-gray-500 font-medium">Accept</span>
            </div>
          </div>

          {/* Card counter progress dots */}
          <div className="flex items-center gap-1.5 mb-4">
            {mockInternships.map((card, i) => {
              const isSwiped = !filteredCards.some((c) => c.id === card.id);
              const isCurrent = filteredCards.length > 0 && filteredCards[0].id === card.id;

              return (
                <div
                  key={card.id}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    isCurrent
                      ? "w-6 bg-[#2EB89D]"
                      : isSwiped
                      ? "w-1.5 bg-[#2EB89D]/40"
                      : "w-1.5 bg-gray-200"
                  }`}
                />
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
