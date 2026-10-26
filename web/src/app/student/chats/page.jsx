"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import {
  MessageSquare,
  Send,
  Search,
  SlidersHorizontal,
  Star,
  CheckCheck,
  ChevronLeft,
  ArrowRight,
  Smile,
  Paperclip,
  UserCheck,
  Circle,
  ExternalLink,
} from "lucide-react";
import StudentRoleTag, { STUDENT_ROLE_TAGS } from "@/components/StudentRoleTag";
import { chatService } from "@/services/apiClient";

function ChatsContent() {
  const searchParams = useSearchParams();
  const paramUserId = searchParams.get("user");
  const paramUserName = searchParams.get("name");

  const [conversations, setConversations] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTypingReply, setIsTypingReply] = useState(false);
  const [mobileViewChat, setMobileViewChat] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch conversations from API directly
  useEffect(() => {
    let isMounted = true;
    chatService.getConversations().then((res) => {
      if (isMounted && res && Array.isArray(res) && res.length > 0) {
        setConversations(res);
        setActiveChatId(res[0]._id || res[0].id);
      }
    }).catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-select or create candidate thread if URL contains user & name params
  useEffect(() => {
    if (paramUserId) {
      const numId = parseInt(paramUserId, 10);
      const existing = conversations.find((c) => c.id === numId);
      if (existing) {
        setActiveChatId(numId);
        setMobileViewChat(true);
      } else if (paramUserName) {
        // Create new thread for candidate
        const newThread = {
          id: numId,
          name: decodeURIComponent(paramUserName),
          role: "Candidate",
          college: "",
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(decodeURIComponent(paramUserName))}&background=4B9C93&color=fff&size=100`,
          score: 0,
          online: false,
          lastTime: "Just now",
          unread: 0,
          messages: [],
        };
        setConversations((prev) => [newThread, ...prev]);
        setActiveChatId(numId);
        setMobileViewChat(true);
      }
    }
  }, [paramUserId, paramUserName]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, activeChatId, isTypingReply]);

  const activeChat = conversations.find((c) => c.id === activeChatId) || conversations[0];

  const handleSendMessage = (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text || !activeChat) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: "me",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "delivered",
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeChat.id) {
          return {
            ...c,
            lastTime: "Just now",
            unread: 0,
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    // Call chatService in background; fails gracefully if backend is offline
    chatService.sendMessage(text, activeChat.id, activeChat.conversationId || activeChat.id);

    setInputText("");
  };

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const quickPrompts = [
    `👋 Hey ${activeChat?.name?.split(" ")[0] || "there"}, loved your portfolio!`,
    `🚀 Would you be open to collaborating on a hackathon project?`,
    `✨ Really impressed with your verified technical projects!`,
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Main Chat Grid (Split View) */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Column: Conversation List */}
        <div
          className={`w-full md:w-80 lg:w-96 bg-white border-r border-gray-100 flex flex-col shrink-0 min-h-0 ${
            mobileViewChat ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Search Contacts */}
          <div className="p-3.5 border-b border-gray-100">
            <div className="relative flex items-center bg-[#F8FAFC] border border-gray-200 rounded-xl px-3 py-2 focus-within:border-[#4B9C93] focus-within:ring-2 focus-within:ring-[#4B9C93]/15 transition-all">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search students, roles..."
                className="w-full bg-transparent pl-2.5 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none font-medium"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400">
                No matching conversations found
              </div>
            ) : (
              filteredConversations.map((c) => {
                const isSelected = c.id === activeChatId;
                const lastMsg = c.messages[c.messages.length - 1];
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setActiveChatId(c.id);
                      setMobileViewChat(true);
                      // Mark read
                      setConversations((prev) =>
                        prev.map((item) => (item.id === c.id ? { ...item, unread: 0 } : item))
                      );
                    }}
                    className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#E6F7F3]/70 border-l-4 border-l-[#4B9C93]"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    {/* Avatar + Online Indicator */}
                    <div className="relative shrink-0">
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-100"
                      />
                      {c.online && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <div className="flex items-center gap-1.5 min-w-0 truncate">
                          <h4 className="text-xs font-bold text-gray-900 truncate">{c.name}</h4>
                          {c.tag && <StudentRoleTag tag={c.tag} size="xs" />}
                        </div>
                        <span className="text-[10px] text-gray-400 shrink-0 font-medium">
                          {c.lastTime}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 truncate">
                        {lastMsg?.text || c.role}
                      </p>
                    </div>

                    {c.unread > 0 && (
                      <span className="w-4 h-4 rounded-full bg-[#4B9C93] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {c.unread}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Conversation Pane */}
        {activeChat ? (
          <div
            className={`flex-1 flex flex-col bg-[#F7F9F9] overflow-hidden ${
              !mobileViewChat ? "hidden md:flex" : "flex"
            }`}
          >
            {/* Header */}
            <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3 min-w-0">
                {/* Mobile Back Button */}
                <button
                  type="button"
                  onClick={() => setMobileViewChat(false)}
                  className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-slate-100 transition-colors"
                  aria-label="Back to contacts"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="relative shrink-0">
                  <img
                    src={activeChat.avatar}
                    alt={activeChat.name}
                    className="w-11 h-11 rounded-xl object-cover border border-slate-100"
                  />
                  {activeChat.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-gray-900 truncate">
                      {activeChat.name}
                    </h3>
                    {activeChat.tag && (
                      <StudentRoleTag tag={activeChat.tag} size="xs" />
                    )}
                    <div className="h-4 px-1.5 rounded bg-[#CCFBF1] flex items-center gap-0.5 shrink-0">
                      <Star className="w-2.5 h-2.5 fill-[#5CA59D] text-[#5CA59D]" />
                      <span className="text-[9px] font-bold text-[#0D9488]">
                        {activeChat.score}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                    <span className="text-xs text-gray-500 font-medium truncate">
                      {activeChat.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Header Right Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/student/people"
                  className="px-3 py-1.5 rounded-lg border border-gray-200 hover:border-[#4B9C93] bg-white text-xs font-semibold text-gray-700 hover:text-[#4B9C93] flex items-center gap-1 transition-all"
                  title="View Profile & Projects in People page"
                >
                  <span>Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Conversation Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {/* Info Note: Free Chat */}
              <div className="max-w-md mx-auto text-center bg-white border border-gray-100 rounded-2xl p-4 shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-[#E6F7F3] text-[#0D9488] mx-auto flex items-center justify-center mb-1.5">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-gray-900 flex items-center justify-center gap-1.5 flex-wrap">
                  <span>Direct Student Chat with {activeChat.name}</span>
                  {activeChat.tag && <StudentRoleTag tag={activeChat.tag} size="xs" />}
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                  Direct messaging is open to all — students, mentors, and creators on ShowMySkills can freely chat and collaborate.
                </p>
              </div>

              {/* Message Bubbles */}
              {activeChat.messages.map((m) => {
                const isMe = m.sender === "me";
                return (
                  <div
                    key={m.id}
                    className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    {!isMe && (
                      <img
                        src={activeChat.avatar}
                        alt={activeChat.name}
                        className="w-7 h-7 rounded-lg object-cover shrink-0 border border-slate-100"
                      />
                    )}

                    <div
                      className={`max-w-[78%] sm:max-w-md rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                        isMe
                          ? "bg-[#4B9C93] text-white rounded-br-xs"
                          : "bg-white text-gray-800 border border-gray-100 rounded-bl-xs"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{m.text}</p>
                      <div
                        className={`flex items-center justify-end gap-1 text-[10px] mt-1 ${
                          isMe ? "text-white/80" : "text-gray-400"
                        }`}
                      >
                        <span>{m.time}</span>
                        {isMe && <CheckCheck className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Peer typing indicator */}
              {isTypingReply && (
                <div className="flex items-center gap-2">
                  <img
                    src={activeChat.avatar}
                    alt={activeChat.name}
                    className="w-7 h-7 rounded-lg object-cover shrink-0 border border-slate-100"
                  />
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-xs px-4 py-2.5 flex items-center gap-1 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-4 py-2 bg-white/70 border-t border-gray-100 flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0">
                Suggestions:
              </span>
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 rounded-full bg-white hover:bg-[#E6F7F3] border border-gray-200 hover:border-[#4B9C93] text-[11px] text-gray-700 hover:text-[#0D9488] whitespace-nowrap transition-colors shadow-2xs cursor-pointer shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3.5 sm:p-4 bg-white border-t border-gray-100">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2 sm:gap-3"
              >
                <div className="flex-1 relative flex items-center bg-[#F8FAFC] border border-gray-200 rounded-2xl px-4 py-2.5 focus-within:border-[#4B9C93] focus-within:ring-2 focus-within:ring-[#4B9C93]/15 transition-all">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Message ${activeChat.name}...`}
                    className="w-full bg-transparent text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                    inputText.trim()
                      ? "bg-[#4B9C93] hover:bg-[#3d837b] text-white shadow-xs cursor-pointer"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                  aria-label="Send message"
                >
                  <Send className="w-4.5 h-4.5" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-500">
            <MessageSquare className="w-12 h-12 text-gray-300 mb-2" />
            <h4 className="font-bold text-gray-700">Select a conversation</h4>
            <p className="text-xs text-gray-400 mt-1">Choose someone from the list to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StudentChatsPage() {
  return (
    <div className="h-screen max-h-screen bg-[#F7F9F9] flex overflow-hidden">
      <DashboardSidebar />

      <div className="flex-1 md:ml-[220px] ml-0 flex flex-col h-screen min-h-0 overflow-hidden relative">
        <DashboardHeader
          title="Chats"
          subtitle="Direct peer-to-peer messaging with student creators and peers"
        />

        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <Suspense
            fallback={
              <div className="flex-1 flex items-center justify-center p-12">
                <div className="text-xs font-semibold text-gray-500 animate-pulse">
                  Loading chats...
                </div>
              </div>
            }
          >
            <ChatsContent />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
