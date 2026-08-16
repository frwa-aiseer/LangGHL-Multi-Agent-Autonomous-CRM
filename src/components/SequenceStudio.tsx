import React, { useState } from "react";
import { Lead, SequenceStep } from "../types";
import {
  CheckCircle2,
  Copy,
  Layers,
  Mail,
  MessageSquare,
  Play,
  RefreshCw,
  Send,
  Sparkles,
  Zap,
} from "lucide-react";

interface SequenceStudioProps {
  leads: Lead[];
  onGenerateCustomSequence: (
    lead: Lead,
    style: string,
    bookingLink: string
  ) => Promise<SequenceStep[] | void>;
  isProcessing: boolean;
}

export const SequenceStudio: React.FC<SequenceStudioProps> = ({
  leads,
  onGenerateCustomSequence,
  isProcessing,
}) => {
  const [selectedLeadId, setSelectedLeadId] = useState<string>(leads[0]?.id || "");
  const [toneStyle, setToneStyle] = useState<string>("Value-First Consultative");
  const [customLink, setCustomLink] = useState("https://link.ghlcalendar.com/discovery-demo");
  const [generatedSteps, setGeneratedSteps] = useState<SequenceStep[]>([]);
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const activeLead = leads.find((l) => l.id === selectedLeadId) || leads[0];

  const handleGenerate = async () => {
    if (!activeLead) return;
    const res = await onGenerateCustomSequence(activeLead, toneStyle, customLink);
    if (res && Array.isArray(res)) {
      setGeneratedSteps(res);
    }
  };

  const handleCopy = (text: string, stepNum: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepNum);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Claude AI Sequence Studio & Copy Synthesizer
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Synthesize high-converting, omni-channel 4-touchpoint campaigns tailored with prospect data, pain points, and GoHighLevel calendar links.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Config Controls */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Sequence Prompt Config</h3>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Target Prospect</label>
              <select
                value={selectedLeadId}
                onChange={(e) => setSelectedLeadId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              >
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.first_name} {l.last_name} ({l.company})
                  </option>
                ))}
              </select>
            </div>

            {activeLead && (
              <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Industry:</span>
                  <span className="text-slate-200 font-semibold">{activeLead.industry}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Company Size:</span>
                  <span className="text-slate-200">{activeLead.company_size}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Reported Budget:</span>
                  <span className="text-amber-300 font-semibold">{activeLead.budget_range}</span>
                </div>
                <div className="pt-1 border-t border-slate-800 text-[11px] text-slate-400">
                  <span>Key Need: </span>
                  <span className="text-purple-300">{activeLead.pain_points?.[0] || "Pipeline Automation"}</span>
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Copywriting Style & Persona</label>
              <select
                value={toneStyle}
                onChange={(e) => setToneStyle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              >
                <option value="Value-First Consultative">Value-First Consultative (Recommended)</option>
                <option value="Challenger Problem-Solver">Challenger Problem-Solver</option>
                <option value="Direct No-Fluff Pitch">Direct No-Fluff Pitch</option>
                <option value="VIP High-Touch Executive">VIP High-Touch Executive</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">GHL Calendar Booking Link</label>
              <input
                type="text"
                value={customLink}
                onChange={(e) => setCustomLink(e.target.value)}
                placeholder="https://link.ghlcalendar.com/demo"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isProcessing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isProcessing ? "Synthesizing Copy..." : "Generate 4-Step Sequence"}</span>
            </button>
          </div>
        </div>

        {/* Right Sequence Output Grid */}
        <div className="lg:col-span-8 space-y-4">
          {generatedSteps.length === 0 && (!activeLead?.sequence_steps || activeLead.sequence_steps.length === 0) ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
              <Mail className="w-12 h-12 text-slate-600 mx-auto" />
              <div>
                <h4 className="text-base font-bold text-white">Generate Sequence with Claude Brain</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Click 'Generate 4-Step Sequence' to test the Claude Scribe agent on {activeLead?.first_name || "the prospect"} with live prompt variables.
                </p>
              </div>
              <button
                onClick={handleGenerate}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md"
              >
                Generate Preview Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(generatedSteps.length > 0 ? generatedSteps : activeLead.sequence_steps).map((step) => (
                <div
                  key={step.step_num}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono uppercase">
                        Touchpoint #{step.step_num} • {step.channel}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">Day +{step.delay_days}</span>
                    </div>

                    {step.subject && (
                      <div className="text-xs font-bold text-white bg-slate-950 p-2 rounded-lg border border-slate-800">
                        Subject: {step.subject}
                      </div>
                    )}

                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 text-xs text-slate-300 whitespace-pre-line leading-relaxed max-h-52 overflow-y-auto">
                      {step.body}
                    </div>
                  </div>

                  <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 italic">
                      {step.ai_generated_notes || "Claude personalized hook"}
                    </span>
                    <button
                      onClick={() => handleCopy(step.body, step.step_num)}
                      className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
                    >
                      {copiedStep === step.step_num ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
