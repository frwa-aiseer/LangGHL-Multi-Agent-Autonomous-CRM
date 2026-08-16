import React, { useState } from "react";
import { GhlPipelineStage, Lead, SequenceStep } from "../types";
import {
  Bot,
  Brain,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Mail,
  MessageSquare,
  Phone,
  Play,
  Plus,
  RefreshCw,
  Send,
  Sparkles,
  Tag,
  User,
  X,
  Zap,
} from "lucide-react";

interface LeadDossierModalProps {
  lead: Lead | null;
  onClose: () => void;
  onScoreLead: (lead: Lead) => Promise<void>;
  onGenerateSequence: (lead: Lead) => Promise<void>;
  onSendMessage: (leadId: string, text: string, channel: "email" | "sms") => void;
  onSimulateInboundReply: (leadId: string, replyText: string) => Promise<void>;
  onBookAppointment: (leadId: string, date: string, time: string) => void;
  onUpdateStage: (leadId: string, stage: GhlPipelineStage) => void;
  isProcessing: boolean;
}

export const LeadDossierModal: React.FC<LeadDossierModalProps> = ({
  lead,
  onClose,
  onScoreLead,
  onGenerateSequence,
  onSendMessage,
  onSimulateInboundReply,
  onBookAppointment,
  onUpdateStage,
  isProcessing,
}) => {
  if (!lead) return null;

  const [activeTab, setActiveTab] = useState<"conversation" | "sequence" | "scoring" | "activity">("conversation");
  const [outboundText, setOutboundText] = useState("");
  const [outboundChannel, setOutboundChannel] = useState<"email" | "sms">("email");
  const [inboundReplySim, setInboundReplySim] = useState("");
  const [bookDate, setBookDate] = useState("2026-08-18");
  const [bookTime, setBookTime] = useState("15:00");

  const handleSendOutbound = (e: React.FormEvent) => {
    e.preventDefault();
    if (!outboundText.trim()) return;
    onSendMessage(lead.id, outboundText, outboundChannel);
    setOutboundText("");
  };

  const handleSendSimulatedReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inboundReplySim.trim()) return;
    const text = inboundReplySim;
    setInboundReplySim("");
    await onSimulateInboundReply(lead.id, text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
              {lead.first_name[0]}{lead.last_name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {lead.first_name} {lead.last_name}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono border border-slate-700">
                  {lead.ghl_contact_id}
                </span>
                {lead.ai_score > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    {lead.ai_score}/100 AI
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {lead.title} at <strong className="text-slate-200">{lead.company}</strong> • {lead.industry} ({lead.company_size})
              </p>
            </div>
          </div>

          {/* Quick Stage Selector & Close Button */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1 text-xs">
              <span className="text-slate-400 font-medium">GHL Stage:</span>
              <select
                value={lead.ghl_pipeline_stage}
                onChange={(e) => onUpdateStage(lead.id, e.target.value as GhlPipelineStage)}
                className="bg-transparent text-indigo-300 font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="new_inbound" className="bg-slate-900 text-white">New Inbound</option>
                <option value="scoring_enrichment" className="bg-slate-900 text-white">Scoring & Enrichment</option>
                <option value="active_sequence" className="bg-slate-900 text-white">Active Sequence</option>
                <option value="engaged_objection" className="bg-slate-900 text-white">Engaged / Objection</option>
                <option value="appointment_booked" className="bg-slate-900 text-white">Appointment Booked</option>
                <option value="opportunity_won" className="bg-slate-900 text-white">Opportunity Won</option>
                <option value="cold_nurture" className="bg-slate-900 text-white">Cold Nurture</option>
              </select>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 px-6 pt-2 bg-slate-950/40">
          {[
            { id: "conversation", label: "2-Way Inbox & Objection Loop", icon: MessageSquare },
            { id: "scoring", label: "Claude AI Scoring Diagnostics", icon: Brain },
            { id: "sequence", label: "Personalized Outreach Sequence", icon: Mail },
            { id: "activity", label: "Agent Activity Audit Trail", icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold border-b-2 transition-all ${
                  isSelected
                    ? "border-indigo-500 text-indigo-300 bg-indigo-500/10 rounded-t-lg"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: 2-WAY INBOX & OBJECTION SIMULATOR */}
          {activeTab === "conversation" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Message Thread */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 min-h-[360px] max-h-[440px] overflow-y-auto space-y-3">
                  {lead.conversation_history.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs py-12 text-center">
                      <MessageSquare className="w-8 h-8 text-slate-600 mb-2" />
                      <span>No conversation history yet.</span>
                      <span className="text-[11px] text-slate-600 mt-1">
                        Dispatch a sequence or simulate a prospect reply below!
                      </span>
                    </div>
                  ) : (
                    lead.conversation_history.map((msg) => {
                      const isAgent = msg.sender === "agent";
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isAgent ? "items-end" : "items-start"}`}
                        >
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 px-1">
                            {isAgent ? (
                              <>
                                <span className="font-bold text-indigo-400">
                                  {msg.metadata?.agentName || "Claude Agent"}
                                </span>
                                <span>via {msg.channel.toUpperCase()}</span>
                              </>
                            ) : (
                              <>
                                <span className="font-bold text-amber-400">{lead.first_name}</span>
                                <span>(Prospect)</span>
                              </>
                            )}
                            <span>• {msg.timestamp.split("T")[1]?.slice(0, 5) || "Now"}</span>
                          </div>

                          <div
                            className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-md ${
                              isAgent
                                ? "bg-indigo-600 text-white rounded-tr-none"
                                : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700"
                            }`}
                          >
                            {msg.metadata?.subject && (
                              <div className="font-bold border-b border-white/20 pb-1.5 mb-1.5 text-[11px]">
                                Subject: {msg.metadata.subject}
                              </div>
                            )}
                            <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Manual Outbound Send Form */}
                <form onSubmit={handleSendOutbound} className="flex gap-2">
                  <select
                    value={outboundChannel}
                    onChange={(e) => setOutboundChannel(e.target.value as any)}
                    className="bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 rounded-xl px-2.5 focus:outline-none"
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                  </select>
                  <input
                    type="text"
                    value={outboundText}
                    onChange={(e) => setOutboundText(e.target.value)}
                    placeholder="Send manual agent message to prospect..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              </div>

              {/* Right: Objection Simulation & Calendar Booker */}
              <div className="lg:col-span-5 space-y-4">
                {/* Objection Simulator */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Simulate Prospect Inbound Reply
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Test the Claude Objection Closer agent. Type a question or objection and observe autonomous rebuttal generation and calendar booking insertion.
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "How much does this cost per month?",
                      "We are already using another tool.",
                      "Can we do a demo Thursday at 2pm?",
                      "Does it integrate directly with GHL?",
                    ].map((sample, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setInboundReplySim(sample)}
                        className="text-[10px] bg-slate-900 hover:bg-slate-850 text-slate-300 px-2 py-1 rounded-lg border border-slate-800 text-left transition-colors"
                      >
                        "{sample}"
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleSendSimulatedReply} className="space-y-2 pt-1">
                    <textarea
                      rows={2}
                      value={inboundReplySim}
                      onChange={(e) => setInboundReplySim(e.target.value)}
                      placeholder="e.g., We'd love a demo next Tuesday morning..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
                    />
                    <button
                      type="submit"
                      disabled={isProcessing || !inboundReplySim.trim()}
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-md disabled:opacity-50 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Trigger Autonomous Objection Agent</span>
                    </button>
                  </form>
                </div>

                {/* Calendar Appointment Status & Lock */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        GHL Calendar Appointment
                      </h4>
                    </div>
                    {lead.appointment ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                        Confirmed
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                        Unbooked
                      </span>
                    )}
                  </div>

                  {lead.appointment ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Date & Time:</span>
                        <strong className="text-slate-200">{lead.appointment.date} @ {lead.appointment.time}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Timezone:</span>
                        <span className="text-slate-300 font-mono text-[11px]">{lead.appointment.timezone}</span>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-slate-800">
                        <span className="text-slate-400">Meeting URL:</span>
                        <a
                          href={lead.appointment.meeting_link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-mono text-[11px]"
                        >
                          <span>Open Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">Date</label>
                          <input
                            type="date"
                            value={bookDate}
                            onChange={(e) => setBookDate(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">Time</label>
                          <input
                            type="time"
                            value={bookTime}
                            onChange={(e) => setBookTime(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => onBookAppointment(lead.id, bookDate, bookTime)}
                        className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Lock Slot in GHL Calendar</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CLAUDE AI SCORING DIAGNOSTICS */}
          {activeTab === "scoring" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total Score Card */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-center space-y-2">
                  <span className="text-xs uppercase font-bold text-slate-400">Composite AI Score</span>
                  <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                    {lead.ai_score}
                    <span className="text-lg text-slate-500 font-normal">/100</span>
                  </div>
                  <span className="inline-block text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                    {lead.icp_fit}
                  </span>
                </div>

                {/* Score Breakdown Bars */}
                <div className="md:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    BANT & Intent Diagnostic Radar
                  </h4>

                  <div className="space-y-2.5">
                    {[
                      { label: "Buying Intent", val: lead.score_breakdown?.intent || 85, color: "bg-indigo-500" },
                      { label: "Decision Authority", val: lead.score_breakdown?.authority || 90, color: "bg-purple-500" },
                      { label: "Budget Alignment", val: lead.score_breakdown?.budget || 80, color: "bg-emerald-500" },
                      { label: "Timing & Urgency", val: lead.score_breakdown?.timing || 75, color: "bg-amber-500" },
                      { label: "Strategic Need", val: lead.score_breakdown?.need || 88, color: "bg-pink-500" },
                    ].map((item) => (
                      <div key={item.label} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-300">{item.label}</span>
                          <span className="font-bold text-slate-200 font-mono">{item.val}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                          <div
                            className={`h-full ${item.color} rounded-full transition-all duration-500`}
                            style={{ width: `${item.val}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pain Points & Strategy */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Identified Pain Points
                  </h4>
                  <ul className="space-y-2">
                    {lead.pain_points?.map((pt, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Recommended Autonomous Strategy
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800">
                    {lead.suggested_strategy || "Deploy personalized multi-channel outreach focusing on rapid SLA appointment booking."}
                  </p>
                  <button
                    onClick={() => onScoreLead(lead)}
                    disabled={isProcessing}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md disabled:opacity-50 transition-all"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? "animate-spin" : ""}`} />
                    <span>Re-Evaluate with Claude Brain</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PERSONALIZED OUTREACH SEQUENCE */}
          {activeTab === "sequence" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Generated Multi-Touchpoint Sequence
                  </h4>
                  <p className="text-xs text-slate-400">
                    Crafted by Claude Scribe agent using prospect metadata and pain points.
                  </p>
                </div>
                <button
                  onClick={() => onGenerateSequence(lead)}
                  disabled={isProcessing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md disabled:opacity-50 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Regenerate Sequence</span>
                </button>
              </div>

              {lead.sequence_steps.length === 0 ? (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-10 text-center space-y-3">
                  <Mail className="w-8 h-8 text-slate-600 mx-auto" />
                  <h5 className="text-xs font-bold text-white">No sequence generated yet</h5>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Click regenerate to let Claude synthesize a customized 4-touchpoint email and SMS sequence.
                  </p>
                  <button
                    onClick={() => onGenerateSequence(lead)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 shadow-md"
                  >
                    Generate AI Sequence Now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lead.sequence_steps.map((step) => (
                    <div
                      key={step.step_num}
                      className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px] border border-indigo-500/30">
                            Touchpoint #{step.step_num} ({step.channel.toUpperCase()})
                          </span>
                          <span className="text-[11px] text-slate-400">Day +{step.delay_days}</span>
                        </div>

                        {step.subject && (
                          <div className="text-xs font-bold text-white">
                            Subject: {step.subject}
                          </div>
                        )}

                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-300 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                          {step.body}
                        </div>
                      </div>

                      {step.ai_generated_notes && (
                        <div className="text-[10px] text-slate-400 italic border-t border-slate-800/80 pt-2">
                          AI Hook: {step.ai_generated_notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: AGENT ACTIVITY AUDIT TRAIL */}
          {activeTab === "activity" && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Autonomous Action & State History
              </h4>
              <div className="space-y-2">
                {lead.activity_log?.map((act) => (
                  <div
                    key={act.id}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs space-y-1"
                  >
                    <div className="flex justify-between items-center text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-indigo-400">{act.agent}</span>
                        <span>•</span>
                        <span className="text-white font-semibold">{act.action}</span>
                      </div>
                      <span className="text-[11px] font-mono">{act.timestamp.split("T")[1]?.slice(0, 8)}</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">{act.details}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
