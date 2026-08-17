import React, { useState } from "react";
import {
  Bot,
  Send,
  Sparkles,
  DollarSign,
  Calendar,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  UserCheck,
  Zap,
  MessageSquare,
  ShieldAlert,
  ExternalLink,
  BookOpen,
  Briefcase,
  Copy,
} from "lucide-react";
import { Lead, OfferItem } from "../types";

interface OperantSalesDeskProps {
  offers: OfferItem[];
  leads: Lead[];
  showToast: (msg: string) => void;
  onEnrollStudent: (offer: OfferItem) => void;
  selectedOffer?: OfferItem | null;
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  suggestedOffers?: Array<{ id: string; title: string; link: string }>;
}

export const OperantSalesDesk: React.FC<OperantSalesDeskProps> = ({
  offers,
  leads,
  showToast,
  onEnrollStudent,
  selectedOffer,
}) => {
  // Triage state
  const [prospectBudget, setProspectBudget] = useState("2500");
  const [prospectRole, setProspectRole] = useState("Agency Owner / SaaS Founder");
  const [prospectGoal, setProspectGoal] = useState("Automate outbound leads & course sales with 0 human headcount");
  const [prospectBottleneck, setProspectBottleneck] = useState("Manual lead qualification taking 15 hours/week");
  const [isTriaging, setIsTriaging] = useState(false);
  const [triageResult, setTriageResult] = useState<any>(null);

  // Live Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "msg_init",
      sender: "ai",
      text: "👋 Welcome to the Operant Autonomous Revenue Desk. I'm your AI Strategic Co-Founder. Whether you're looking to master building autonomous multi-agents through our 40-lesson Masterclass ($497), join our 6-week Builder Cohort ($1,497), or deploy a Done-For-You GHL + LangGraph pipeline ($4,997), I can help match the optimal solution to your revenue roadmap. What's your target outcome?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      suggestedOffers: [
        { id: "offer_course_1", title: "AI Agent Architecture Masterclass ($497)", link: "https://buy.stripe.com/operant_ai_masterclass_497" },
        { id: "offer_service_1", title: "Done-For-You GHL Multi-Agent ($4,997)", link: "https://link.ghlcalendar.com/discovery-demo" },
      ],
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isChatSending, setIsChatSending] = useState(false);

  const handleRunTriage = async () => {
    setIsTriaging(true);
    try {
      const res = await fetch("/api/operant/sales-triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prospectBudget,
          prospectRole,
          prospectGoal,
          currentBottleneck: prospectBottleneck,
        }),
      });
      const data = await res.json();
      setTriageResult(data);
      showToast("🎯 AI Co-Founder completed revenue & offer triage!");
    } catch (e: any) {
      console.error(e);
      showToast("Error triaging: " + e.message);
    } finally {
      setIsTriaging(false);
    }
  };

  const handleSendChatMessage = async () => {
    if (!inputMessage.trim() || isChatSending) return;
    const userMsg: ChatMessage = {
      id: "msg_" + Math.random().toString(36).substr(2, 9),
      sender: "user",
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsChatSending(true);

    try {
      // Find matching offer context if mentioned
      const matchedOffer = offers.find((o) =>
        inputMessage.toLowerCase().includes(o.title.toLowerCase().slice(0, 10))
      );

      const res = await fetch("/api/agent/handle-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead: {
            first_name: "Prospect",
            company: "Prospect Co",
            pain_points: [prospectBottleneck],
            suggested_strategy: prospectGoal,
          },
          incomingMessage: inputMessage,
          conversationHistory: chatMessages.map((m) => ({
            id: m.id,
            sender: m.sender === "user" ? "lead" : "agent",
            channel: "ghl_chat",
            text: m.text,
            timestamp: new Date().toISOString(),
          })),
          calendarLink: "https://link.ghlcalendar.com/discovery-demo",
        }),
      });
      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: "msg_" + Math.random().toString(36).substr(2, 9),
        sender: "ai",
        text: data.reply || "Based on your goals, our autonomous solutions will eliminate that bottleneck immediately.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedOffers: matchedOffer
          ? [{ id: matchedOffer.id, title: `${matchedOffer.title} ($${matchedOffer.price})`, link: matchedOffer.stripe_checkout_url }]
          : undefined,
      };

      setChatMessages((prev) => [...prev, aiMsg]);
    } catch (e: any) {
      console.error(e);
      showToast("Error sending message: " + e.message);
    } finally {
      setIsChatSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-indigo-400" />
              AI Sales Consultation & Triage
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1.5">
            Autonomous Deal Matching & Objection Handling
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
            Triages prospect goals against digital courses, builder cohorts, and done-for-you retainers with custom pricing recommendation engines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-right">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Available Offers</span>
            <span className="text-base font-bold text-indigo-300">{offers.length} active products</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Triage Calculator & Diagnostics */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Prospect Diagnostics & Triage Engine</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Monthly Investment Budget</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "< $1,000", val: "500" },
                    { label: "$1k - $5k", val: "2500" },
                    { label: "$10k+", val: "12500" },
                  ].map((b) => (
                    <button
                      key={b.val}
                      onClick={() => setProspectBudget(b.val)}
                      className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                        prospectBudget === b.val
                          ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-inner"
                          : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Prospect Archetype / Role</label>
                <input
                  type="text"
                  value={prospectRole}
                  onChange={(e) => setProspectRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Core Operational Bottleneck</label>
                <input
                  type="text"
                  value={prospectBottleneck}
                  onChange={(e) => setProspectBottleneck(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Desired Revenue Transformation</label>
                <textarea
                  rows={2}
                  value={prospectGoal}
                  onChange={(e) => setProspectGoal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                onClick={handleRunTriage}
                disabled={isTriaging}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isTriaging ? "Analyzing Fit..." : "Run AI Offer Triage"}</span>
              </button>
            </div>
          </div>

          {/* Triage Recommendation Card */}
          {triageResult && (
            <div className="bg-slate-900/90 border border-indigo-500/40 rounded-2xl p-5 space-y-3.5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  Recommended Tier: {triageResult.recommended_tier}
                </span>
                <span className="text-xs font-bold text-white">
                  Match Score: {triageResult.match_score || 95}%
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-white">{triageResult.recommended_offer_title}</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{triageResult.justification}</p>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  AI Action Plan & Next Steps
                </span>
                <div className="text-xs text-slate-300">{triageResult.next_steps}</div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    const matched = offers.find((o) =>
                      o.title.toLowerCase().includes((triageResult.recommended_offer_title || "").toLowerCase().slice(0, 10))
                    );
                    if (matched) onEnrollStudent(matched);
                    else onEnrollStudent(offers[0]);
                  }}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Enroll in Recommended Program</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: AI Strategic Co-Founder Consultation Chat */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between h-[600px]">
          <div className="space-y-3 flex-1 overflow-y-auto pr-2 no-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Operant AI Co-Founder</h4>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online • Ready to Consult
                  </span>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Claude 3.7 Sonnet</span>
            </div>

            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "ai" && (
                  <div className="w-6 h-6 rounded-md bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl p-3.5 text-xs space-y-2 leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white rounded-tr-none"
                      : "bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {msg.suggestedOffers && msg.suggestedOffers.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-indigo-300 block">Matched Programs:</span>
                      {msg.suggestedOffers.map((off, i) => (
                        <div key={i} className="flex items-center justify-between bg-slate-900/90 p-2 rounded-lg border border-slate-800 text-[11px]">
                          <span className="font-semibold text-slate-200 truncate">{off.title}</span>
                          <button
                            onClick={() => {
                              const found = offers.find((o) => o.id === off.id);
                              if (found) onEnrollStudent(found);
                            }}
                            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold shrink-0 ml-2"
                          >
                            Enroll Now →
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <span className="text-[9px] text-slate-400 block text-right">{msg.timestamp}</span>
                </div>
              </div>
            ))}
            {isChatSending && (
              <div className="flex gap-2 items-center text-xs text-slate-400 pl-8">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                <span>AI Co-Founder analyzing strategy & pricing...</span>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="pt-3 border-t border-slate-800/80">
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-1.5 focus-within:border-indigo-500">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendChatMessage();
                  }
                }}
                placeholder="Ask about courses, DFY retainers, pricing, or custom GHL workflows..."
                className="bg-transparent flex-1 px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
              />
              <button
                onClick={handleSendChatMessage}
                disabled={!inputMessage.trim() || isChatSending}
                className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
