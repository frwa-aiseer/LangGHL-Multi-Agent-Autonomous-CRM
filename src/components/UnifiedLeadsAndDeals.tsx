import React, { useState } from "react";
import { GhlPipelineStage, Lead, SequenceStep } from "../types";
import { GhlPipelineBoard } from "./GhlPipelineBoard";
import { LeadsInboxView } from "./LeadsInboxView";
import { SequenceStudio } from "./SequenceStudio";
import { LayoutGrid, List, Sparkles, UserPlus, Users } from "lucide-react";

interface UnifiedLeadsAndDealsProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onMoveLeadStage: (leadId: string, targetStage: GhlPipelineStage) => void;
  onQuickScoreLead: (lead: Lead) => void;
  onQuickGenerateSequence: (lead: Lead) => Promise<SequenceStep[] | void>;
  onOpenNewLeadModal: () => void;
  isProcessing: boolean;
}

export const UnifiedLeadsAndDeals: React.FC<UnifiedLeadsAndDealsProps> = ({
  leads,
  onSelectLead,
  onMoveLeadStage,
  onQuickScoreLead,
  onQuickGenerateSequence,
  onOpenNewLeadModal,
  isProcessing,
}) => {
  const [activeView, setActiveView] = useState<"board" | "list" | "sequence">("board");

  const activeLeadsCount = leads.length;
  const bookedCount = leads.filter(
    (l) => l.ghl_pipeline_stage === "appointment_booked" || l.appointment
  ).length;
  const totalValue = leads.reduce((acc, l) => acc + (l.deal_value || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-View Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Leads & Deals Center</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 font-semibold border border-indigo-500/25">
              {activeLeadsCount} Total Leads • ${totalValue.toLocaleString()} Pipeline
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            View your pipeline board, manage customer contacts, or create personalized AI email sequences.
          </p>
        </div>

        {/* Clean View Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveView("board")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeView === "board"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Pipeline Board</span>
          </button>
          <button
            onClick={() => setActiveView("list")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeView === "list"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Contact List ({leads.length})</span>
          </button>
          <button
            onClick={() => setActiveView("sequence")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeView === "sequence"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Email Writer</span>
          </button>
        </div>
      </div>

      {/* Render Active View */}
      {activeView === "board" && (
        <GhlPipelineBoard
          leads={leads}
          onSelectLead={onSelectLead}
          onMoveLeadStage={onMoveLeadStage}
          onQuickScoreLead={onQuickScoreLead}
          onQuickGenerateSequence={onQuickGenerateSequence}
          onOpenNewLeadModal={onOpenNewLeadModal}
        />
      )}

      {activeView === "list" && (
        <LeadsInboxView
          leads={leads}
          onSelectLead={onSelectLead}
          onQuickScoreLead={onQuickScoreLead}
          onOpenNewLeadModal={onOpenNewLeadModal}
          isProcessing={isProcessing}
        />
      )}

      {activeView === "sequence" && (
        <SequenceStudio
          leads={leads}
          onGenerateCustomSequence={onQuickGenerateSequence}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
};
