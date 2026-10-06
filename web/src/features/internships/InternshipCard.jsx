"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import {
  MapPin,
  Wallet,
  CalendarDays,
  Clock,
  BadgeCheck,
  CheckCircle,
  XCircle,
  BookmarkCheck,
} from "lucide-react";

/**
 * InternshipCard — Interactive, swipeable card with drag physics & visual feedback.
 *
 * Supports:
 * - Touch & mouse drag gesture with dynamic rotation (-18deg to +18deg).
 * - Animated visual stamps ("ACCEPT" green stamp on swipe right, "REJECT" red stamp on left).
 * - Deck stacking depth scaling (scale down & offset when underneath top card).
 * - Programmatic swipe triggers via action buttons.
 *
 * @param {{
 *   internship: import('./mockData').mockInternships[number],
 *   isTopCard: boolean,
 *   indexOffset: number,
 *   onSwipe: (direction: 'left' | 'right' | 'save') => void,
 *   swipeDirection?: 'left' | 'right' | 'save' | null,
 * }} props
 */
export default function InternshipCard({
  internship,
  isTopCard = false,
  indexOffset = 0,
  onSwipe,
  swipeDirection = null,
}) {
  const {
    companyName,
    companyLogoText,
    companyLogoSubText,
    roleTitle,
    location,
    stipend,
    duration,
    skills,
    isVerified,
    jobType,
    postedTime,
    description,
  } = internship;

  // Motion value for X translation during drag
  const x = useMotionValue(0);

  // Rotation proportional to horizontal drag (-18deg at -250px, +18deg at +250px)
  const rotate = useTransform(x, [-250, 250], [-18, 18]);

  // Swipe Stamp Opacities
  const acceptStampOpacity = useTransform(x, [20, 120], [0, 1]);
  const rejectStampOpacity = useTransform(x, [-20, -120], [0, 1]);

  // Handle drag end threshold check
  const handleDragEnd = (_, info) => {
    if (!isTopCard) return;
    const swipeThreshold = 110;
    const velocityThreshold = 400;

    if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      onSwipe?.("right");
    } else if (
      info.offset.x < -swipeThreshold ||
      info.velocity.x < -velocityThreshold
    ) {
      onSwipe?.("left");
    }
  };

  // Stack calculation for background cards
  const targetScale = 1 - indexOffset * 0.05;
  const targetY = indexOffset * 12;
  const targetOpacity = 1 - indexOffset * 0.15;
  const cardZIndex = 50 - indexOffset * 10;

  // Variants for exit animations (triggered by button clicks or drag releases)
  const variants = {
    initial: {
      scale: targetScale,
      y: targetY,
      opacity: targetOpacity,
      x: 0,
      rotate: 0,
      zIndex: cardZIndex,
    },
    animate: {
      scale: targetScale,
      y: targetY,
      opacity: targetOpacity,
      zIndex: isTopCard ? 50 : cardZIndex,
      transition: { duration: 0.25, ease: "easeOut" },
    },
    exit: (direction) => {
      if (direction === "left") {
        return {
          x: -500,
          rotate: -25,
          opacity: 0,
          zIndex: 1000,
          transition: { duration: 0.3, ease: "easeIn" },
        };
      }
      if (direction === "right") {
        return {
          x: 500,
          rotate: 25,
          opacity: 0,
          zIndex: 1000,
          transition: { duration: 0.3, ease: "easeIn" },
        };
      }
      if (direction === "save") {
        return {
          y: -250,
          scale: 0.85,
          opacity: 0,
          zIndex: 1000,
          transition: { duration: 0.3, ease: "easeIn" },
        };
      }
      return { opacity: 0, zIndex: 1000 };
    },
  };

  return (
    <motion.div
      id={`internship-card-${internship.id}`}
      style={
        isTopCard
          ? {
              x,
              rotate,
              touchAction: "none",
            }
          : {}
      }
      custom={swipeDirection}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      drag={isTopCard ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      whileTap={isTopCard ? { cursor: "grabbing" } : {}}
      className={`absolute top-0 w-full max-w-[480px] bg-white rounded-2xl shadow-xl shadow-black/8 border border-gray-100 overflow-hidden select-none ${
        isTopCard ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
      }`}
    >
      {/* ──── ACCEPT Overlay Stamp (Swiping Right) ──── */}
      {isTopCard && (
        <motion.div
          style={{ opacity: acceptStampOpacity }}
          className="absolute top-6 left-6 z-40 border-4 border-[#2EB89D] text-[#2EB89D] bg-white/90 backdrop-blur-xs font-black text-lg sm:text-xl px-4 py-1 rounded-xl rotate-[-12deg] flex items-center gap-1.5 shadow-lg pointer-events-none"
        >
          <CheckCircle className="w-6 h-6 stroke-[3]" />
          ACCEPT
        </motion.div>
      )}

      {/* ──── REJECT Overlay Stamp (Swiping Left) ──── */}
      {isTopCard && (
        <motion.div
          style={{ opacity: rejectStampOpacity }}
          className="absolute top-6 right-6 z-40 border-4 border-red-500 text-red-500 bg-white/90 backdrop-blur-xs font-black text-lg sm:text-xl px-4 py-1 rounded-xl rotate-[12deg] flex items-center gap-1.5 shadow-lg pointer-events-none"
        >
          <XCircle className="w-6 h-6 stroke-[3]" />
          REJECT
        </motion.div>
      )}

      {/* ──── Company Logo Area ──── */}
      <div className="relative px-5 pt-5 pb-3">
        <div className="w-full h-[140px] rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center gap-1">
          <span className="text-2xl font-extrabold text-[#2EB89D] tracking-wider">
            {companyLogoText}
          </span>
          <span className="text-[10px] font-semibold text-gray-400 tracking-[0.25em] uppercase">
            {companyLogoSubText}
          </span>
        </div>

        {/* Verified Badge */}
        {isVerified && (
          <span className="absolute top-8 right-8 inline-flex items-center gap-1 text-[11px] font-semibold text-[#2EB89D] bg-[#E6F7F3] border border-[#2EB89D]/20 rounded-full px-2.5 py-0.5">
            <BadgeCheck className="w-3 h-3" />
            verified
          </span>
        )}
      </div>

      {/* ──── Card Body ──── */}
      <div className="px-5 pb-5">
        {/* Role Title & Company */}
        <h2 className="text-[17px] font-bold text-gray-900 leading-snug">
          {roleTitle}
        </h2>
        <p className="text-sm text-gray-500 mt-0.5 mb-3">{companyName}</p>

        {/* ──── Metadata Row ──── */}
        <div className="flex items-center gap-5 text-[13px] text-gray-600 mb-3">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            {location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-gray-400" />
            {stipend}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5 text-gray-400" />
            {duration}
          </span>
        </div>

        {/* ──── Description ──── */}
        <p className="text-[13px] text-gray-500 leading-relaxed mb-4 line-clamp-2">
          <span className="text-gray-400 mr-1">📋</span>
          {description}
        </p>

        {/* ──── Skills Tags ──── */}
        <div className="flex flex-wrap gap-2 mb-4">
          {skills.map((skill) => (
            <span
              key={skill}
              className="text-[11px] font-semibold text-[#2EB89D] bg-[#E6F7F3] px-3 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* ──── Footer ──── */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-[11px] font-medium text-gray-500 border border-gray-200 rounded-full px-3 py-1">
            {jobType}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-gray-400">
            <Clock className="w-3 h-3" />
            {postedTime}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
