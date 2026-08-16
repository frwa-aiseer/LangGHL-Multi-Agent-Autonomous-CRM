import React from "react";
import { GhlPipelineStage, Lead } from "../types";
import {
  Brain,
  Calendar,
  ChevronRight,
  DollarSign,
  Mail,
  MessageSquare,
  MoreVertical,
  Phone,
  Plus,
  Sparkles,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";

interface GhlPipelineBoardProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onMoveLeadStage: (leadId: string, targetStage: GhlPipelineStage) => void;
  onQuickScoreLead: (lead: Lead) => void;
  onQuickGenerateSequence: (lead: Lead) => void;
  onOpenNewLeadModal: () => void;
}

const PIPELINE_COLUMNS: Array<{
  stage: GhlPipelineStage;
  title: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  icon: string;
}> = [
  {
    stage: "new_inbound",
    title: "New Inbound Leads",
    badgeBg: "bg-amber-500/10",
    badgeText: "text-amber-400",
    borderColor: "border-amber-500/30",
    icon: "📥",
  },
  {
    stage: "scoring_enrichment",
    title: "Claude ICP Enriched",
    badgeBg: "bg-purple-500/10",
    badgeText: "text-purple-400",
    borderColor: "border-purple-500/30",
    icon: "🧠",
  },
  {
    stage: "active_sequence",
    title: "Active Sequence (Email/SMS)",
    badgeBg: "bg-blue-500/10",
    badgeText: "text-blue-400",
    borderColor: "border-blue-500/30",
    icon: "✉️",
  },
  {
    stage: "engaged_objection",
    title: "Engaged / Objection Solving",
    badgeBg: "bg-indigo-500/10",
    badgeText: "text-indigo-400",
    borderColor: "border-indigo-500/30",
    icon: "💬",
  },
  {
    stage: "appointment_booked",
    title: "Appointment Booked / Demo",
    badgeBg: "bg-emerald-500/10",
    badgeText: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    icon: "📅",
  },
  {
    stage: "opportunity_won",
    title: "Opportunity Won ($)",
    badgeBg: "bg-teal-500/10",
    badgeText: "text-teal-400",
    borderColor: "border-teal-500/30",
    icon: "🏆",
  },
];

export const GhlPipelineBoard: React.FC<GhlPipelineBoardProps> = ({
  leads,
  onSelectLead,
  onMoveLeadStage,
  onQuickScoreLead,
  onQuickGenerateSequence,
  onOpenNewLeadModal,
}) => {
  return (
    <div className="space-y-4">
      {/* Board Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg backdrop-blur">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>GoHighLevel Live Opportunity Pipeline</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
              Autonomous Sync
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time GHL custom stage board with Claude scoring, automated stage routing, and calendar slot booking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewLeadModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-900/40 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Prospect</span>
          </button>
        </div>
      </div>

      {/* Kanban Stage Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {PIPELINE_COLUMNS.map((column) => {
          const stageLeads = leads.filter((l) => l.ghl_pipeline_stage === column.stage);
          const stageValue = stageLeads.reduce((acc, l) => acc + (l.deal_value || 0), 0);

          return (
            <div
              key={column.stage}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-md flex flex-col justify-between min-w-[260px] space-y-3"
            >
              {/* Stage Header */}
              <div className={`p-2.5 rounded-xl border ${column.borderColor} ${column.badgeBg} flex flex-col gap-1`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{column.icon}</span>
                    <h3 className="text-xs font-bold text-white tracking-tight">{column.title}</h3>
                  </div>
                  <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-950/80 text-white">
                    {stageLeads.length}
                  </span>
                </div>
                <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
                  <span>Pipeline Value:</span>
                  <span className="font-bold text-slate-200">${stageValue.toLocaleString()}</span>
                </div>
              </div>

              {/* Cards Container */}
              <div className="space-y-3 flex-1 min-h-[300px]">
                {stageLeads.length === 0 ? (
                  <div className="h-40 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-center p-3 text-slate-500 text-xs">
                    <span>No leads in this stage</span>
                    <span className="text-[10px] text-slate-600 mt-1">Autonomous agents will populate on trigger</span>
                  </div>
                ) : (
                  stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => onSelectLead(lead)}
                      className="bg-slate-950 border border-slate-800/90 hover:border-indigo-500/60 rounded-xl p-3.5 shadow-md hover:shadow-indigo-500/10 cursor-pointer transition-all space-y-2.5 group"
                    >
                      {/* Card Top: Name & AI Score */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                            {lead.first_name} {lead.last_name}
                          </h4>
                          <span className="text-[11px] text-slate-400 block line-clamp-1">
                            {lead.title} • {lead.company}
                          </span>
                        </div>
                        {lead.ai_score > 0 ? (
                          <div
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              lead.ai_score >= 90
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                : lead.ai_score >= 70
                                ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                                : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                            }`}
                          >
                            {lead.ai_score} AI
                          </div>
                        ) : (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                            Unscored
                          </span>
                        )}
                      </div>

                      {/* ICP Fit & Deal Value */}
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-900 text-indigo-300 border border-slate-800">
                          {lead.icp_fit}
                        </span>
                        <span className="font-bold text-amber-300">
                          ${(lead.deal_value || 0).toLocaleString()}
                        </span>
                      </div>

                      {/* Tags */}
                      {lead.tags && lead.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {lead.tags.slice(0, 2).map((tag, i) => (
                            <span
                              key={i}
                              className="text-[9px] font-medium px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Appointment Highlight if Booked */}
                      {lead.appointment && (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-2 text-[10px] text-emerald-300 flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-emerald-400" />
                          <span>
                            {lead.appointment.date} @ {lead.appointment.time}
                          </span>
                        </div>
                      )}

                      {/* Card Bottom: Quick Actions */}
                      <div
                        className="border-t border-slate-800/80 pt-2 flex items-center justify-between text-[10px] text-slate-400"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-1">
                          {lead.ai_score === 0 && (
                            <button
                              onClick={() => onQuickScoreLead(lead)}
                              className="text-[10px] text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20"
                            >
                              <Brain className="w-2.5 h-2.5" />
                              <span>Score</span>
                            </button>
                          )}
                          {lead.ai_score > 0 && lead.sequence_steps.length === 0 && (
                            <button
                              onClick={() => onQuickGenerateSequence(lead)}
                              className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20"
                            >
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>Sequence</span>
                            </button>
                          )}
                        </div>

                        {/* Stage transition quick advance */}
                        <div className="flex items-center gap-1">
                          {column.stage !== "opportunity_won" && (
                            <button
                              title="Advance to next GHL stage"
                              onClick={() => {
                                const stages: GhlPipelineStage[] = [
                                  "new_inbound",
                                  "scoring_enrichment",
                                  "active_sequence",
                                  "engaged_objection",
                                  "appointment_booked",
                                  "opportunity_won",
                                ];
                                const currentIndex = stages.indexOf(lead.ghl_pipeline_stage);
                                if (currentIndex >= 0 && currentIndex < stages.length - 1) {
                                  onMoveLeadStage(lead.id, stages[currentIndex + 1]);
                                }
                              }}
                              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
