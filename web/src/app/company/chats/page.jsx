"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Send,
  Search,
  Paperclip,
  CheckCheck,
  GraduationCap,
} from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { chatService } from "@/services/apiClient";

export default function CompanyChatsPage() {
  const [convList, setConvList] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [inputText, setInputText] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    let isMounted = true;
    chatService.getConversations().then((res) => {
      if (isMounted && res && Array.isArray(res) && res.length > 0) {
        setConvList(res);
        setActiveConv(res[0]);
        setChatMessages(res[0].messages || []);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const text = inputText.trim();
    const newMsg = {
      sender: "company",
      text,
      time: "Just now",
    };
    setChatMessages((prev) => [...prev, newMsg]);
    setInputText("");

    if (activeConv) {
      chatService.sendMessage(text, activeConv.id, activeConv.conversationId || activeConv.id);
    }
  };

  const handleSelectConversation = (conv) => {
    setActiveConv(conv);
    setChatMessages(conv.messages || []);
  };

  return (
    <div className="min-h-screen bg-[#F7F9F9] flex">
      <DashboardSidebar />

      <div className="flex-1 md:ml-[220px] ml-0 flex flex-col min-h-screen relative">
        <DashboardHeader />

        <main className="flex-1 p-6 sm:p-8 max-w-6xl mx-auto w-full flex flex-col h-[calc(100vh-80px)]">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Candidate Messages</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Direct communication channel with applied students and prospective candidates
            </p>
          </div>

          <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden flex flex-col sm:flex-row min-h-[500px]">
            {/* Left: Chat List */}
            <div className="w-full sm:w-80 border-r border-gray-100 flex flex-col">
              <div className="p-4 border-b border-gray-100">
                <div className="relative flex items-center bg-[#F9FAFB] rounded-xl px-3 py-2 border border-gray-200">
                  <Search className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search candidate chats..."
                    className="w-full bg-transparent pl-2 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                {convList.length === 0 ? (
                  <div className="p-8 text-center text-xs text-gray-400">
                    No active candidate chats found.
                  </div>
                ) : (
                  convList.map((conv) => {
                    const active = activeConv?.id === conv.id;
                    return (
                      <button
                        key={conv.id}
                        onClick={() => handleSelectConversation(conv)}
                        className={`w-full p-4 text-left flex items-start gap-3 transition-colors cursor-pointer ${
                          active ? "bg-[#E6F7F3]/40 border-r-4 border-[#4B9C93]" : "hover:bg-gray-50/60"
                        }`}
                      >
                        <img
                          src={conv.avatar}
                          alt={conv.name}
                          className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-gray-900 truncate">
                              {conv.name}
                            </span>
                            <span className="text-[10px] text-gray-400">{conv.time}</span>
                          </div>
                          <p className="text-[11px] text-[#4B9C93] font-semibold truncate">
                            {conv.role}
                          </p>
                          <p className="text-[11px] text-gray-500 truncate mt-0.5">
                            {conv.lastMessage}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right: Active Chat Window */}
            {activeConv ? (
              <div className="flex-1 flex flex-col bg-[#FAFBFB]">
                {/* Chat Header */}
                <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeConv.avatar}
                      alt={activeConv.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-gray-900">{activeConv.name}</h3>
                      <p className="text-xs text-gray-400">{activeConv.college} • {activeConv.role}</p>
                    </div>
                  </div>
                  <Link
                    href={`/company/applications?candidate=${activeConv.id}`}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#E6F7F3] text-[#4B9C93] hover:bg-[#d8f3ec] transition-colors"
                  >
                    View Application
                  </Link>
                </div>

              {/* Chat History */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {chatMessages.map((msg, idx) => {
                  const isCompany = msg.sender === "company";
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col ${isCompany ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs font-medium leading-relaxed shadow-2xs ${
                          isCompany
                            ? "bg-[#4B9C93] text-white rounded-br-xs"
                            : "bg-white text-gray-800 border border-gray-100 rounded-bl-xs"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[9.5px] text-gray-400 mt-1 px-1">
                        {msg.time}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Input Form */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 bg-white border-t border-gray-100 flex items-center gap-3"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type an interview update, request, or question..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#4B9C93] focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  className="w-9 h-9 rounded-full bg-[#4B9C93] hover:bg-[#3d867e] text-white flex items-center justify-center shrink-0 cursor-pointer shadow-xs transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400 text-xs">
                <MessageSquare className="w-10 h-10 text-gray-300 mb-2" />
                <p className="font-semibold text-gray-600">No conversation selected</p>
                <p className="text-gray-400 mt-1">Select an applicant to review application notes and send updates</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
