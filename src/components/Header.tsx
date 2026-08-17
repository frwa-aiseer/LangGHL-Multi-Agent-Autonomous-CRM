import React from "react";
import {
  Activity,
  Bot,
  Calendar,
  CheckCircle2,
  DollarSign,
  Play,
  Pause,
  PlusCircle,
  RefreshCw,
  Sparkles,
  Zap,
  Radio,
} from "lucide-react";
import { GHLConfig, Lead } from "../types";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  leads: Lead[];
  ghlConfig: GHLConfig;
  isLooping: boolean;
  setIsLooping: (looping: boolean) => void;
  onRunInstantLoop: () => void;
  onOpenWebhookModal: () => void;
  onOpenNewLeadModal: () => void;
  loopIntervalSec: number;
  setLoopIntervalSec: (sec: number) => void;
  isProcessing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  leads,
  ghlConfig,
  isLooping,
  setIsLooping,
  onRunInstantLoop,
  onOpenWebhookModal,
  onOpenNewLeadModal,
  loopIntervalSec,
  setLoopIntervalSec,
  isProcessing,
}) => {
  const activeLeadsCount = leads.length;
  const bookedAppointmentsCount = leads.filter(
    (l) => l.ghl_pipeline_stage === "appointment_booked" || l.appointment
  ).length;
  const totalPipelineValue = leads.reduce((acc, l) => acc + (l.deal_value || 0), 0);
  const avgScore = Math.round(
    leads.filter((l) => l.ai_score > 0).reduce((acc, l) => acc + l.ai_score, 0) /
      Math.max(1, leads.filter((l) => l.ai_score > 0).length)
  );

  return (
    <header id="app-main-header" className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-md">
      {/* Top Banner / System Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Logo & Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-sky-500 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bot className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                Operant AI <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 font-mono border border-indigo-500/25">Multi-Agent CRM</span>
              </h1>
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                <Radio className="w-2 h-2 animate-pulse text-emerald-400" />
                24/7 Swarm Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Autonomous CRM & Monetization Operating System</p>
          </div>
        </div>

        {/* Global Pipeline Health Metrics */}
        <div className="hidden lg:flex items-center gap-5 bg-slate-950/60 border border-slate-800/80 rounded-xl px-4 py-2 text-xs">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Active Leads</span>
              <span className="font-bold text-slate-200">{activeLeadsCount} prospects</span>
            </div>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Avg AI Score</span>
              <span className="font-bold text-purple-300">{avgScore}/100</span>
            </div>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Booked Demos</span>
              <span className="font-bold text-emerald-300">{bookedAppointmentsCount}</span>
            </div>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Pipeline Value</span>
              <span className="font-bold text-amber-300">${totalPipelineValue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Autonomous Swarm Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Loop Interval Selector */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1 text-xs">
            <span className="px-2 text-slate-400 text-[11px] font-medium hidden sm:inline">Loop:</span>
            <select
              value={loopIntervalSec}
              onChange={(e) => setLoopIntervalSec(Number(e.target.value))}
              className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer pr-1"
            >
              <option value={5} className="bg-slate-900">5s (Turbo)</option>
              <option value={15} className="bg-slate-900">15s (Real-Time)</option>
              <option value={60} className="bg-slate-900">60s (Standard)</option>
            </select>
          </div>

          {/* Master Autonomous Toggle */}
          <button
            id="toggle-autonomous-swarm-btn"
            onClick={() => setIsLooping(!isLooping)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all shadow-sm ${
              isLooping
                ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            {isLooping ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Swarm Running</span>
                <span className="w-2 h-2 rounded-full bg-white animate-ping ml-0.5" />
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Resume Swarm</span>
              </>
            )}
          </button>

          {/* Instant Swarm Cycle */}
          <button
            id="run-instant-swarm-loop-btn"
            onClick={onRunInstantLoop}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-900/40 disabled:opacity-50 transition-all"
            title="Execute 1 full LangGraph pass across all leads"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Run 1 Cycle</span>
          </button>

          {/* Simulate Webhook */}
          <button
            id="open-webhook-simulator-btn"
            onClick={onOpenWebhookModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 shadow-sm transition-all"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Simulate Lead</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-slate-800/60 pt-1 pb-1">
        {[
          { id: "operant_offers", label: "Offers & Programs", icon: "🎓" },
          { id: "operant_sales", label: "AI Sales & Triage", icon: "🎯" },
          { id: "langgraph", label: "Multi-Agent Canvas", icon: "🕸️" },
          { id: "pipeline", label: "Pipeline Kanban", icon: "📊" },
          { id: "leads", label: "Prospects & 2-Way Inbox", icon: "👥" },
          { id: "routines", label: "Autonomous Loops", icon: "🔄" },
          { id: "sequence_studio", label: "Sequence Studio", icon: "✍️" },
          { id: "webhook_hub", label: "Webhook Simulator", icon: "⚡" },
          { id: "telemetry", label: "Agent Traces & Telemetry", icon: "📈" },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                isActive
                  ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-inner"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.id === "pipeline" && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                  {leads.length}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
