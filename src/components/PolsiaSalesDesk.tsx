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

interface PolsiaSalesDeskProps {
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

export const PolsiaSalesDesk: React.FC<PolsiaSalesDeskProps> = ({
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
      text: "👋 Welcome to the Polsia Autonomous Revenue Desk. I'm your AI Strategic Co-Founder. Whether you're looking to master building autonomous multi-agents through our 40-lesson Masterclass ($497), join our 6-week Builder Cohort ($1,497), or deploy a Done-For-You GHL + LangGraph pipeline ($4,997), I can help match the optimal solution to your revenue roadmap. What's your target outcome?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      suggestedOffers: [
        { id: "offer_course_1", title: "AI Agent Architecture Masterclass ($497)", link: "https://buy.stripe.com/polsia_ai_masterclass_497" },
        { id: "offer_service_1", title: "Done-For-You GHL Multi-Agent ($4,997)", link: "https://link.ghlcalendar.com/discovery-demo" },
      ],
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isChatSending, setIsChatSending] = useState(false);

  const handleRunTriage = async () => {
    setIsTriaging(true);
    try {
      const res = await fetch("/api/polsia/sales-triage", {
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
    const currentInput = inputMessage;
    setInputMessage("");
    setIsChatSending(true);

    try {
      const res = await fetch("/api/polsia/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentInput,
          conversationHistory: chatMessages.slice(-4).map((m) => ({ role: m.sender, content: m.text })),
        }),
      });
      const data = await res.json();
      const aiReply: ChatMessage = {
        id: "msg_" + Math.random().toString(36).substr(2, 9),
        sender: "ai",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedOffers: data.suggested_offers,
      };
      setChatMessages((prev) => [...prev, aiReply]);
    } catch (e: any) {
      console.error(e);
      showToast("Error in AI chat: " + e.message);
    } finally {
      setIsChatSending(false);
    }
  };

