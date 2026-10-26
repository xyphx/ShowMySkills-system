"use client";

import Link from "next/link";
import { ShieldCheck, ArrowLeft, FileText, CheckCircle2 } from "lucide-react";

export default function TermsOfServicePage() {
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
            Legal & Governance
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-slate-500 text-sm">
            Last Updated: October 2026 • Effective Immediately
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-10 space-y-8 text-sm leading-relaxed text-slate-700">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-700 font-bold">1</span>
              Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, registering an account, or taking technical assessments on ShowMySkills (“Platform”, “we”, “our”), you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service. If you are entering into these terms on behalf of a college, university, or corporate recruiter, you warrant that you possess full legal authority to bind that entity.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-700 font-bold">2</span>
              User Roles and Account Eligibility
            </h2>
            <div className="space-y-2">
              <p>ShowMySkills provides specialized workflows for four primary account classifications:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>Students & Candidates:</strong> Must be at least 16 years of age and enrolled in or graduated from an accredited educational institution. Accurate college identity documents must be provided upon request.</li>
                <li><strong>Companies & Corporate Recruiters:</strong> Must represent legitimate registered companies and provide verifiable business email domains. Posting fraudulent, non-compensating, or fee-charging openings is strictly grounds for immediate permanent termination.</li>
                <li><strong>Colleges & Training and Placement Officers (TPOs):</strong> Must possess legitimate institutional authority to verify student rosters and coordinate campus recruitment drives.</li>
                <li><strong>Administrators:</strong> Governed by strict confidentiality and multi-factor authentication requirements to oversee handle assignments and integrity audits.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-700 font-bold">3</span>
              Assessment Integrity & Anti-Cheating Code
            </h2>
            <p>
              ShowMySkills issues cryptographic verification badges based on standardized competency evaluations. You agree to take all technical assessments independently without unauthorized third-party proxy assistance, generative AI bot automation during proctored challenges, or plagiarism of proprietary solutions. Any attempt to tamper with test telemetry will result in immediate badge revocation and permanent account blacklisting.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-700 font-bold">4</span>
              Zero-Fee Candidate Guarantee
            </h2>
            <p>
              ShowMySkills maintains a strict zero-tolerance policy against charging candidates any fee to apply, interview, or secure internships. Corporate employers who demand monetary deposits, training package purchases, or application charges will have their accounts immediately seized and reported to appropriate law enforcement authorities.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-700 font-bold">5</span>
              Intellectual Property
            </h2>
            <p>
              Students retain full ownership of original code, personal projects, and portfolio materials uploaded to the platform. By submitting code to automated grading sandboxes, candidates grant ShowMySkills a non-exclusive license solely to execute, evaluate, and benchmark code performance for credentialing.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-700 font-bold">6</span>
              Limitation of Liability
            </h2>
            <p>
              ShowMySkills provides the platform and skill benchmarks on an "AS IS" and "AS AVAILABLE" basis. While we verify candidate proficiency and vet participating companies, ShowMySkills is not an employer or employment agency and is not liable for hiring outcomes, contractual breaches, or employer workplace conditions.
            </p>
          </section>

          <section className="pt-4 border-t border-slate-200 text-xs text-slate-500">
            For questions or legal inquiries regarding these terms, please contact <a href="mailto:legal@showmyskills.com" className="text-[#4B9C93] underline font-semibold">legal@showmyskills.com</a>.
          </section>
        </div>
      </main>
    </div>
  );
}
