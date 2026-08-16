import React, { useState } from "react";
import { GhlPipelineStage, IcpFitTier, Lead } from "../types";
import {
  Brain,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Filter,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  Search,
  Sparkles,
  User,
  Zap,
} from "lucide-react";

interface LeadsInboxViewProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onQuickScoreLead: (lead: Lead) => void;
  onOpenNewLeadModal: () => void;
  isProcessing: boolean;
}

export const LeadsInboxView: React.FC<LeadsInboxViewProps> = ({
  leads,
  onSelectLead,
  onQuickScoreLead,
  onOpenNewLeadModal,
  isProcessing,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [icpFilter, setIcpFilter] = useState<string>("all");

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      `${lead.first_name} ${lead.last_name} ${lead.company} ${lead.email} ${lead.industry}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStage = stageFilter === "all" || lead.ghl_pipeline_stage === stageFilter;
    const matchesIcp = icpFilter === "all" || lead.icp_fit === icpFilter;

    return matchesSearch && matchesStage && matchesIcp;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search Box */}
          <div className="relative min-w-[240px] flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search prospects by name, company, email..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Stage Filter */}
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="all">All GHL Stages</option>
            <option value="new_inbound">New Inbound</option>
            <option value="scoring_enrichment">Claude Scoring & Enrichment</option>
            <option value="active_sequence">Active Sequence</option>
            <option value="engaged_objection">Engaged / Objection</option>
            <option value="appointment_booked">Appointment Booked</option>
            <option value="opportunity_won">Opportunity Won</option>
            <option value="cold_nurture">Cold Nurture</option>
          </select>

          {/* ICP Filter */}
          <select
            value={icpFilter}
            onChange={(e) => setIcpFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="all">All ICP Fits</option>
            <option value="A+ (Unicorn)">A+ (Unicorn)</option>
            <option value="A (Prime)">A (Prime)</option>
            <option value="B (Standard)">B (Standard)</option>
            <option value="C (Low Priority)">C (Low Priority)</option>
          </select>
        </div>

        <button
          onClick={onOpenNewLeadModal}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Prospect</span>
        </button>
      </div>

      {/* Leads Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Contact & Company</th>
                <th className="py-3 px-4">AI Score & ICP</th>
                <th className="py-3 px-4">GHL Stage</th>
                <th className="py-3 px-4">Outreach Status</th>
                <th className="py-3 px-4">Deal Value</th>
                <th className="py-3 px-4">2-Way Activity</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No matching prospects found.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => onSelectLead(lead)}
                    className="hover:bg-slate-850/50 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-indigo-400 font-bold text-xs shadow-inner">
                          {lead.first_name[0]}{lead.last_name[0]}
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-indigo-300 transition-colors">
                            {lead.first_name} {lead.last_name}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {lead.title} • <strong className="text-slate-300">{lead.company}</strong>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {lead.ai_score > 0 ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-purple-300 font-mono text-xs">
                              {lead.ai_score}/100
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              {lead.icp_fit}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onQuickScoreLead(lead);
                          }}
                          disabled={isProcessing}
                          className="text-[10px] text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20"
                        >
                          <Brain className="w-3 h-3" />
                          <span>Score Now</span>
                        </button>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-950 text-indigo-300 border border-slate-800">
                        {lead.ghl_pipeline_stage.replace("_", " ").toUpperCase()}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {lead.appointment ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            <Calendar className="w-2.5 h-2.5" /> Booked
                          </span>
                        ) : lead.outreach_status === "replied" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            <MessageSquare className="w-2.5 h-2.5" /> Replied
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 capitalize">
                            {lead.outreach_status.replace("_", " ")}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-amber-300 font-mono">
                      ${(lead.deal_value || 0).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-[11px] text-slate-400">
                      {lead.conversation_history.length > 0 ? (
                        <span className="text-slate-200">
                          {lead.conversation_history.length} messages logged
                        </span>
                      ) : (
                        <span className="text-slate-500">No replies yet</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectLead(lead);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white transition-colors"
                        title="Open Prospect Dossier & 2-Way Inbox"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
