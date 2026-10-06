"use client";

import Link from "next/link";
import { Star, Zap, FileText, MessageCircle } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/40 to-sky-50/30 flex flex-col justify-between items-center p-3 sm:p-5 md:p-6 overflow-hidden">
      {/* Top Navigation */}
      <nav className="flex w-full max-w-7xl items-center justify-between px-2 sm:px-4 py-2 relative z-20">
        <Link href="/" className="flex items-center gap-2 group">
          <img
            src="/Logo.jpg"
            alt="ShowMySkills Logo"
            className="h-12 sm:h-14 md:h-16 w-auto object-contain rounded-xl border border-teal-200/60 shadow-sm transition-transform group-hover:scale-105"
          />
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="cursor-pointer bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white px-6 sm:px-7 py-2 sm:py-2.5 rounded-full font-medium text-sm sm:text-base transition-all shadow-md shadow-teal-500/20 hover:scale-105"
          >
            Signup
          </Link>
        </div>
      </nav>

      {/* Main Hero Card Container */}
      <div className="relative w-full max-w-7xl flex-1 my-2 sm:my-3 bg-[#FFF8F0] border border-[#f5ede1] shadow-xl shadow-black/5 rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] overflow-hidden flex flex-col justify-center items-center py-12 md:py-20 px-4 sm:px-8">
        
        {/* Playful Floating Doodles & Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          {/* Top-Right Glowing Stars */}
          <div className="absolute top-8 sm:top-12 md:top-16 right-20 sm:right-32 md:right-44 text-teal-400 opacity-70">
            <Star className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
          </div>
          <div className="absolute hidden md:block top-36 right-16 sm:right-28 text-teal-400 opacity-60">
            <Star className="w-4 h-4 animate-pulse delay-700" />
          </div>

          {/* Top-Left Playful Lightning */}
          <div className="absolute top-6 sm:top-10 md:top-14 left-6 sm:left-14 md:left-24 text-amber-300 opacity-80 rotate-12">
            <Zap className="w-10 h-10 sm:w-12 sm:h-12 animate-bounce" />
          </div>

          {/* Top-Right Horizontal Doodled Bars */}
          <div className="absolute top-16 sm:top-24 md:top-28 right-6 sm:right-10 md:right-16 space-y-2 opacity-60">
            <div className="w-12 h-1 bg-amber-300 rounded-full" />
            <div className="w-16 h-1 bg-amber-300 rounded-full" />
            <div className="w-14 h-1 bg-amber-300 rounded-full" />
            <div className="w-10 h-1 bg-amber-300 rounded-full" />
          </div>

          {/* Middle-Left Chat Bubble & Activity Doodle */}
          <div className="absolute top-1/2 -translate-y-16 left-6 sm:left-10 md:left-16 flex items-center space-x-3 opacity-70">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-300 rounded-full animate-pulse" />
            <div className="space-y-1">
              <div className="w-10 sm:w-12 h-2 bg-blue-200 rounded-full" />
              <div className="w-6 sm:w-8 h-2 bg-blue-200 rounded-full" />
            </div>
            <MessageCircle className="text-blue-400 w-5 h-5" />
          </div>

          {/* Floating Document Outline */}
          <div className="absolute hidden lg:block top-24 left-[18%] opacity-50">
            <FileText className="text-gray-300 w-16 h-16" strokeWidth={1.5} />
          </div>

          {/* Extra Subdued Star */}
          <div className="absolute bottom-36 left-1/3 opacity-40 hidden md:block">
            <Star className="w-4 h-4 text-teal-400" />
          </div>
        </div>

        {/* Hero Center Text Content */}
        <div className="relative z-20 max-w-4xl mx-auto px-4 text-center">
          {/* Main Brand with beta tag */}
          <div className="inline-flex items-center justify-center relative mb-2 sm:mb-3">
            <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-teal-500">
              ShowMySkills
            </span>
            <span className="align-top text-xs sm:text-sm font-semibold text-gray-500 ml-1.5 -mt-3 sm:-mt-4">
              (beta)
            </span>
          </div>

          {/* 3-Line Core Catchphrase */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.8rem] font-bold text-gray-900 leading-tight sm:leading-snug md:leading-[1.15] tracking-tight mb-4 sm:mb-5">
            <span className="block">Create Your Portfolio</span>
            <span className="block">Showcase your skills</span>
            <span className="block">Get discovered</span>
          </h1>

          {/* Value Proposition Description */}
          <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed font-normal">
            A platform that empowers creators, coders, designers, and doers to showcase their skills, rank among the best, and get noticed by peers and professionals.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/login"
              className="cursor-pointer bg-[#FFF8F0]/90 hover:bg-white text-gray-900 border border-gray-900 px-8 sm:px-12 py-2.5 sm:py-3 rounded-full text-base sm:text-lg font-semibold transition-all transform hover:scale-105 shadow-sm"
            >
              More
            </Link>
            <Link
              href="/login"
              className="cursor-pointer bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white px-7 sm:px-9 py-2.5 sm:py-3 rounded-full text-base sm:text-lg font-semibold transition-all transform hover:scale-105 shadow-lg shadow-teal-500/25"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Bottom Left Illustration - Coder */}
        <div className="absolute bottom-0 left-4 sm:left-10 md:left-[10%] lg:left-[13%] z-10 pointer-events-none select-none">
          <img
            src="/coder.png"
            alt="Developer coding at desk"
            className="w-44 sm:w-56 md:w-72 lg:w-80 object-contain drop-shadow-sm"
          />
        </div>

        {/* Bottom Right Illustration - Ideaman */}
        <div className="absolute hidden md:block -bottom-8 lg:-bottom-10 right-4 sm:right-8 md:right-[6%] lg:right-[8%] z-10 pointer-events-none select-none">
          <img
            src="/ideaman.png"
            alt="Creative idea generator"
            className="h-64 sm:h-72 md:h-80 lg:h-92 object-contain drop-shadow-sm"
          />
        </div>
      </div>
    </main>
  );
}
