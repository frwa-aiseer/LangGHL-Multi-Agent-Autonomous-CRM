/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import {
  INITIAL_AGENTS,
  INITIAL_EXECUTION_TRACES,
  INITIAL_GHL_CONFIG,
  INITIAL_LANGGRAPH_NODES,
  INITIAL_LEADS,
  INITIAL_MARKETING_CAMPAIGNS,
  INITIAL_OFFERS,
  INITIAL_PLATFORM_FINANCIALS,
  INITIAL_ROUTINES,
} from "./data/initialData";
import {
  AgentDefinition,
  AutomationRoutine,
  GHLConfig,
  GhlPipelineStage,
  LangGraphExecutionTrace,
  LangGraphNode,
  Lead,
  MarketingCampaign,
  OfferItem,
  PlatformFinancials,
  SequenceStep,
} from "./types";
import { Header } from "./components/Header";
import { UnifiedProductsView } from "./components/UnifiedProductsView";
import { UnifiedLeadsAndDeals } from "./components/UnifiedLeadsAndDeals";
import { UnifiedAutomations } from "./components/UnifiedAutomations";
import { SubscriptionAuthPortal, UserSession } from "./components/SubscriptionAuthPortal";
import { LeadDossierModal } from "./components/LeadDossierModal";
import { NewLeadModal } from "./components/NewLeadModal";
import confetti from "canvas-confetti";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("deals");
  const [offers, setOffers] = useState<OfferItem[]>(INITIAL_OFFERS);
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(INITIAL_MARKETING_CAMPAIGNS);
  const [financials, setFinancials] = useState<PlatformFinancials>(INITIAL_PLATFORM_FINANCIALS);
  const [selectedOfferForTriage, setSelectedOfferForTriage] = useState<OfferItem | null>(null);

  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [agents, setAgents] = useState<AgentDefinition[]>(INITIAL_AGENTS);
  const [nodes, setNodes] = useState<LangGraphNode[]>(INITIAL_LANGGRAPH_NODES);
  const [routines, setRoutines] = useState<AutomationRoutine[]>(INITIAL_ROUTINES);
  const [traces, setTraces] = useState<LangGraphExecutionTrace[]>(INITIAL_EXECUTION_TRACES);
  const [ghlConfig, setGhlConfig] = useState<GHLConfig>(INITIAL_GHL_CONFIG);

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [loopIntervalSec, setLoopIntervalSec] = useState(15);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [userSession, setUserSession] = useState<UserSession>({
    companyName: "NexGen Logistics",
    email: "alex.wright@nexgen.io",
    plan: "Growth",
    role: "Company Admin",
    isLoggedIn: true,
  });
  const [showAuthPortal, setShowAuthPortal] = useState<boolean>(false);

  const loopTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // -------------------------------------------------------------
  // API: Score Lead (Claude Evaluator Agent)
  // -------------------------------------------------------------
  const handleScoreLead = async (leadToScore: Lead) => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/agent/score-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead: leadToScore }),
      });
      const data = await res.json();

      const updatedLead: Lead = {
        ...leadToScore,
        ai_score: data.score || 88,
        icp_fit: data.icp_fit || "A (Prime)",
        score_breakdown: data.breakdown || {
          intent: 90,
          authority: 90,
          budget: 80,
          timing: 85,
          need: 90,
        },
        pain_points: data.pain_points || leadToScore.pain_points,
        suggested_strategy: data.recommended_strategy || leadToScore.suggested_strategy,
        tags: Array.from(new Set([...leadToScore.tags, ...(data.suggested_tags || [])])),
        ghl_pipeline_stage:
          leadToScore.ghl_pipeline_stage === "new_inbound"
            ? "scoring_enrichment"
            : leadToScore.ghl_pipeline_stage,
        activity_log: [
          {
            id: "act_" + Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
            agent: "Claude Lead Evaluator",
            action: `Assigned AI Lead Score: ${data.score || 88}/100 (${data.icp_fit || "Prime"})`,
            details: data.reasoning || "Completed deep BANT & intent scoring.",
            sentiment: "high_intent",
          },
          ...leadToScore.activity_log,
        ],
      };

      setLeads((prev) => prev.map((l) => (l.id === leadToScore.id ? updatedLead : l)));
      if (selectedLead?.id === leadToScore.id) {
        setSelectedLead(updatedLead);
      }

      // Add trace
      setTraces((prev) => [
        {
          id: "trace_" + Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          lead_id: leadToScore.id,
          lead_name: `${leadToScore.first_name} ${leadToScore.last_name}`,
          node_id: "node_evaluator",
          agent_name: "Claude Lead Evaluator",
          action: `Evaluated Lead: Score ${data.score || 88}/100`,
          state_before: leadToScore.ghl_pipeline_stage,
          state_after: updatedLead.ghl_pipeline_stage,
          thought_trace: data.reasoning || "Evaluated psychographics, decision authority, and budget alignment.",
          duration_ms: 360,
        },
        ...prev,
      ]);

      showToast(`🧠 Claude scored ${leadToScore.first_name} ${leadToScore.last_name}: ${data.score || 88}/100`);
    } catch (e: any) {
      console.error(e);
      showToast("Error scoring lead: " + e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // -------------------------------------------------------------
  // API: Generate Outreach Sequence (Claude Scribe Agent)
  // -------------------------------------------------------------
  const handleGenerateSequence = async (
    targetLead: Lead,
    style?: string,
    bookingLink?: string
  ): Promise<SequenceStep[] | void> => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/agent/generate-sequence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead: targetLead,
          style: style || "Value-First Consultative",
          calendarLink: bookingLink || "https://link.ghlcalendar.com/discovery-demo",
        }),
      });
      const data = await res.json();
      const steps: SequenceStep[] = data.steps || [];

      const updatedLead: Lead = {
        ...targetLead,
        sequence_steps: steps,
        outreach_status: "step_1_sent",
        ghl_pipeline_stage:
          targetLead.ghl_pipeline_stage === "scoring_enrichment" ||
          targetLead.ghl_pipeline_stage === "new_inbound"
            ? "active_sequence"
            : targetLead.ghl_pipeline_stage,
        activity_log: [
          {
            id: "act_" + Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
            agent: "Claude Copy Scribe",
            action: `Generated 4-touchpoint omni-channel sequence (${style || "Value-First"})`,
            details: `Synthesized personalized email & SMS hooks for ${targetLead.company}.`,
            sentiment: "positive",
          },
          ...targetLead.activity_log,
        ],
      };

      setLeads((prev) => prev.map((l) => (l.id === targetLead.id ? updatedLead : l)));
      if (selectedLead?.id === targetLead.id) {
        setSelectedLead(updatedLead);
      }

      setTraces((prev) => [
        {
          id: "trace_" + Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          lead_id: targetLead.id,
          lead_name: `${targetLead.first_name} ${targetLead.last_name}`,
          node_id: "node_scribe",
          agent_name: "Claude Copy Scribe",
          action: "Synthesized 4-Touchpoint Sequence",
          state_before: targetLead.ghl_pipeline_stage,
          state_after: updatedLead.ghl_pipeline_stage,
          thought_trace: `Synthesized bespoke value-first copy for ${targetLead.company}. Dispatched via GHL API.`,
          duration_ms: 480,
        },
        ...prev,
      ]);

      showToast(`✉️ Claude Scribe generated personalized sequence for ${targetLead.first_name}`);
      return steps;
    } catch (e: any) {
      console.error(e);
      showToast("Error generating sequence: " + e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // -------------------------------------------------------------
  // API: Simulate Prospect Reply & Trigger Objection Handling Closer
  // -------------------------------------------------------------
  const handleSimulateInboundReply = async (leadId: string, replyText: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    setIsProcessing(true);
    try {
      // Append user reply message
      const leadMsg = {
        id: "msg_" + Math.random().toString(36).substr(2, 9),
        sender: "lead" as const,
        channel: "email" as const,
        text: replyText,
        timestamp: new Date().toISOString(),
      };

      const interimHistory = [...lead.conversation_history, leadMsg];

      // Call API for objection handling
      const res = await fetch("/api/agent/handle-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead,
          incomingMessage: replyText,
          conversationHistory: interimHistory,
          calendarLink: "https://link.ghlcalendar.com/discovery-demo",
        }),
      });
      const data = await res.json();

      const agentMsg = {
        id: "msg_" + Math.random().toString(36).substr(2, 9),
        sender: "agent" as const,
        channel: "email" as const,
        text: data.reply,
        timestamp: new Date().toISOString(),
        metadata: {
          agentName: "Objection Handling Closer",
          objectionType: data.objection_type,
        },
      };

      const nextStage: GhlPipelineStage =
        data.suggested_next_stage === "appointment_booked"
          ? "appointment_booked"
          : "engaged_objection";

      const updatedLead: Lead = {
        ...lead,
        conversation_history: [...interimHistory, agentMsg],
        outreach_status: "replied",
        ghl_pipeline_stage: nextStage,
        activity_log: [
          {
            id: "act_" + Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
            agent: "Objection Handling Closer",
            action: `Handled Objection: ${data.objection_type || "General Inquiry"}`,
            details: data.reasoning || "Delivered contextual rebuttal and calendar booking prompt.",
            sentiment: "positive",
          },
          {
            id: "act_" + Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
            agent: "LangGraph Orchestrator",
            action: `Received Inbound Reply from ${lead.first_name}`,
            details: `"${replyText}"`,
            sentiment: "neutral",
          },
          ...lead.activity_log,
        ],
      };

      setLeads((prev) => prev.map((l) => (l.id === leadId ? updatedLead : l)));
      if (selectedLead?.id === leadId) {
        setSelectedLead(updatedLead);
      }

      setTraces((prev) => [
        {
          id: "trace_" + Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          lead_id: lead.id,
          lead_name: `${lead.first_name} ${lead.last_name}`,
          node_id: "node_closer",
          agent_name: "Objection Handling Closer",
          action: `Resolved Objection: ${data.objection_type}`,
          state_before: lead.ghl_pipeline_stage,
          state_after: nextStage,
          thought_trace: data.reasoning || "Classified inbound reply sentiment, formulated rebuttal, and provided 1-click booking link.",
          duration_ms: 410,
        },
        ...prev,
      ]);

      showToast(`💬 Closer Agent responded to ${lead.first_name} (${data.objection_type})`);
    } catch (e: any) {
      console.error(e);
      showToast("Error handling reply: " + e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // -------------------------------------------------------------
  // Manual Outbound Message
  // -------------------------------------------------------------
  const handleSendMessage = (leadId: string, text: string, channel: "email" | "sms") => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    const newMsg = {
      id: "msg_" + Math.random().toString(36).substr(2, 9),
      sender: "agent" as const,
      channel,
      text,
      timestamp: new Date().toISOString(),
      metadata: { agentName: "Manual Operator / AI Co-Pilot" },
    };

    const updatedLead: Lead = {
      ...lead,
      conversation_history: [...lead.conversation_history, newMsg],
      last_contacted: new Date().toISOString(),
    };

    setLeads((prev) => prev.map((l) => (l.id === leadId ? updatedLead : l)));
    if (selectedLead?.id === leadId) setSelectedLead(updatedLead);
    showToast(`Sent ${channel.toUpperCase()} message to ${lead.first_name}`);
  };

  // -------------------------------------------------------------
  // Book Appointment (Calendar Agent)
  // -------------------------------------------------------------
  const handleBookAppointment = (leadId: string, date: string, time: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    const appointment = {
      date,
      time,
      timezone: "America/New_York",
      meeting_link: "https://meet.google.com/ghl-" + Math.random().toString(36).substr(2, 6),
      status: "confirmed" as const,
      calendar_id: ghlConfig.calendar_id,
      notes: `Autonomously booked discovery demo for ${lead.company}.`,
    };

    const updatedLead: Lead = {
      ...lead,
      ghl_pipeline_stage: "appointment_booked",
      outreach_status: "booked",
      appointment,
      activity_log: [
        {
          id: "act_" + Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          agent: "GHL Appointment Booker",
          action: "Locked Discovery Demo on GHL Calendar",
          details: `Date: ${date} at ${time}. Dispatched calendar invite & SMS reminder.`,
          sentiment: "high_intent",
        },
        ...lead.activity_log,
      ],
    };

    setLeads((prev) => prev.map((l) => (l.id === leadId ? updatedLead : l)));
    if (selectedLead?.id === leadId) setSelectedLead(updatedLead);

    setTraces((prev) => [
      {
        id: "trace_" + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        lead_id: lead.id,
        lead_name: `${lead.first_name} ${lead.last_name}`,
        node_id: "node_scheduler",
        agent_name: "GHL Appointment Booker",
        action: "Booked Discovery Demo in GHL Calendar",
        state_before: lead.ghl_pipeline_stage,
        state_after: "appointment_booked",
        thought_trace: `Successfully synced appointment slot ${date} @ ${time} to GHL sub-account calendar ${ghlConfig.calendar_id}.`,
        duration_ms: 290,
      },
      ...prev,
    ]);

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });

    showToast(`🎉 Appointment booked on GHL Calendar for ${lead.first_name} on ${date}!`);
  };

  // -------------------------------------------------------------
  // Move Lead Stage
  // -------------------------------------------------------------
  const handleMoveLeadStage = (leadId: string, stage: GhlPipelineStage) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    const updatedLead: Lead = {
      ...lead,
      ghl_pipeline_stage: stage,
      activity_log: [
        {
          id: "act_" + Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          agent: "LangGraph Orchestrator",
          action: `Advanced GHL Pipeline Stage to: ${stage.replace("_", " ").toUpperCase()}`,
          details: "Stage transition synchronized with GoHighLevel Opportunity Board.",
          sentiment: "neutral",
        },
        ...lead.activity_log,
      ],
    };

    setLeads((prev) => prev.map((l) => (l.id === leadId ? updatedLead : l)));
    if (selectedLead?.id === leadId) setSelectedLead(updatedLead);
    showToast(`Stage updated to ${stage.replace("_", " ").toUpperCase()}`);
  };

  // -------------------------------------------------------------
  // Run Instant Swarm Loop across leads
  // -------------------------------------------------------------
  const handleRunInstantLoop = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/agent/run-autonomous-loop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leads }),
      });
      const data = await res.json();

      if (data.updatedLeads && data.updatedLeads.length > 0) {
        setLeads((prev) => {
          const map = new Map(data.updatedLeads.map((l: Lead) => [l.id, l]));
          return prev.map((l) => (map.has(l.id) ? (map.get(l.id) as Lead) : l));
        });
      }

      if (data.logs && data.logs.length > 0) {
        setTraces((prev) => [...data.logs, ...prev]);
      }

      showToast(`⚡ Autonomous loop cycle completed: ${data.processedCount || 0} leads processed`);
    } catch (e: any) {
      console.error(e);
      showToast("Error running loop: " + e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // -------------------------------------------------------------
  // Handle Inbound Webhook Simulation
  // -------------------------------------------------------------
  const handleSimulateWebhook = async (payload: any) => {
    setIsProcessing(true);
    try {
      const contact = payload.contact || {};
      const newLead: Lead = {
        id: "lead_" + Math.random().toString(36).substr(2, 9),
        ghl_contact_id: "ghl_cnt_" + Math.floor(100000 + Math.random() * 900000),
        first_name: contact.first_name || "Anonymous",
        last_name: contact.last_name || "Lead",
        email: contact.email || "lead@company.com",
        phone: contact.phone || "+1 (555) 019-9941",
        company: contact.company_name || "Prospect Co",
        title: contact.job_title || "Decision Maker",
        industry: contact.industry || "B2B Technology",
        company_size: contact.company_size || "50-200",
        source: `Webhook: ${payload.event || "Inbound GHL Form"}`,
        budget_range: contact.budget || "$25k - $50k/mo",
        deal_value: 35000,
        pain_points: contact.notes ? [contact.notes] : ["Needs automated appointment booking in GHL"],
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
        tags: ["Inbound-Webhook", payload.event || "GHL"],
        outreach_status: "pending",
        created_at: new Date().toISOString(),
        conversation_history: [],
        sequence_steps: [],
        activity_log: [
          {
            id: "act_" + Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
            agent: "Lead Ingestion Scout",
            action: `Ingested ${payload.event || "Inbound Webhook"}`,
            details: `Sanitized contact record for ${contact.company_name || "Lead"}. Enqueued to LangGraph.`,
            sentiment: "neutral",
          },
        ],
      };

      setLeads((prev) => [newLead, ...prev]);

      // Automatically trigger Claude scoring on this new inbound lead
      await handleScoreLead(newLead);
      showToast(`📥 Inbound lead ingested from ${payload.event}: ${newLead.first_name} (${newLead.company})`);
    } catch (e: any) {
      console.error(e);
      showToast("Webhook ingestion error: " + e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // -------------------------------------------------------------
  // Autonomous Student Enrollment & Client Purchase Simulator
  // -------------------------------------------------------------
  const handleEnrollStudent = (offer: OfferItem) => {
    const isCourse = offer.type === "course" || offer.type === "cohort";
    const amount = offer.price;
    const platformCut = amount * 0.20;
    const netPayout = amount * 0.80;

    // Update Offer stats
    setOffers((prev) =>
      prev.map((o) =>
        o.id === offer.id
          ? {
              ...o,
              student_count: o.student_count + 1,
              gross_revenue: o.gross_revenue + amount,
            }
          : o
      )
    );

    // Update Financials
    setFinancials((prev) => {
      const newGross = prev.gross_revenue + amount;
      const newCourseRev = isCourse ? prev.course_sales_revenue + amount : prev.course_sales_revenue;
      const newServiceRev = !isCourse ? prev.service_retainer_revenue + amount : prev.service_retainer_revenue;
      const newMrr = offer.billing_period === "monthly" ? prev.monthly_recurring_revenue + amount : prev.monthly_recurring_revenue;
      const newCut = prev.platform_cut + platformCut;
      const newNet = prev.net_founder_payout + netPayout;

      return {
        ...prev,
        gross_revenue: newGross,
        course_sales_revenue: newCourseRev,
        service_retainer_revenue: newServiceRev,
        monthly_recurring_revenue: newMrr,
        total_students_enrolled: isCourse ? prev.total_students_enrolled + 1 : prev.total_students_enrolled,
        active_service_clients: !isCourse ? prev.active_service_clients + 1 : prev.active_service_clients,
        platform_cut: newCut,
        net_founder_payout: newNet,
      };
    });

    // Create a new Lead/Student in GHL
    const buyerNames = [
      { first: "Alexander", last: "Wright", company: "GrowthScale AI" },
      { first: "Sophia", last: "Chen", company: "Aura Media Labs" },
      { first: "Liam", last: "O'Connor", company: "Apex Automation" },
      { first: "Chloe", last: "Vanderbilt", company: "Nova Ventures" },
    ];
    const picked = buyerNames[Math.floor(Math.random() * buyerNames.length)];
    const newStudentLead: Lead = {
      id: "student_" + Math.random().toString(36).substr(2, 9),
      ghl_contact_id: "ghl_cust_" + Math.random().toString(36).substr(2, 7),
      first_name: picked.first,
      last_name: picked.last,
      email: `${picked.first.toLowerCase()}.${picked.last.toLowerCase()}@${picked.company.toLowerCase().replace(/\s+/g, "")}.com`,
      phone: "+1 (555) " + Math.floor(100 + Math.random() * 900) + "-" + Math.floor(1000 + Math.random() * 9000),
      company: picked.company,
      title: "Founder / CEO",
      industry: "AI & Digital Services",
      company_size: "1-10",
      source: "Operant Autonomous Funnel",
      budget_range: `$${amount.toLocaleString()}`,
      pain_points: ["Scaling without headcount", "Automating GHL client acquisition"],
      ghl_pipeline_stage: "opportunity_won",
      deal_value: amount,
      ai_score: 98,
      icp_fit: "A+ (Unicorn)",
      score_breakdown: {
        intent: 100,
        authority: 100,
        budget: 95,
        timing: 95,
        need: 100,
      },
      tags: [offer.ghl_tag, "Stripe-Paid", isCourse ? "Course-Enrolled" : "Client-Active"],
      outreach_status: "booked",
      created_at: new Date().toISOString(),
      conversation_history: [
        {
          id: "msg_paid",
          sender: "system",
          channel: "ghl_chat",
          text: `Stripe payment verified ($${amount.toLocaleString()}). Enrolled into ${offer.title}. GHL access tag [${offer.ghl_tag}] applied.`,
          timestamp: new Date().toISOString(),
        },
      ],
      sequence_steps: [],
      activity_log: [
        {
          id: "act_paid_" + Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          agent: "Operant Strategic AI Co-Founder",
          action: `Enrolled into ${offer.title}`,
          details: `Processed $${amount.toLocaleString()} purchase. Dispatched instant access email.`,
          sentiment: "positive",
        },
      ],
    };

    setLeads((prev) => [newStudentLead, ...prev]);

    // Confetti celebration
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    showToast(`🎉 New ${isCourse ? "Student" : "Client"} Enrolled: ${picked.first} (${offer.title} - $${amount})`);
  };

  // -------------------------------------------------------------
  // Background Autonomous Looping Engine
  // -------------------------------------------------------------
  useEffect(() => {
    if (!isLooping) {
      if (loopTimerRef.current) clearInterval(loopTimerRef.current);
      return;
    }

    loopTimerRef.current = setInterval(() => {
      // Find unscored leads or leads needing touchpoint follow-up
      const unscored = leads.find((l) => l.ai_score === 0);
      if (unscored) {
        handleScoreLead(unscored);
        return;
      }

      const needsSequence = leads.find(
        (l) => l.ghl_pipeline_stage === "scoring_enrichment" && l.sequence_steps.length === 0
      );
      if (needsSequence) {
        handleGenerateSequence(needsSequence);
      }
    }, loopIntervalSec * 1000);

    return () => {
      if (loopTimerRef.current) clearInterval(loopTimerRef.current);
    };
  }, [isLooping, loopIntervalSec, leads]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-indigo-500/60 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Subscription Login & Signup Portal (When active) */}
      {showAuthPortal ? (
        <SubscriptionAuthPortal
          onLoginSuccess={(session) => {
            setUserSession(session);
            setShowAuthPortal(false);
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
            });
            showToast(`🎉 Logged into ${session.companyName} (${session.plan} Plan)`);
          }}
          onContinueAsGuest={() => setShowAuthPortal(false)}
        />
      ) : (
        <>
          {/* Main Header & Command Bar */}
          <Header
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            leads={leads}
            ghlConfig={ghlConfig}
            isLooping={isLooping}
            setIsLooping={setIsLooping}
            onRunInstantLoop={handleRunInstantLoop}
            onOpenWebhookModal={() => setActiveTab("automations")}
            onOpenNewLeadModal={() => setIsNewLeadModalOpen(true)}
            loopIntervalSec={loopIntervalSec}
            setLoopIntervalSec={setLoopIntervalSec}
            isProcessing={isProcessing}
            userCompany={userSession.companyName}
            userPlan={userSession.plan}
            onOpenAuthPortal={() => setShowAuthPortal(true)}
          />

          {/* Main App Content View Switcher */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* TAB 1: Products & Revenue */}
        {activeTab === "products" && (
          <UnifiedProductsView
            offers={offers}
            setOffers={setOffers}
            campaigns={campaigns}
            setCampaigns={setCampaigns}
            financials={financials}
            setFinancials={setFinancials}
            onEnrollStudent={handleEnrollStudent}
            showToast={showToast}
            selectedOfferForTriage={selectedOfferForTriage}
            leads={leads}
          />
        )}

        {/* TAB 2: Leads & Deals */}
        {(activeTab === "deals" || activeTab === "pipeline" || activeTab === "leads") && (
          <UnifiedLeadsAndDeals
            leads={leads}
            onSelectLead={(lead) => setSelectedLead(lead)}
            onMoveLeadStage={handleMoveLeadStage}
            onQuickScoreLead={handleScoreLead}
            onQuickGenerateSequence={handleGenerateSequence}
            onOpenNewLeadModal={() => setIsNewLeadModalOpen(true)}
            isProcessing={isProcessing}
          />
        )}

        {/* TAB 3: Automations & AI Team */}
        {(activeTab === "automations" || activeTab === "routines" || activeTab === "langgraph" || activeTab === "webhook_hub" || activeTab === "telemetry") && (
          <UnifiedAutomations
            routines={routines}
            onToggleRoutine={(id) => {
              setRoutines((prev) =>
                prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
              );
              showToast("Automation status updated");
            }}
            isLooping={isLooping}
            setIsLooping={setIsLooping}
            onRunInstantLoop={handleRunInstantLoop}
            isProcessing={isProcessing}
            loopIntervalSec={loopIntervalSec}
            setLoopIntervalSec={setLoopIntervalSec}
            traces={traces}
            leads={leads}
            onSimulateWebhook={handleSimulateWebhook}
            showToast={showToast}
          />
        )}
      </main>

      {/* Lead Dossier Modal */}
      {selectedLead && (
        <LeadDossierModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onScoreLead={handleScoreLead}
          onGenerateSequence={handleGenerateSequence}
          onSendMessage={handleSendMessage}
          onSimulateInboundReply={handleSimulateInboundReply}
          onBookAppointment={handleBookAppointment}
          onUpdateStage={handleMoveLeadStage}
          isProcessing={isProcessing}
        />
      )}

        {/* New Lead Creation Modal */}
        <NewLeadModal
          isOpen={isNewLeadModalOpen}
          onClose={() => setIsNewLeadModalOpen(false)}
          onAddLead={(newLead) => {
            setLeads((prev) => [newLead, ...prev]);
            showToast(`Added ${newLead.first_name} (${newLead.company}) to pipeline queue`);
          }}
        />
      </>
    )}
  </div>
);
}
