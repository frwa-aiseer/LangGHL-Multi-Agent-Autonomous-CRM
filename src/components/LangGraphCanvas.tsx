import React, { useState } from "react";
import {
  AgentDefinition,
  LangGraphExecutionTrace,
  LangGraphNode,
  Lead,
} from "../types";
import {
  ArrowRight,
  Bot,
  Brain,
  CheckCircle2,
  ChevronRight,
  Code2,
  Cpu,
  Layers,
  Play,
  RefreshCw,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";

interface LangGraphCanvasProps {
  nodes: LangGraphNode[];
  agents: AgentDefinition[];
  traces: LangGraphExecutionTrace[];
  leads: Lead[];
  onExecuteNodeOnLead: (nodeId: string, leadId: string) => void;
  isProcessing: boolean;
  selectedLeadId?: string;
  onSelectLeadId: (id: string) => void;
}

export const LangGraphCanvas: React.FC<LangGraphCanvasProps> = ({
  nodes,
  agents,
  traces,
  leads,
  onExecuteNodeOnLead,
  isProcessing,
  selectedLeadId,
  onSelectLeadId,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>("node_evaluator");
  const [activeTab, setActiveTab] = useState<"graph" | "agents" | "traces">("graph");

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];
  const associatedAgent = agents.find((a) => a.id === selectedNode?.agent_id);
  const activeLead = leads.find((l) => l.id === selectedLeadId) || leads[0];

  return (
    <div className="space-y-6">
      {/* Top Banner & Mode Selector */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Workflow className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              LangGraph Multi-Agent Orchestration Graph
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Autonomous state machine with conditional branching, Claude 3.7 reasoning loops, and endless GoHighLevel CRM synchronization.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {[
            { id: "graph", label: "State Graph Canvas", icon: Workflow },
            { id: "agents", label: "Agent Swarm Roster", icon: Bot },
            { id: "traces", label: "Live Execution Stream", icon: Cpu },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
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
      </div>

      {activeTab === "graph" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Visual Interactive Graph Stage */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-slate-950 border border-slate-800/90 rounded-2xl p-5 shadow-2xl relative overflow-hidden min-h-[580px] flex flex-col justify-between">
              {/* Background Grid Accent */}
              <div className="absolute inset-0 bg-[radial-gradient(#312e81_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

              {/* Header inside canvas */}
              <div className="relative z-10 flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="font-semibold text-emerald-400">STATE GRAPH ONLINE</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">8 Autonomous Nodes Active</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Simulate On:</span>
                  <select
                    value={activeLead?.id}
                    onChange={(e) => onSelectLeadId(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1 font-medium focus:outline-none"
                  >
                    {leads.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.first_name} {l.last_name} ({l.company}) - Score: {l.ai_score || "New"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Interactive Node Flow Map */}
              <div className="relative z-10 py-6 space-y-6 overflow-x-auto">
                {/* Node Pipeline Rows */}
                <div className="flex flex-col gap-6 min-w-[700px]">
                  {/* Row 1: Intake -> Evaluation -> Routing */}
                  <div className="flex items-center gap-3 justify-start">
                    {/* Node: Scout */}
                    <button
                      onClick={() => setSelectedNodeId("node_scout")}
                      className={`flex-1 p-3.5 rounded-xl border text-left transition-all relative ${
                        selectedNodeId === "node_scout"
                          ? "bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500"
                          : "bg-slate-900/70 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] border border-amber-500/30">
                          ENTRY
                        </span>
                        <span className="text-slate-400 font-mono text-[10px]">node_scout</span>
                      </div>
                      <h4 className="text-xs font-bold text-white">Lead Ingestion & Clean</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">Webhook / Ads payload normalize</p>
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-amber-400">
                        <span>⚡ Claude 3.5 Haiku</span>
                      </div>
                    </button>

                    <div className="flex items-center text-slate-600">
                      <ArrowRight className="w-4 h-4 text-indigo-400 animate-pulse" />
                    </div>

                    {/* Node: Evaluator */}
                    <button
                      onClick={() => setSelectedNodeId("node_evaluator")}
                      className={`flex-1 p-3.5 rounded-xl border text-left transition-all relative ${
                        selectedNodeId === "node_evaluator"
                          ? "bg-slate-900 border-purple-500 shadow-lg shadow-purple-500/20 ring-1 ring-purple-500"
                          : "bg-slate-900/70 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px] border border-purple-500/30">
                          REASONING
                        </span>
                        <span className="text-slate-400 font-mono text-[10px]">node_evaluator</span>
                      </div>
                      <h4 className="text-xs font-bold text-white">Claude Deep Lead Scoring</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">ICP 0-100 + BANT matrix analysis</p>
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-purple-400">
                        <span>🧠 Claude 3.7 Sonnet</span>
                      </div>
                    </button>

                    <div className="flex items-center text-slate-600">
                      <ArrowRight className="w-4 h-4 text-indigo-400 animate-pulse" />
                    </div>

                    {/* Node: Router */}
                    <button
                      onClick={() => setSelectedNodeId("node_router")}
                      className={`flex-1 p-3.5 rounded-xl border text-left transition-all relative ${
                        selectedNodeId === "node_router"
                          ? "bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500"
                          : "bg-slate-900/70 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px] border border-indigo-500/30">
                          CONDITIONAL
                        </span>
                        <span className="text-slate-400 font-mono text-[10px]">node_router</span>
                      </div>
                      <h4 className="text-xs font-bold text-white">LangGraph Edge Router</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">Score &gt;= 65 ? Drip : Nurture</p>
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-indigo-400">
                        <span>🕸️ State Machine Edge</span>
                      </div>
                    </button>
                  </div>

                  {/* Branching indicator */}
                  <div className="flex items-center justify-between px-10 text-[11px] font-mono text-slate-400">
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span>↓ Branch: High ICP (Score &gt;= 65)</span>
                    </span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <span>↓ Branch: Low Fit (&lt;65) → Cold Nurture Queue</span>
                    </span>
                  </div>

                  {/* Row 2: Scribe -> Dispatch -> Objection Closer -> Calendar Booker */}
                  <div className="flex items-center gap-3 justify-start">
                    {/* Node: Scribe */}
                    <button
                      onClick={() => setSelectedNodeId("node_scribe")}
                      className={`flex-1 p-3.5 rounded-xl border text-left transition-all relative ${
                        selectedNodeId === "node_scribe"
                          ? "bg-slate-900 border-blue-500 shadow-lg shadow-blue-500/20 ring-1 ring-blue-500"
                          : "bg-slate-900/70 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px] border border-blue-500/30">
                          SYNTHESIS
                        </span>
                        <span className="text-slate-400 font-mono text-[10px]">node_scribe</span>
                      </div>
                      <h4 className="text-xs font-bold text-white">Claude Sequence Synthesis</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">4-Touchpoint bespoke Email & SMS</p>
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-blue-400">
                        <span>✍️ Claude 3.7 Sonnet</span>
                      </div>
                    </button>

                    <div className="flex items-center text-slate-600">
                      <ArrowRight className="w-4 h-4 text-indigo-400 animate-pulse" />
                    </div>

                    {/* Node: Dispatch */}
                    <button
                      onClick={() => setSelectedNodeId("node_dispatch")}
                      className={`flex-1 p-3.5 rounded-xl border text-left transition-all relative ${
                        selectedNodeId === "node_dispatch"
                          ? "bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500"
                          : "bg-slate-900/70 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] border border-cyan-500/30">
                          GHL DISPATCH
                        </span>
                        <span className="text-slate-400 font-mono text-[10px]">node_dispatch</span>
                      </div>
                      <h4 className="text-xs font-bold text-white">GHL Multi-Channel Deliver</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">Twilio SMS & Mailgun Delivery</p>
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-cyan-400">
                        <span>⚡ GHL API Bridge</span>
                      </div>
                    </button>

                    <div className="flex items-center text-slate-600">
                      <ArrowRight className="w-4 h-4 text-indigo-400 animate-pulse" />
                    </div>

                    {/* Node: Closer */}
                    <button
                      onClick={() => setSelectedNodeId("node_closer")}
                      className={`flex-1 p-3.5 rounded-xl border text-left transition-all relative ${
                        selectedNodeId === "node_closer"
                          ? "bg-slate-900 border-emerald-500 shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-500"
                          : "bg-slate-900/70 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] border border-emerald-500/30">
                          2-WAY LOOP
                        </span>
                        <span className="text-slate-400 font-mono text-[10px]">node_closer</span>
                      </div>
                      <h4 className="text-xs font-bold text-white">Objection Closer Agent</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">Sentiment, rebuttal & booking push</p>
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-400">
                        <span>💬 Claude 3.7 Reasoning</span>
                      </div>
                    </button>

                    <div className="flex items-center text-slate-600">
                      <ArrowRight className="w-4 h-4 text-indigo-400 animate-pulse" />
                    </div>

                    {/* Node: Scheduler */}
                    <button
                      onClick={() => setSelectedNodeId("node_scheduler")}
                      className={`flex-1 p-3.5 rounded-xl border text-left transition-all relative ${
                        selectedNodeId === "node_scheduler"
                          ? "bg-slate-900 border-rose-500 shadow-lg shadow-rose-500/20 ring-1 ring-rose-500"
                          : "bg-slate-900/70 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[10px] border border-rose-500/30">
                          BOOKING SINK
                        </span>
                        <span className="text-slate-400 font-mono text-[10px]">node_scheduler</span>
                      </div>
                      <h4 className="text-xs font-bold text-white">GHL Calendar Auto-Book</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">Lock slot, send Zoom, stage sync</p>
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-rose-400">
                        <span>📅 GHL Calendar API</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom status indicator */}
              <div className="relative z-10 border-t border-slate-800/80 pt-3 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Click any graph node to inspect live LangGraph state schema, agent prompt, and tools.</span>
                </div>
                <button
                  onClick={() => onExecuteNodeOnLead(selectedNodeId, activeLead?.id)}
                  disabled={isProcessing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md disabled:opacity-50 transition-all"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Execute {selectedNode?.label.split(" ")[0]} Node</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel: Node Inspector & State Payload */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">Node Inspector</h3>
                </div>
                <span className="text-xs font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  {selectedNode?.id}
                </span>
              </div>

              {/* Node Title & Agent Brain */}
              <div>
                <h4 className="text-base font-bold text-white">{selectedNode?.label}</h4>
                <p className="text-xs text-slate-400 mt-1">{selectedNode?.description}</p>
              </div>

              {/* Associated Agent Info */}
              {associatedAgent && (
                <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-semibold uppercase text-[10px]">Assigned Agent Brain</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium">
                      {associatedAgent.brain}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{associatedAgent.avatar}</span>
                    <div>
                      <h5 className="text-xs font-bold text-white">{associatedAgent.name}</h5>
                      <span className="text-[11px] text-slate-400">{associatedAgent.role}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-300 border-t border-slate-800/80 pt-2 line-clamp-3">
                    {associatedAgent.description}
                  </p>
                </div>
              )}

              {/* State Machine Keys */}
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                  LangGraph Memory State Keys
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode?.state_keys.map((key) => (
                    <span
                      key={key}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-indigo-300 border border-slate-800"
                    >
                      state.{key}
                    </span>
                  ))}
                </div>
              </div>

              {/* Active Tools */}
              {associatedAgent && associatedAgent.active_tools && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                    Authorized Agent Tools
                  </span>
                  <div className="space-y-1">
                    {associatedAgent.active_tools.map((tool) => (
                      <div
                        key={tool}
                        className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-950/60 px-2.5 py-1 rounded border border-slate-800"
                      >
                        <Code2 className="w-3 h-3 text-indigo-400" />
                        <span className="font-mono text-[11px]">{tool}()</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Execute Node Button */}
              <div className="pt-2">
                <button
                  onClick={() => onExecuteNodeOnLead(selectedNodeId, activeLead?.id)}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 disabled:opacity-50 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Node on {activeLead?.first_name || "Lead"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Agent Swarm Roster */}
      {activeTab === "agents" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl shadow-inner">
                      {agent.avatar}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{agent.name}</h4>
                      <span className="text-xs text-slate-400 block">{agent.role}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${agent.badgeColor}`}>
                    {agent.status.toUpperCase()}
                  </span>
                </div>

                <div className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Architecture & Model</span>
                  <div className="font-semibold text-purple-300">{agent.brain}</div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{agent.description}</p>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">System Prompt Directive</span>
                  <p className="text-[11px] text-slate-400 italic bg-slate-950 p-2.5 rounded-lg border border-slate-800/60 line-clamp-3">
                    "{agent.system_prompt}"
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Actions: <strong className="text-slate-200">{agent.total_actions}</strong></span>
                <span className="text-emerald-400 font-medium">● Active {agent.last_active}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Execution Traces */}
      {activeTab === "traces" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">LangGraph Step-By-Step Reasoning Stream</h3>
              <p className="text-xs text-slate-400">Real-time state mutations, tool invocations, and agent latency</p>
            </div>
            <span className="text-xs text-slate-400 font-mono">{traces.length} Traces Logged</span>
          </div>

          <div className="space-y-3">
            {traces.map((trace) => (
              <div
                key={trace.id}
                className="bg-slate-950 border border-slate-800/90 rounded-xl p-4 space-y-2 hover:border-slate-700 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-indigo-400">{trace.agent_name}</span>
                    <span className="text-slate-500">→</span>
                    <span className="font-semibold text-white">{trace.lead_name}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400 font-mono text-[11px]">{trace.node_id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      {trace.duration_ms}ms
                    </span>
                    <span className="text-[11px] text-slate-400">{trace.timestamp.split("T")[1]?.slice(0, 8)}</span>
                  </div>
                </div>

                <div className="text-xs font-semibold text-slate-200">{trace.action}</div>

                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-xs text-slate-300 font-mono">
                  <div className="text-[10px] text-slate-500 mb-1">REASONING THOUGHT TRACE:</div>
                  <p className="leading-relaxed">{trace.thought_trace}</p>
                </div>

                {trace.tool_calls && trace.tool_calls.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Tools Called:</span>
                    <div className="flex flex-wrap gap-2">
                      {trace.tool_calls.map((tc, idx) => (
                        <div
                          key={idx}
                          className="text-[11px] font-mono bg-slate-900 text-emerald-400 px-2 py-1 rounded border border-emerald-500/30 flex items-center gap-1.5"
                        >
                          <Zap className="w-3 h-3 text-emerald-400" />
                          <span>{tc.tool}()</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
