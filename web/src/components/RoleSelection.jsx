// components/RoleSelection.jsx
import React from "react";
import Image from "next/image";
import { GraduationCap, Briefcase, Building2 } from "lucide-react";

const roles = [
  {
    id: "student",
    title: "Student",
    description: "Showcase your skills, build your profile, and discover opportunities.",
    icon: "🎓",
  },
  {
    id: "company",
    title: "Company",
    description: "Discover talented candidates and hire for your opportunities.",
    icon: "💼",
  },
  {
    id: "college",
    title: "College",
    description: "Connect your students with internships and track career outcomes.",
    icon: "🏫",
  },
];

export default function RoleSelection({ onSelectRole }) {
  return (
    <div className="min-h-screen bg-[#2b8a78] flex items-center justify-center p-4 lg:p-8">
      {/* Outer Main Container */}
      <div className="w-full max-w-6xl bg-[#2b8a78] rounded-3xl overflow-hidden flex flex-col lg:flex-row min-h-[620px]">
        
        {/* Left Section: Branding & Image (Hidden on Mobile) */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-10 relative">
          {/* Top Logo */}
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="ShowMySkills Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="text-white text-2xl font-bold tracking-tight">
              ShowMySkills
            </span>
          </div>

          {/* Heading */}
          <div className="mt-8 text-center">
            <h2 className="text-white text-3xl font-extrabold leading-tight">
              Your Skills
            </h2>
            <h2 className="text-white text-3xl font-extrabold leading-tight">
              Infinite Opportunities
            </h2>
          </div>

          {/* Laptop Viewport Image Placeholder */}
          <div className="relative w-full h-80 my-auto flex items-center justify-center">
            <Image
              src="/images/role-selection-illustration.png" // Replace with your laptop image path
              alt="Role Selection Illustration"
              fill
              priority
              className="object-contain drop-shadow-2xl"
            />
          </div>

          {/* Bottom spacing anchor */}
          <div className="h-2"></div>
        </div>

        {/* Right Section: White Card Selector (Displayed on Mobile against Teal Background) */}
        <div className="w-full lg:w-1/2 bg-white rounded-3xl p-6 sm:p-10 flex flex-col justify-between my-auto shadow-2xl min-h-[580px]">
          
          <div>
            {/* Header */}
            <div className="text-center mt-2 mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                What defines you?
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 mt-2 font-medium">
                Choose your account type to get started with ShowMySkills
              </p>
            </div>

            {/* Role Options */}
            <div className="space-y-4">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => onSelectRole && onSelectRole(role.id)}
                  className="w-full text-left p-5 rounded-2xl border border-gray-200 hover:border-[#2b8a78] hover:shadow-md transition-all duration-200 group bg-white focus:outline-none focus:ring-2 focus:ring-[#2b8a78]"
                >
                  <div className="flex items-start gap-3.5">
                    <span className="text-2xl leading-none mt-0.5">{role.icon}</span>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-[#2b8a78] transition-colors">
                        {role.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
                        {role.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Terms Footer */}
          <div className="text-center mt-8 text-[11px] sm:text-xs text-gray-500">
            By continuing, you agree to our{" "}
            <a href="/terms" className="text-sky-600 hover:underline font-medium">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-sky-600 hover:underline font-medium">
              Privacy Policy
            </a>
            .
          </div>

        </div>
      </div>
    </div>
  );
}