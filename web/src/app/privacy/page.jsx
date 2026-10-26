"use client";

import Link from "next/link";
import { Lock, ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-slate-900 font-extrabold text-lg group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#4B9C93] flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span>
              ShowMy<span className="text-[#4B9C93]">Skills</span>
            </span>
          </Link>

          <Link
            href="/login"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Log In
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        {/* Title */}
        <div className="space-y-3">
          <span className="px-3 py-1 bg-teal-50 text-[#2b8a78] text-xs font-bold rounded-full border border-teal-200">
            Privacy & Trust
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-slate-500 text-sm">
            Last Updated: October 2026 • Compliant with DPDP & International Privacy Standards
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-10 space-y-8 text-sm leading-relaxed text-slate-700">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-700 font-bold">1</span>
              Information We Collect
            </h2>
            <div className="space-y-2">
              <p>We collect information to deliver skill verification and internship discovery services:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>Account Credentials:</strong> Full name, verified email address, phone number, encrypted password hash, and designated account role.</li>
                <li><strong>Academic & Portfolio Records:</strong> University name, branch, graduation year, CGPA, uploaded college ID cards, project repositories, and uploaded resume PDFs.</li>
                <li><strong>Skill Assessment Telemetry:</strong> Code submissions, test scores, timestamps, duration, and cryptographic verification hashes.</li>
                <li><strong>Recruiter & Institutional Data:</strong> Company registration, corporate office domains, job postings, and college placement cell metrics.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-700 font-bold">2</span>
              How We Use Your Data
            </h2>
            <p>
              Your data is utilized strictly to provide skill benchmarking, generate verified digital badges, route internship applications to employer applicant tracking systems, enable direct peer and recruiter chat, and produce anonymized NIRF/NAAC placement analytics for affiliated university TPO cells. We do NOT sell user personal information to advertisers or third-party data brokers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-700 font-bold">3</span>
              Candidate Privacy & Visibility Controls
            </h2>
            <p>
              Candidates maintain complete control over their profile visibility via the Settings panel. You can choose whether your profile appears in the public People directory, restrict contact to verified recruiters only, or browse opportunities in stealth mode while currently employed.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-700 font-bold">4</span>
              Security & Encryption Standards
            </h2>
            <p>
              All traffic between your browser and our API servers is encrypted with TLS 1.3. User passwords are encrypted with salted bcrypt hashing, API requests are safeguarded by recursive NoSQL injection sanitizers and tiered rate limiters, and sensitive documents like student college ID cards are stored in access-controlled storage with restrictive file permissions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-700 font-bold">5</span>
              Your Data Rights
            </h2>
            <p>
              You have the right to request access to your personal data, update outdated profile information, export your verified credential transcripts, or request complete account erasure at any time via the Settings tab or by contacting our privacy compliance desk.
            </p>
          </section>

          <section className="pt-4 border-t border-slate-200 text-xs text-slate-500">
            For data protection inquiries or exercising privacy rights, please reach out to <a href="mailto:privacy@showmyskills.com" className="text-[#4B9C93] underline font-semibold">privacy@showmyskills.com</a>.
          </section>
        </div>
      </main>
    </div>
  );
}
