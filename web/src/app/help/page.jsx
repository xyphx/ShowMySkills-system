"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  HelpCircle,
  MessageSquare,
  FileQuestion,
  Mail,
  ChevronDown,
  Search,
  CheckCircle2,
  Send,
  ExternalLink,
  BookOpen,
  LifeBuoy,
} from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { supportService } from "@/services/apiClient";

const faqs = [
  {
    q: "How does skill verification work on ShowMySkills?",
    a: "Skill verification is performed through target technical competency assessments, GitHub repository code inspections, and practical coding challenges on the Launchpad. Once verified, official competency verification and scores appear on your profile and applications.",
  },
  {
    q: "Are paid plans required to apply for internships?",
    a: "No! The Free Student Plan is completely free forever. You can search verified internships, apply to up to 10 openings each month, build your portfolio, and communicate with employers without any fees.",
  },
  {
    q: "How do partner companies view my application?",
    a: "When you apply to an internship, recruiters see your verified competency score, public projects, college department, and resume summary directly inside their ATS pipeline. They can review, shortlist, and message you directly.",
  },
  {
    q: "How can I track my submitted applications?",
    a: "You can track your application status under the Internships section (Saved / Applied tab) and view real-time recruiter updates in your Notifications bell and Chats tab.",
  },
  {
    q: "How do I link my college Training & Placement Cell (TPO)?",
    a: "Enter your university name during profile setup. If your institution is accredited on ShowMySkills, your verified test scores and placement achievements will automatically synchronize with your college placement dashboard.",
  },
];

export default function HelpSupportPage() {
  const [faqList, setFaqList] = useState(faqs);
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(0);
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [ticket, setTicket] = useState({
    subject: "",
    category: "General Inquiry",
    message: "",
  });

  useEffect(() => {
    let isMounted = true;
    supportService.getFaqs("", faqs).then((res) => {
      if (isMounted && res && Array.isArray(res) && res.length > 0) {
        setFaqList(res);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredFaqs = faqList.filter(
    (f) =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    supportService.submitTicket(ticket);
    setTicketSubmitted(true);
    setTicket({ subject: "", category: "General Inquiry", message: "" });
    setTimeout(() => setTicketSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-[#F7F9F9] flex">
      <DashboardSidebar />

      <div className="flex-1 md:ml-[220px] ml-0 flex flex-col min-h-screen relative">
        <DashboardHeader
          title="Help & Support"
          subtitle="Frequently asked questions, student guides, and direct support assistance"
        />

        <main className="flex-1 p-4 sm:p-8 max-w-5xl mx-auto w-full space-y-8">
          {/* Hero Banner with Search */}
          <div className="bg-gradient-to-r from-[#4B9C93] to-[#367971] text-white rounded-3xl p-6 sm:p-10 shadow-sm text-center">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <LifeBuoy className="w-3.5 h-3.5" />
              <span>Student Support Center</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
              How can we help you today?
            </h2>
            <p className="text-white/80 text-xs sm:text-sm max-w-md mx-auto mb-6">
              Find answers to common questions about applications, skill verification, and direct chats.
            </p>

            <div className="max-w-xl mx-auto relative flex items-center bg-white rounded-full px-4 py-2.5 shadow-md">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search help articles, verification rules, applications..."
                className="w-full bg-transparent pl-3 text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Quick Help Channels */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#E6F7F3] text-[#4B9C93] flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Documentation</h4>
                <p className="text-xs text-gray-500 mt-0.5">Explore guides on portfolio building and skill assessments.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Community Discord</h4>
                <p className="text-xs text-gray-500 mt-0.5">Collaborate and chat with student creators, mentors, and developers.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Email Support</h4>
                <p className="text-xs text-gray-500 mt-0.5">support@showmyskills.com — replies within 24 hours.</p>
              </div>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h3>

            <div className="divide-y divide-gray-100">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="py-4">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between text-left gap-3 cursor-pointer group"
                    >
                      <span className="font-bold text-xs sm:text-sm text-gray-800 group-hover:text-[#4B9C93] transition-colors">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${
                          isOpen ? "rotate-180 text-[#4B9C93]" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <p className="mt-2.5 text-xs sm:text-sm text-gray-600 leading-relaxed pr-4">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}

              {filteredFaqs.length === 0 && (
                <div className="py-8 text-center text-xs text-gray-400 font-medium">
                  No questions match your search query.
                </div>
              )}
            </div>
          </div>

          {/* Contact Support Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Submit a Support Ticket
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Can’t find what you’re looking for? Send a direct request to our student success team.
              </p>
            </div>

            {ticketSubmitted && (
              <div className="mb-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 text-xs sm:text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Ticket submitted successfully! Our team will reach out to your registered college email.</span>
              </div>
            )}

            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={ticket.category}
                    onChange={(e) => setTicket({ ...ticket, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm bg-white text-gray-800 focus:outline-none focus:border-[#4B9C93]"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Skill Verification">Skill Verification & Assessments</option>
                    <option value="Internship Applications">Internship Applications</option>
                    <option value="College / TPO Sync">College / TPO Sync</option>
                    <option value="Bug Report">Bug or Technical Issue</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={ticket.subject}
                    onChange={(e) => setTicket({ ...ticket, subject: e.target.value })}
                    placeholder="Brief summary of your question"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#4B9C93]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Message Description
                </label>
                <textarea
                  rows={4}
                  required
                  value={ticket.message}
                  onChange={(e) => setTicket({ ...ticket, message: e.target.value })}
                  placeholder="Describe your issue or inquiry in detail..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#4B9C93]"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#4B9C93] hover:bg-[#3d867e] text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Ticket</span>
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
