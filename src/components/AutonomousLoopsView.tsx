import React, { useState } from "react";
import { AutomationRoutine, LangGraphExecutionTrace, Lead } from "../types";
import {
  Activity,
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
  Zap,
} from "lucide-react";

interface AutonomousLoopsViewProps {
  routines: AutomationRoutine[];
  onToggleRoutine: (id: string) => void;
  onAddRoutine: (routine: Partial<AutomationRoutine>) => void;
  isLooping: boolean;
  setIsLooping: (looping: boolean) => void;
  onRunInstantLoop: () => void;
  isProcessing: boolean;
  loopIntervalSec: number;
  setLoopIntervalSec: (sec: number) => void;
  traces: LangGraphExecutionTrace[];
}

export const AutonomousLoopsView: React.FC<AutonomousLoopsViewProps> = ({
  routines,
  onToggleRoutine,
  onAddRoutine,
  isLooping,
  setIsLooping,
  onRunInstantLoop,
  isProcessing,
  loopIntervalSec,
  setLoopIntervalSec,
  traces,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newTrigger, setNewTrigger] = useState("Inbound SMS Received");
  const [newCondition, setNewCondition] = useState("Lead stage == 'engaged_objection'");
  const [newInterval, setNewInterval] = useState(15);
  const [newPriority, setNewPriority] = useState<any>("High");
  const [newDesc, setNewDesc] = useState("");

  const handleCreateRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onAddRoutine({
      id: "routine_" + Math.random().toString(36).substr(2, 9),
      name: newName,
      trigger_event: newTrigger,
      condition: newCondition,
      loop_interval_sec: Number(newInterval),
      priority: newPriority,
      description: newDesc || "Automated autonomous agent routine.",
      enabled: true,
      stats: {
        triggered_count: 0,
        converted_count: 0,
        success_rate: 0,
      },
    });

    setNewName("");
    setNewDesc("");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <RefreshCw className={`w-5 h-5 ${isLooping ? "animate-spin text-emerald-400" : ""}`} />
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Endless Autonomous AI Loops & Routines
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Continuously evaluate pipeline states, score incoming prospects, handle customer replies, and book calendar appointments without human intervention.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create AI Routine</span>
          </button>
        </div>
      </div>

      {/* Autonomous Engine Ticker & Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <span className="text-xs text-slate-400 uppercase font-bold">Autonomous Swarm Engine</span>
          <div className="flex items-center justify-between mt-2">
            <span
              className={`text-sm font-bold flex items-center gap-2 ${
                isLooping ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isLooping ? "bg-emerald-500 animate-ping" : "bg-amber-500"
                }`}
              />
              {isLooping ? "LOOPING ENDLESSLY" : "STANDBY / PAUSED"}
            </span>
            <button
              onClick={() => setIsLooping(!isLooping)}
              className={`p-2 rounded-xl text-xs font-bold ${
                isLooping
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  : "bg-emerald-600 text-white hover:bg-emerald-500"
              }`}
            >
              {isLooping ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-xs text-slate-400 uppercase font-bold">Cycle Loop Speed</span>
          <div className="flex items-center gap-2 mt-2">
            <select
              value={loopIntervalSec}
              onChange={(e) => setLoopIntervalSec(Number(e.target.value))}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none w-full"
            >
              <option value={5}>Every 5 seconds (Turbo Swarm)</option>
              <option value={15}>Every 15 seconds (Real-Time GHL)</option>
              <option value={60}>Every 60 seconds (Standard)</option>
              <option value={300}>Every 5 minutes (Low-Rate)</option>
            </select>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-xs text-slate-400 uppercase font-bold">Active AI Routines</span>
          <div className="text-2xl font-black text-white mt-1 flex items-center justify-between">
            <span>{routines.filter((r) => r.enabled).length} / {routines.length}</span>
            <Sliders className="w-5 h-5 text-indigo-400" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-xs text-slate-400 uppercase font-bold">Avg AI SLA Speed</span>
          <div className="text-2xl font-black text-emerald-400 mt-1 flex items-center justify-between">
            <span>42 seconds</span>
            <Activity className="w-5 h-5 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Routine Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {routines.map((routine) => (
          <div
            key={routine.id}
            className={`bg-slate-900 border rounded-2xl p-5 shadow-xl transition-all space-y-4 flex flex-col justify-between ${
              routine.enabled ? "border-slate-800 hover:border-indigo-500/40" : "border-slate-800/50 opacity-60"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{routine.name}</h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        routine.priority.includes("Critical")
                          ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                          : "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                      }`}
                    >
                      {routine.priority}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{routine.description}</p>
                </div>

                <button
                  onClick={() => onToggleRoutine(routine.id)}
                  className={`p-1.5 rounded-xl transition-colors ${
                    routine.enabled
                      ? "text-emerald-400 hover:bg-emerald-500/10"
                      : "text-slate-500 hover:bg-slate-800"
                  }`}
                  title={routine.enabled ? "Disable Routine" : "Enable Routine"}
                >
                  {routine.enabled ? (
                    <ToggleRight className="w-8 h-8 fill-emerald-500/20" />
                  ) : (
                    <ToggleLeft className="w-8 h-8" />
                  )}
                </button>
              </div>

              {/* Trigger & Condition Box */}
              <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Trigger:</span>
                  <span className="text-amber-300 font-semibold">{routine.trigger_event}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Condition:</span>
                  <span className="text-indigo-300 font-semibold">{routine.condition}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Loop Check:</span>
                  <span className="text-slate-300">Every {routine.loop_interval_sec}s</span>
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <span>Triggered: <strong className="text-slate-200">{routine.stats.triggered_count}</strong></span>
                <span>Converted: <strong className="text-emerald-400">{routine.stats.converted_count}</strong></span>
              </div>
              <span className="text-indigo-300 font-bold">
                {routine.stats.success_rate}% Success
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Routine Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Create New Autonomous Routine</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRoutine} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Routine Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g., Weekend No-Show Reactivation Swarm"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Trigger Event</label>
                  <select
                    value={newTrigger}
                    onChange={(e) => setNewTrigger(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  >
                    <option value="GHL Inbound Webhook Received">Inbound Webhook</option>
                    <option value="Inbound SMS Received">Inbound SMS</option>
                    <option value="Lead Inactivity > 48h">Inactivity &gt; 48h</option>
                    <option value="Appointment Cancelled">Appointment Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  >
                    <option value="Critical (SLA < 1m)">Critical (SLA &lt; 1m)</option>
                    <option value="High">High</option>
                    <option value="Standard">Standard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Condition Expression</label>
                <input
                  type="text"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  placeholder="e.g., ai_score >= 80 && ghl_stage == 'engaged_objection'"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="What action should the multi-agent swarm execute?"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md"
                >
                  Save & Enable Routine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
