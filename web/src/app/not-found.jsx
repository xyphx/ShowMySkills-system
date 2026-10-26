"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#4B9C93] flex flex-col justify-between items-center p-4 overflow-hidden pb-10 px-6 sm:px-12 font-sans">
      {/* Top Navigation Bar */}
      <nav className="flex w-full items-center justify-between px-2 relative z-20">
        <Link href="/" className="flex items-center group">
          <img
            src="/logo.png"
            alt="ShowMySkills Logo"
            className="h-14 sm:h-16 w-auto my-1"
          />
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="h-10 sm:h-11 px-5 sm:px-6 flex items-center justify-center cursor-pointer bg-white hover:bg-[#F7F9F9] active:scale-95 text-[#181E29] rounded-full font-semibold text-sm sm:text-base transition-all shadow-xs"
          >
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Main Card Container */}
      <div className="relative w-full flex-1 bg-[#F7F9F9] border-t border-[#E2E8F0] shadow-[0_4px_25px_rgba(0,0,0,0.03)] rounded-[32px] sm:rounded-[44px] overflow-hidden flex flex-col justify-center items-center py-12 sm:py-16 px-6 text-center my-4">
        
        {/* Logo */}
        <div className="mb-6">
          <img
            src="/logo.png"
            alt="ShowMySkills"
            className="h-20 sm:h-24 w-auto object-contain mx-auto"
          />
        </div>

        {/* 404 Text - Pure Brand Color Theme, No Gradients */}
        <span className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tight text-[#4B9C93] leading-none select-none">
          404
        </span>

        {/* Title */}
        <h1 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#181E29] tracking-tight">
          Page Not Available
        </h1>

        {/* Simple Description */}
        <p className="mt-3 text-sm sm:text-base text-[#4A5565] max-w-md mx-auto leading-relaxed">
          The page you are looking for does not exist or has been moved.
        </p>

        {/* Action Buttons Matching Brand Aesthetic */}
        <div className="mt-8 flex flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="cursor-pointer bg-white hover:bg-slate-50 active:scale-95 text-[#181E29] border border-gray-900 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition-all shadow-xs"
          >
            Go Back
          </button>

          <Link
            href="/"
            className="cursor-pointer bg-[#4B9C93] hover:bg-[#3d867e] active:scale-95 text-white px-7 sm:px-9 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition-all shadow-xs"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
