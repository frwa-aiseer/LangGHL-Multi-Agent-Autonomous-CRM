import React, { useState } from "react";
import { GhlPipelineStage, Lead } from "../types";
import { Plus, User, X, Zap } from "lucide-react";

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (lead: Lead) => void;
}

export const NewLeadModal: React.FC<NewLeadModalProps> = ({
  isOpen,
  onClose,
  onAddLead,
}) => {
  if (!isOpen) return null;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("VP of Sales");
  const [industry, setIndustry] = useState("B2B SaaS");
  const [companySize, setCompanySize] = useState("50-200");
  const [source, setSource] = useState("Inbound Webhook");
  const [budgetRange, setBudgetRange] = useState("$25k - $50k/mo");
  const [dealValue, setDealValue] = useState(30000);
  const [painPoint, setPainPoint] = useState("Needs automated 24/7 GHL lead follow-up and appointment setting");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !email) return;

    const newLead: Lead = {
      id: "lead_" + Math.random().toString(36).substr(2, 9),
      ghl_contact_id: "ghl_cnt_" + Math.floor(100000 + Math.random() * 900000),
      first_name: firstName,
      last_name: lastName || "",
      email,
      phone: phone || "+1 (555) 019-2831",
      company: company || "Acme Corp",
      title,
      industry,
      company_size: companySize,
      source,
      budget_range: budgetRange,
      deal_value: Number(dealValue) || 25000,
      pain_points: [painPoint],
      ghl_pipeline_stage: "new_inbound",
      ai_score: 0,
      icp_fit: "B (Standard)",
      score_breakdown: {
        intent: 0,
        authority: 0,
        budget: 0,
        timing: 0,
        need: 0,
      },
      tags: ["New-Inbound", industry],
      outreach_status: "pending",
      created_at: new Date().toISOString(),
      conversation_history: [],
      sequence_steps: [],
      activity_log: [
        {
          id: "act_" + Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          agent: "Lead Ingestion Scout",
          action: "Ingested new contact record",
          details: `Source: ${source}. Enqueued for Claude Lead Scoring.`,
          sentiment: "neutral",
        },
      ],
    };

    onAddLead(newLead);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Add New Prospect into GHL Pipeline</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">First Name *</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Jordan"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Miller"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Work Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jordan@company.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Phone (SMS Enabled)</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 234-5678"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Company Name</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Miller Logistics"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Job Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Chief Operating Officer"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Industry</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. Logistics"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Company Size</label>
              <select
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              >
                <option value="1-10">1-10</option>
                <option value="10-50">10-50</option>
                <option value="50-200">50-200</option>
                <option value="200+">200+</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Est. Deal Value ($)</label>
              <input
                type="number"
                value={dealValue}
                onChange={(e) => setDealValue(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Core Pain Point / Note</label>
            <textarea
              rows={2}
              value={painPoint}
              onChange={(e) => setPainPoint(e.target.value)}
              placeholder="What problem does this prospect need solved?"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md"
            >
              Add to Inbound Queue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
