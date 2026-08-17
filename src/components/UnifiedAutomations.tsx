import React, { useState } from "react";
import { AutomationRoutine, LangGraphExecutionTrace, Lead } from "../types";
import {
  Activity,
  Bot,
  Brain,
  CheckCircle2,
  Clock,
  Cpu,
  Layers,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Sliders,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  UserCheck,
  Zap,
} from "lucide-react";

interface UnifiedAutomationsProps {
  routines: AutomationRoutine[];
  onToggleRoutine: (id: string) => void;
  isLooping: boolean;
  setIsLooping: (looping: boolean) => void;
  onRunInstantLoop: () => void;
  isProcessing: boolean;
  loopIntervalSec: number;
  setLoopIntervalSec: (sec: number) => void;
  traces: LangGraphExecutionTrace[];
  leads: Lead[];
  onSimulateWebhook: (payload: any) => Promise<void>;
  showToast: (msg: string) => void;
}

export const UnifiedAutomations: React.FC<UnifiedAutomationsProps> = ({
  routines,
  onToggleRoutine,
  isLooping,
  setIsLooping,
  onRunInstantLoop,
  isProcessing,
  loopIntervalSec,
  setLoopIntervalSec,
  traces,
  leads,
  onSimulateWebhook,
  showToast,
}) => {
  const [subTab, setSubTab] = useState<"workflows" | "team" | "logs">("workflows");
  const [isSimulatingLead, setIsSimulatingLead] = useState(false);

  const handleSimulateQuickLead = async () => {
    setIsSimulatingLead(true);
    const mockNames = [
      { first: "Alexander", last: "Wright", company: "NexGen Logistics", email: "alex.wright@nexgen.io", title: "VP Operations", budget: "$15,000 - $30,000" },
      { first: "Elena", last: "Rostova", company: "FinVance Cloud", email: "elena@finvance.ai", title: "Head of Growth", budget: "$25,000 - $50,000" },
      { first: "Marcus", last: "Sterling", company: "Apex Systems", email: "marcus@apexsys.com", title: "Founder / CEO", budget: "$40,000+" },
      { first: "Sophia", last: "Chang", company: "BioHealth Global", email: "sophia.c@biohealth.org", title: "Director of RevOps", budget: "$10,000 - $20,000" },
    ];
    const pick = mockNames[Math.floor(Math.random() * mockNames.length)];

    await onSimulateWebhook({
      event: "contact_created",
      first_name: pick.first,
      last_name: pick.last,
      email: pick.email,
      company_name: pick.company,
      title: pick.title,
      budget_range: pick.budget,
      source: "Website Demo Form",
      message: "Looking for an automated solution to qualify leads and book appointments 24/7.",
    });

    setIsSimulatingLead(false);
    showToast(`⚡ Generated test prospect: ${pick.first} (${pick.company})`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Automations & AI Team</span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                isLooping
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
                  : "bg-amber-500/15 text-amber-400 border-amber-500/25"
              }`}
            >
              {isLooping ? "● 24/7 Engine Running" : "○ Engine Paused"}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure automated lead qualification, follow-ups, objection solving, and instant calendar booking.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Test Lead Button */}
          <button
            onClick={handleSimulateQuickLead}
            disabled={isSimulatingLead}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-semibold text-xs border border-amber-500/30 transition-all disabled:opacity-50"
            title="Create a realistic test prospect and trigger all AI automations"
          >
            <Zap className={`w-3.5 h-3.5 text-amber-400 ${isSimulatingLead ? "animate-spin" : ""}`} />
            <span>+ Test Inbound Lead</span>
          </button>

          {/* Master Toggle */}
          <button
            onClick={() => setIsLooping(!isLooping)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-md ${
              isLooping
                ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            {isLooping ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause Engine</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Resume Engine</span>
              </>
            )}
          </button>

          {/* Single Cycle */}
          <button
            onClick={onRunInstantLoop}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-900/30 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? "animate-spin" : ""}`} />
            <span>Run 1 Check</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Active Workflows</span>
            <p className="text-xl font-bold text-white mt-1">
              {routines.filter((r) => r.enabled).length} / {routines.length} Enabled
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">AI Processing Speed</span>
            <div className="flex items-center gap-2 mt-1">
              <select
                value={loopIntervalSec}
                onChange={(e) => setLoopIntervalSec(Number(e.target.value))}
                className="bg-slate-950 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg px-2 py-1 focus:outline-none"
              >
                <option value={5}>Every 5s (Fast)</option>
                <option value={15}>Every 15s (Standard)</option>
                <option value={60}>Every 60s (Relaxed)</option>
              </select>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Total Actions Handled</span>
            <p className="text-xl font-bold text-emerald-400 mt-1">{traces.length} Events Executed</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Sub-view Navigation */}
      <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 max-w-fit">
        {[
          { id: "workflows", label: "Automated Workflows", icon: Zap },
          { id: "team", label: "AI Team Roles", icon: Bot },
          { id: "logs", label: `Live Activity Feed (${traces.length})`, icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                isSelected
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Automated Workflows (Clean Switches) */}
      {subTab === "workflows" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routines.map((routine) => (
              <div
                key={routine.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-md flex flex-col justify-between hover:border-slate-700 transition-all space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-tight">{routine.name}</h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{routine.description}</p>
                    </div>
                    <button
                      onClick={() => onToggleRoutine(routine.id)}
                      className={`p-1.5 rounded-xl transition-all ${
                        routine.enabled
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-slate-800 text-slate-500 border border-slate-700"
                      }`}
                      title={routine.enabled ? "Active - Click to Pause" : "Paused - Click to Enable"}
                    >
                      {routine.enabled ? (
                        <ToggleRight className="w-6 h-6" />
                      ) : (
                        <ToggleLeft className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800">
                  <span className="flex items-center gap-1">
                    <span className="font-semibold text-slate-300">Trigger:</span> {routine.trigger_event}
                  </span>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded-full ${
                      routine.enabled
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {routine.enabled ? "Active" : "Paused"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: AI Team Roles */}
      {subTab === "team" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              name: "Lead Evaluator",
              role: "Qualification & Intent Scoring",
              icon: "🧠",
              desc: "Analyzes company size, budget, and decision authority to assign a 0-100 score.",
              action: "Scores new leads instantly",
            },
            {
              name: "Outreach Specialist",
              role: "Personalized Email & SMS",
              icon: "✍️",
              desc: "Writes authentic 3-part sequences tailored to each prospect's industry and pain points.",
              action: "Sends custom outreach",
            },
            {
              name: "Sales Closer",
              role: "Objection Handling & Booking",
              icon: "🎯",
              desc: "Resolves pricing, timing, and feature questions, providing direct calendar booking links.",
              action: "Books meetings 24/7",
            },
            {
              name: "Customer Success",
              role: "Student Onboarding & Welcomes",
              icon: "🎓",
              desc: "Delivers welcome kits, course syllabus links, and onboarding checklists post-purchase.",
              action: "Instant student onboarding",
            },
          ].map((agent, i) => (
            <div
              key={i}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-xl shadow-inner mb-3">
                  {agent.icon}
                </div>
                <h3 className="text-sm font-bold text-white">{agent.name}</h3>
                <span className="text-[11px] text-indigo-400 font-semibold">{agent.role}</span>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{agent.desc}</p>
              </div>

              <div className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800/80 text-[11px] text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>{agent.action}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Live Activity Feed */}
      {subTab === "logs" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              <span>Real-Time Autonomous Event History</span>
            </h3>
            <span className="text-xs text-slate-400">Latest actions at top</span>
          </div>

          <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
            {traces.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No recent activity. Click "Run 1 Check" or "+ Test Inbound Lead" to trigger events.</p>
            ) : (
              traces.map((trace) => (
                <div
                  key={trace.id}
                  className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 flex items-start justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{trace.agent_name}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-indigo-400 font-medium">{trace.lead_name}</span>
                    </div>
                    <p className="text-slate-300">{trace.action}</p>
                    {trace.thought_trace && (
                      <p className="text-[11px] text-slate-400 italic">"{trace.thought_trace}"</p>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 whitespace-nowrap">
                    {new Date(trace.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