  // Enrolled students / clients derived from active leads with high scores / won stages
  const enrolledStudents = leads.map((l, index) => {
    const isHighTicket = l.deal_value >= 4000;
    return {
      id: l.id,
      name: `${l.first_name} ${l.last_name}`,
      company: l.company,
      email: l.email,
      product: isHighTicket ? "Done-For-You GHL Infrastructure" : "AI Agent Architecture Masterclass",
      tier: isHighTicket ? "High-Ticket Client ($4,997)" : "Course Student ($497)",
      progress: Math.min(100, Math.floor(l.ai_score * 1.1)),
      ghlTag: isHighTicket ? "Client-DFY-Active" : "Student-Masterclass-Enrolled",
      status: l.ghl_pipeline_stage === "opportunity_won" ? "Completed / Active" : "In Progress",
      nextUpsell: isHighTicket ? "Enterprise Retainer ($12.5k/mo)" : "DFY Buildout Upgrade ($4,997)",
    };
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Polsia AI Sales Desk & Lead Triage</span>
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
              Autonomous Conversion Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Intelligently routes prospects between self-serve digital courses ($497-$1,497) and high-ticket done-for-you service discovery calls ($4,997-$12,500).
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>Average Triage Accuracy: <strong className="text-white">96.4%</strong></span>
        </div>
      </div>

      {/* Grid: 2 Columns (Interactive Triage + Live AI Co-Founder Chat) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AI Offer Matcher & Triage Calculator */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>🎯 Prospect Requirements & Offer Matcher</span>
              </h3>
              <p className="text-[11px] text-slate-400">Simulate incoming prospect qualification</p>
            </div>
            <span className="text-xs font-mono bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
              Polsia AI Algorithm
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Available Budget ($ USD)</label>
              <div className="grid grid-cols-4 gap-2">
                {["497", "1497", "4997", "12500"].map((b) => (
                  <button
                    key={b}
                    onClick={() => setProspectBudget(b)}
                    className={`py-1.5 px-2 rounded-lg font-semibold text-center border transition-all ${
                      prospectBudget === b
                        ? "bg-indigo-600 text-white border-indigo-400 shadow-sm"
                        : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    ${Number(b).toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Prospect Role / Business Model</label>
              <input
                type="text"
                value={prospectRole}
                onChange={(e) => setProspectRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Primary Revenue Goal</label>
              <input
                type="text"
                value={prospectGoal}
                onChange={(e) => setProspectGoal(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Current Pipeline Bottleneck</label>
              <input
                type="text"
                value={prospectBottleneck}
                onChange={(e) => setProspectBottleneck(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              id="run-polsia-triage-btn"
              onClick={handleRunTriage}
              disabled={isTriaging}
              className="w-full mt-2 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isTriaging ? "animate-spin" : ""}`} />
              <span>{isTriaging ? "Analyzing Fit..." : "Run AI Triage & Match Solution"}</span>
            </button>
          </div>

          {/* Triage Output Card */}
          {triageResult && (
            <div className="mt-4 bg-slate-950 border border-indigo-500/40 rounded-xl p-4 space-y-3 animate-fade-in">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block">Recommended Package</span>
                  <h4 className="text-sm font-bold text-white mt-0.5">{triageResult.recommended_offer_title}</h4>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-emerald-400">${triageResult.price?.toLocaleString()}</span>
                  <span className="text-[10px] text-indigo-300 block font-semibold">{triageResult.match_score}% Match Score</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                {triageResult.recommendation_reasoning}
              </p>

              <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300">
                <span className="text-[10px] font-bold text-amber-300 block uppercase">AI Closer Pitch Hook</span>
                <p className="mt-1 text-slate-300 italic">"{triageResult.ai_closer_message}"</p>
              </div>

              <div className="pt-2 flex items-center gap-2">
                {triageResult.next_action === "book_discovery_call" ? (
                  <a
                    href={triageResult.action_url || "https://link.ghlcalendar.com/discovery-demo"}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow transition-all"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book GHL VIP Discovery Call</span>
                  </a>
                ) : (
                  <a
                    href={triageResult.action_url || "https://buy.stripe.com/polsia_ai_masterclass_497"}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow transition-all"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>1-Click Stripe Enrollment</span>
                  </a>
                )}
                <button
                  onClick={() => {
                    const matched = offers.find((o) => o.title === triageResult.recommended_offer_title) || offers[0];
                    onEnrollStudent(matched);
                  }}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg"
                >
                  Simulate GHL Deal
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Interactive AI Co-Founder Chat */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between h-[560px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                👑
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Polsia AI Co-Founder & Closer</h3>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Conversational Sales Agent
                </p>
              </div>
            </div>
            <span className="text-[11px] text-slate-400">Claude 3.7 Reasoning</span>
          </div>

          {/* Chat Transcript Area */}
          <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-xs">
            {chatMessages.map((msg) => {
              const isAi = msg.sender === "ai";
              return (
                <div key={msg.id} className={`flex flex-col ${isAi ? "items-start" : "items-end"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 shadow-md space-y-2 ${
                      isAi
                        ? "bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-sm"
                        : "bg-indigo-600 text-white rounded-tr-sm"
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                    {isAi && msg.suggestedOffers && msg.suggestedOffers.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">Quick Actions</span>
                        {msg.suggestedOffers.map((off, i) => (
                          <a
                            key={i}
                            href={off.link}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between gap-2 p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-indigo-300 text-[11px] font-semibold transition-all"
                          >
                            <span className="truncate">{off.title}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
                </div>
              );
            })}
            {isChatSending && (
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 border border-slate-800 p-2.5 rounded-xl w-fit">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span>Polsia AI Co-Founder is formulating objection response...</span>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask about courses, pricing, GHL setup, or consulting..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleSendChatMessage}
              disabled={isChatSending || !inputMessage.trim()}
              className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow disabled:opacity-50 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Enrolled Students & High-Ticket Clients Roster */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Student Success & High-Ticket Client Roster</span>
            </h3>
            <p className="text-xs text-slate-400">
              Autonomous tracking of enrolled course students and done-for-you agency retainer clients.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-semibold">
            {enrolledStudents.length} Active Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-semibold">
                <th className="py-2.5 px-3">Student / Client</th>
                <th className="py-2.5 px-3">Company</th>
                <th className="py-2.5 px-3">Active Product</th>
                <th className="py-2.5 px-3">Access Tier</th>
                <th className="py-2.5 px-3">Progress</th>
                <th className="py-2.5 px-3">GHL Tag</th>
                <th className="py-2.5 px-3 text-right">Autonomous Upsell Sink</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {enrolledStudents.map((stud) => (
                <tr key={stud.id} className="hover:bg-slate-950/50 transition-colors">
                  <td className="py-3 px-3 font-bold text-white">{stud.name}</td>
                  <td className="py-3 px-3 text-slate-400">{stud.company}</td>
                  <td className="py-3 px-3 font-medium text-slate-200">{stud.product}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      stud.tier.includes("High-Ticket")
                        ? "bg-purple-500/10 text-purple-300 border border-purple-500/30"
                        : "bg-indigo-500/10 text-indigo-300 border border-indigo-500/30"
                    }`}>
                      {stud.tier}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${stud.progress}%` }} />
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-400">{stud.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-emerald-400">{stud.ghlTag}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="text-[11px] text-amber-300 font-semibold bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
                      {stud.nextUpsell}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
