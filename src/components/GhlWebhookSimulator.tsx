import React, { useState } from "react";
import { GHLConfig, Lead } from "../types";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  ExternalLink,
  Layers,
  Play,
  Radio,
  RefreshCw,
  Send,
  Settings,
  Sparkles,
  Zap,
} from "lucide-react";

interface GhlWebhookSimulatorProps {
  ghlConfig: GHLConfig;
  onUpdateConfig: (config: Partial<GHLConfig>) => void;
  onSimulateWebhook: (payload: any) => Promise<void>;
  isProcessing: boolean;
}

const WEBHOOK_PRESETS = [
  {
    name: "Facebook Lead Ad (Enterprise SaaS)",
    payload: {
      event: "facebook_lead_ad",
      location_id: "loc_us_east_894192",
      form_id: "form_fb_revops_enterprise",
      contact: {
        first_name: "Alexander",
        last_name: "Wright",
        email: "awright@apexcloudsystems.com",
        phone: "+1 (310) 902-8419",
        company_name: "Apex Cloud Systems",
        job_title: "Chief Revenue Officer",
        website: "https://apexcloudsystems.com",
        industry: "Enterprise SaaS / DevTools",
        company_size: "100-500",
        budget: "$50k+/mo",
        notes: "Need sub-90 second lead qualification and automated GHL appointment scheduling for our 12 account executives.",
      },
    },
  },
  {
    name: "Typeform Inbound Consultation",
    payload: {
      event: "typeform_submission",
      location_id: "loc_us_east_894192",
      form_id: "tf_growth_audit_2026",
      contact: {
        first_name: "Julianna",
        last_name: "Mercer",
        email: "julianna@mercerwealth.co",
        phone: "+1 (212) 490-1123",
        company_name: "Mercer Wealth Advisory",
        job_title: "Managing Director",
        website: "https://mercerwealth.co",
        industry: "Financial Advisory & Wealth",
        company_size: "20-50",
        budget: "$25k - $50k/mo",
        notes: "High-net-worth inbound client leads are taking 4 hours to receive call-backs. Need autonomous 2-way SMS booking.",
      },
    },
  },
  {
    name: "Inbound Customer SMS Reply",
    payload: {
      event: "inbound_sms_reply",
      location_id: "loc_us_east_894192",
      contact: {
        first_name: "Jordan",
        last_name: "Cole",
        email: "jordan@colerealty.com",
        phone: "+1 (415) 302-9912",
        company_name: "Cole Commercial Properties",
        job_title: "Founder",
        industry: "Commercial Real Estate",
        company_size: "10-50",
        budget: "$15k/mo",
        notes: "Saw your outreach. How soon can we get this live on our GHL sub-account?",
      },
    },
  },
];

export const GhlWebhookSimulator: React.FC<GhlWebhookSimulatorProps> = ({
  ghlConfig,
  onUpdateConfig,
  onSimulateWebhook,
  isProcessing,
}) => {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [customJson, setCustomJson] = useState(
    JSON.stringify(WEBHOOK_PRESETS[0].payload, null, 2)
  );
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [apiKeyInput, setApiKeyInput] = useState(ghlConfig.api_key);
  const [locIdInput, setLocIdInput] = useState(ghlConfig.location_id);
  const [pipeIdInput, setPipeIdInput] = useState(ghlConfig.pipeline_id);
  const [calIdInput, setCalIdInput] = useState(ghlConfig.calendar_id);
  const [syncMode, setSyncMode] = useState(ghlConfig.sync_mode);

  const handleSelectPreset = (index: number) => {
    setSelectedPresetIndex(index);
    setCustomJson(JSON.stringify(WEBHOOK_PRESETS[index].payload, null, 2));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      api_key: apiKeyInput,
      location_id: locIdInput,
      pipeline_id: pipeIdInput,
      calendar_id: calIdInput,
      sync_mode: syncMode,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleFireWebhook = async () => {
    try {
      const parsed = JSON.parse(customJson);
      await onSimulateWebhook(parsed);
    } catch (e: any) {
      alert("Invalid JSON payload: " + e.message);
    }
  };

  const handleCopyEndpoint = () => {
    navigator.clipboard.writeText(ghlConfig.webhook_endpoint);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Zap className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              GoHighLevel API Integration & Webhook Simulator
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Configure GHL API credentials, test real-time inbound lead ingestion, and observe instant LangGraph multi-agent orchestration.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            GHL Live Webhook Ingestion Online
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Webhook Payload Simulator */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Inbound Webhook Payload Simulator
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">POST /api/ghl/webhook</span>
            </div>

            {/* Presets */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">Load Event Preset</label>
              <div className="flex flex-wrap gap-2">
                {WEBHOOK_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectPreset(idx)}
                    className={`text-xs px-3 py-1.5 rounded-xl border transition-all font-semibold ${
                      selectedPresetIndex === idx
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm"
                        : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200"
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* JSON Editor */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">JSON Payload</label>
              <textarea
                rows={12}
                value={customJson}
                onChange={(e) => setCustomJson(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-emerald-400 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Fire Button */}
            <button
              onClick={handleFireWebhook}
              disabled={isProcessing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{isProcessing ? "Ingesting & Routing..." : "Trigger Inbound Webhook Lead Event"}</span>
            </button>
          </div>
        </div>

        {/* Right: GHL Configuration */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  GoHighLevel CRM Settings
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Connected
              </span>
            </div>

            {/* Webhook Endpoint Copy */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Your GHL Inbound Webhook URL</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={ghlConfig.webhook_endpoint}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 font-mono select-all"
                />
                <button
                  onClick={handleCopyEndpoint}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200"
                  title="Copy URL"
                >
                  {copiedUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-500">
                Paste this into your GoHighLevel Custom Webhook Action or Zapier/Make flow.
              </p>
            </div>

            {/* Settings Form */}
            <form onSubmit={handleSaveSettings} className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">GHL API v2 Private Key</label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Location Sub-Account ID</label>
                <input
                  type="text"
                  value={locIdInput}
                  onChange={(e) => setLocIdInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Pipeline ID</label>
                  <input
                    type="text"
                    value={pipeIdInput}
                    onChange={(e) => setPipeIdInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Calendar ID</label>
                  <input
                    type="text"
                    value={calIdInput}
                    onChange={(e) => setCalIdInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Autonomous Execution Mode</label>
                <select
                  value={syncMode}
                  onChange={(e) => setSyncMode(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="autonomous_loop">Endless Autonomous Loop (Auto-Score, Outreach & Book)</option>
                  <option value="semi_autonomous">Semi-Autonomous (Agent Proposals with 1-Click Approve)</option>
                  <option value="manual_approval">Manual Confirmation Only</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                {saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Configuration Saved & Synced!</span>
                  </>
                ) : (
                  <span>Save GHL Connection Settings</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
