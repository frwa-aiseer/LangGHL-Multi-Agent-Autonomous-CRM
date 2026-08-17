import React, { useState } from "react";
import {
  BookOpen,
  Briefcase,
  Sparkles,
  DollarSign,
  Users,
  CheckCircle2,
  TrendingUp,
  ExternalLink,
  Plus,
  Zap,
  Copy,
  ChevronRight,
  Share2,
  ShieldCheck,
  Send,
  Layers,
  ArrowUpRight,
  Video,
  Code2,
  FolderPlus,
  PlayCircle,
} from "lucide-react";
import { MarketingCampaign, OfferItem, PolsiaFinancials } from "../types";

interface PolsiaOffersHubProps {
  offers: OfferItem[];
  setOffers: React.Dispatch<React.SetStateAction<OfferItem[]>>;
  campaigns: MarketingCampaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<MarketingCampaign[]>>;
  financials: PolsiaFinancials;
  setFinancials: React.Dispatch<React.SetStateAction<PolsiaFinancials>>;
  onEnrollStudent: (offer: OfferItem) => void;
  showToast: (msg: string) => void;
  onOpenConsultation: (offer?: OfferItem) => void;
}

export const PolsiaOffersHub: React.FC<PolsiaOffersHubProps> = ({
  offers,
  setOffers,
  campaigns,
  setCampaigns,
  financials,
  setFinancials,
  onEnrollStudent,
  showToast,
  onOpenConsultation,
}) => {
  const [filterType, setFilterType] = useState<"all" | "course" | "service">("all");
  const [selectedOfferForDetail, setSelectedOfferForDetail] = useState<OfferItem | null>(null);
  const [isGeneratingOffer, setIsGeneratingOffer] = useState(false);
  const [isGeneratingCampaign, setIsGeneratingCampaign] = useState(false);

  // New Offer Form State
  const [showNewOfferModal, setShowNewOfferModal] = useState(false);
  const [newOfferTopic, setNewOfferTopic] = useState("");
  const [newOfferType, setNewOfferType] = useState<"course" | "cohort" | "dfy_buildout" | "service_retainer" | "consulting">("course");
  const [newOfferAudience, setNewOfferAudience] = useState("");
  const [newOfferPrice, setNewOfferPrice] = useState("497");

  // New Campaign Form State
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [selectedOfferForCampaign, setSelectedOfferForCampaign] = useState(offers[0]?.id || "");
  const [campaignChannel, setCampaignChannel] = useState<"linkedin" | "twitter" | "email_newsletter" | "vsl_script" | "meta_ad">("linkedin");
  const [campaignAngle, setCampaignAngle] = useState("");

  const filteredOffers = offers.filter((o) => {
    if (filterType === "course") return o.type === "course" || o.type === "cohort";
    if (filterType === "service") return o.type === "dfy_buildout" || o.type === "service_retainer" || o.type === "consulting";
    return true;
  });

  const handleGenerateAiOffer = async () => {
    if (!newOfferTopic.trim()) {
      showToast("Please enter a topic or outcome for the new offer.");
      return;
    }
    setIsGeneratingOffer(true);
    try {
      const res = await fetch("/api/polsia/generate-offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: newOfferTopic,
          offerType: newOfferType,
          targetAudience: newOfferAudience || "Founders, Developers & Agency Operators",
          pricePoint: newOfferPrice,
        }),
      });
      const generated = await res.json();
      const newOffer: OfferItem = {
        id: "offer_" + Math.random().toString(36).substr(2, 9),
        title: generated.title || `Mastery Program: ${newOfferTopic}`,
        slug: generated.slug || newOfferTopic.toLowerCase().replace(/\s+/g, "-"),
        type: generated.type || newOfferType,
        price: Number(generated.price) || Number(newOfferPrice) || 497,
        billing_period: generated.billing_period || (newOfferType === "course" ? "one-time" : "monthly"),
        badge: generated.badge || "AI Co-Founder Synthesized",
        short_description: generated.short_description || "High-converting offer created by Polsia AI.",
        full_description: generated.full_description || "End-to-end curriculum and deliverables architecture.",
        target_icp: generated.target_icp || "High-growth operators",
        deliverables: generated.deliverables || [
          { title: "Complete Code Repository", description: "Production-ready templates", type: "code_repository" },
          { title: "1-Click GHL Snapshot", description: "Automated pipeline imports", type: "template" },
        ],
        syllabus: generated.syllabus,
        student_count: 0,
        gross_revenue: 0,
        stripe_checkout_url: generated.stripe_checkout_url || `https://buy.stripe.com/polsia_${newOfferType}_${newOfferPrice}`,
        ghl_tag: generated.ghl_tag || `Offer-${newOfferTopic.slice(0, 8)}-Active`,
        status: "live",
        ai_agent_owner: "Polsia Strategic AI Co-Founder",
        conversion_rate: generated.conversion_rate || 14.2,
      };

      setOffers((prev) => [newOffer, ...prev]);
      setShowNewOfferModal(false);
      setNewOfferTopic("");
      showToast(`✨ Polsia AI Co-Founder published "${newOffer.title}" ($${newOffer.price})`);
    } catch (e: any) {
      console.error(e);
      showToast("Error generating offer: " + e.message);
    } finally {
      setIsGeneratingOffer(false);
    }
  };

  const handleGenerateAiCampaign = async () => {
    const targetOffer = offers.find((o) => o.id === selectedOfferForCampaign) || offers[0];
    setIsGeneratingCampaign(true);
    try {
      const res = await fetch("/api/polsia/generate-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offerTitle: targetOffer?.title,
          offerType: targetOffer?.type,
          channel: campaignChannel,
          targetAngle: campaignAngle || "Autonomous 24/7 client generation",
        }),
      });
      const data = await res.json();
      const newCamp: MarketingCampaign = {
        id: "camp_" + Math.random().toString(36).substr(2, 9),
        title: data.title || `Campaign for ${targetOffer?.title}`,
        offer_id: targetOffer?.id || "offer_1",
        offer_title: targetOffer?.title || "Offer",
        channel: data.channel || campaignChannel,
        hook: data.hook || "Autonomous marketing breakthrough",
        content: data.content || "Full campaign breakdown",
        cta_url: data.cta_url || targetOffer?.stripe_checkout_url || "https://link.ghlcalendar.com/discovery-demo",
        status: "published",
        generated_at: new Date().toISOString(),
        engagement: {
          impressions: Math.floor(Math.random() * 5000) + 1200,
          clicks: Math.floor(Math.random() * 300) + 80,
          conversions: Math.floor(Math.random() * 6) + 1,
        },
      };

      setCampaigns((prev) => [newCamp, ...prev]);
      setShowCampaignModal(false);
      setCampaignAngle("");
      showToast(`📢 Polsia AI generated viral ${campaignChannel.toUpperCase()} campaign!`);
    } catch (e: any) {
      console.error(e);
      showToast("Error generating campaign: " + e.message);
    } finally {
      setIsGeneratingCampaign(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`📋 Copied ${label} to clipboard!`);
  };

  return (
    <div className="space-y-6">
      {/* Polsia Autonomous Company Executive Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Polsia Autonomous Business Engine
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                24/7 AI Co-Founder Active
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Course & High-Ticket Service Selling Swarm
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl">
              Autonomously plans, architects, markets, and sells digital courses, builder cohorts, and done-for-you agency services with automated GoHighLevel CRM pipelines and Stripe checkout synchronization.
            </p>
          </div>

          {/* Quick Action Hub */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="polsia-new-offer-btn"
              onClick={() => setShowNewOfferModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>Architect New Offer (AI)</span>
            </button>
            <button
              id="polsia-new-campaign-btn"
              onClick={() => setShowCampaignModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-bold rounded-xl transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Launch AI Marketing Campaign</span>
            </button>
          </div>
        </div>

        {/* Polsia Economics & Revenue Barometer */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-indigo-500/20 text-slate-300">
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Gross Revenue</span>
            <span className="text-base sm:text-lg font-bold text-emerald-400">${financials.gross_revenue.toLocaleString()}</span>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Course Sales</span>
            <span className="text-base sm:text-lg font-bold text-indigo-300">${financials.course_sales_revenue.toLocaleString()}</span>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Service Retainers</span>
            <span className="text-base sm:text-lg font-bold text-purple-300">${financials.service_retainer_revenue.toLocaleString()}</span>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Monthly MRR</span>
            <span className="text-base sm:text-lg font-bold text-amber-300">${financials.monthly_recurring_revenue.toLocaleString()}</span>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Students & Clients</span>
            <span className="text-base sm:text-lg font-bold text-white">{financials.total_students_enrolled + financials.active_service_clients} active</span>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Net Founder Payout</span>
            <span className="text-base sm:text-lg font-bold text-cyan-300">${financials.net_founder_payout.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          </div>
        </div>
      </div>

      {/* Navigation Filter & Live Search Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-3">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === "all"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            All Offers ({offers.length})
          </button>
          <button
            onClick={() => setFilterType("course")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              filterType === "course"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Courses & Cohorts ({offers.filter((o) => o.type === "course" || o.type === "cohort").length})
          </button>
          <button
            onClick={() => setFilterType("service")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              filterType === "service"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            High-Ticket Services & DFY ({offers.filter((o) => o.type === "dfy_buildout" || o.type === "service_retainer" || o.type === "consulting").length})
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Stripe Webhooks & GHL Snapshots Live</span>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOffers.map((offer) => {
          const isCourse = offer.type === "course" || offer.type === "cohort";
          return (
            <div
              key={offer.id}
              id={`offer-card-${offer.id}`}
              className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 flex flex-col justify-between shadow-lg hover:shadow-indigo-500/10 transition-all group"
            >
              <div className="space-y-4">
                {/* Header Badge & Price */}
                <div className="flex items-start justify-between gap-3">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                    isCourse
                      ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/30"
                      : "bg-purple-500/10 text-purple-300 border-purple-500/30"
                  }`}>
                    {offer.badge}
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-white">${offer.price.toLocaleString()}</span>
                    {offer.billing_period && offer.billing_period !== "one-time" && (
                      <span className="text-xs text-slate-400 block font-medium">/{offer.billing_period === "monthly" ? "mo" : "cohort"}</span>
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {offer.short_description}
                  </p>
                </div>

                {/* Target ICP */}
                <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-2.5 text-xs">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Target ICP</span>
                  <span className="text-slate-300 line-clamp-1">{offer.target_icp}</span>
                </div>

                {/* Deliverables List Preview */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] text-slate-400 font-semibold block uppercase">Core Deliverables</span>
                  {offer.deliverables.slice(0, 3).map((d, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{d.title}</span>
                    </div>
                  ))}
                  {offer.syllabus && (
                    <div className="flex items-center gap-2 text-xs text-indigo-300 font-medium">
                      <PlayCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{offer.syllabus.length} Structured Modules ({offer.syllabus.reduce((acc, m) => acc + m.lessons.length, 0)} Lessons)</span>
                    </div>
                  )}
                </div>

                {/* Metrics Pill */}
                <div className="flex items-center justify-between text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{offer.student_count} {isCourse ? "students" : "clients"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">{offer.conversion_rate}% Conv.</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-amber-300">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>${offer.gross_revenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedOfferForDetail(offer)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Syllabus & Scope</span>
                  </button>
                  <button
                    onClick={() => onEnrollStudent(offer)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/30 transition-all"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{isCourse ? "Simulate Sale" : "Book Client"}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(offer.stripe_checkout_url, "Checkout Link")}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] font-medium text-slate-400 hover:text-slate-200 bg-slate-950 hover:bg-slate-800/60 border border-slate-800 rounded-lg transition-all"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Stripe Link</span>
                  </button>
                  <button
                    onClick={() => onOpenConsultation(offer)}
                    className="flex items-center justify-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-lg transition-all"
                    title="Open AI Triage Desk for this offer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>AI Triage</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Marketing Campaigns Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>📢 Polsia Autonomous Marketing Campaigns</span>
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                Multi-Channel Traffic Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              AI agents create high-converting social posts, viral hooks, and video scripts driving automated traffic into course checkouts and service discovery calls.
            </p>
          </div>

          <button
            onClick={() => setShowCampaignModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New AI Campaign</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                    {camp.channel.replace("_", " ")}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-medium">
                    {camp.engagement.conversions} sales
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white">{camp.title}</h4>
                <p className="text-[11px] text-slate-300 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 font-mono line-clamp-3">
                  {camp.hook}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                <span>{camp.engagement.impressions.toLocaleString()} views</span>
                <span>{camp.engagement.clicks} clicks</span>
                <button
                  onClick={() => copyToClipboard(camp.content, "Campaign Copy")}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Offer Detail Drawer / Modal */}
      {selectedOfferForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{selectedOfferForDetail.badge}</span>
                <h3 className="text-xl font-bold text-white mt-1">{selectedOfferForDetail.title}</h3>
                <p className="text-xs text-slate-400 mt-1">${selectedOfferForDetail.price.toLocaleString()} • Managed by {selectedOfferForDetail.ai_agent_owner}</p>
              </div>
              <button
                onClick={() => setSelectedOfferForDetail(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider">Overview</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{selectedOfferForDetail.full_description}</p>
              </div>

              {selectedOfferForDetail.syllabus && selectedOfferForDetail.syllabus.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-indigo-300 tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Curriculum Syllabus ({selectedOfferForDetail.syllabus.length} Modules)</span>
                  </h4>
                  <div className="space-y-2">
                    {selectedOfferForDetail.syllabus.map((mod) => (
                      <div key={mod.module_num} className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs">
                        <span className="text-[11px] font-bold text-amber-300 block">Module {mod.module_num}: {mod.title}</span>
                        <ul className="mt-1.5 space-y-1 text-slate-300 pl-2">
                          {mod.lessons.map((lesson, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                              <span>{lesson}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-emerald-400 tracking-wider">Included Assets & SLA</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedOfferForDetail.deliverables.map((deliv, i) => (
                    <div key={i} className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs space-y-1">
                      <span className="font-bold text-white block">{deliv.title}</span>
                      <span className="text-slate-400 block text-[11px]">{deliv.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">GoHighLevel CRM Tag</span>
                  <span className="font-mono text-emerald-400 font-bold">{selectedOfferForDetail.ghl_tag}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(selectedOfferForDetail.stripe_checkout_url, "Checkout Link")}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Stripe URL</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setSelectedOfferForDetail(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onEnrollStudent(selectedOfferForDetail);
                  setSelectedOfferForDetail(null);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg"
              >
                Simulate Direct Enrollment ($ {selectedOfferForDetail.price})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New AI Offer Synthesis Modal */}
      {showNewOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Synthesize New Course or Service Offer</h3>
                  <p className="text-xs text-slate-400">Polsia AI Co-Founder will architect syllabus, pricing & deliverables</p>
                </div>
              </div>
              <button onClick={() => setShowNewOfferModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Offer Type</label>
                <select
                  value={newOfferType}
                  onChange={(e: any) => setNewOfferType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="course">Digital Course (Video Modules & Templates) - $497</option>
                  <option value="cohort">Live Cohort Bootcamp (6 Weeks Mastermind) - $1,497</option>
                  <option value="dfy_buildout">Done-For-You GHL + AI Buildout (Turnkey Service) - $4,997</option>
                  <option value="service_retainer">Enterprise AI Co-Founder Retainer - $12,500/mo</option>
                  <option value="consulting">1-on-1 Systems & Revenue Advisory - $2,500/mo</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Topic or Business Outcome</label>
                <input
                  type="text"
                  placeholder="e.g. AI-Powered Cold Email Agency Engine, Real Estate Lead Automation"
                  value={newOfferTopic}
                  onChange={(e) => setNewOfferTopic(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Audience / ICP</label>
                  <input
                    type="text"
                    placeholder="e.g. Agency Founders, Med-Spas"
                    value={newOfferAudience}
                    onChange={(e) => setNewOfferAudience(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Price Point ($ USD)</label>
                  <input
                    type="number"
                    value={newOfferPrice}
                    onChange={(e) => setNewOfferPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowNewOfferModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateAiOffer}
                disabled={isGeneratingOffer}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isGeneratingOffer ? "animate-spin" : ""}`} />
                <span>{isGeneratingOffer ? "Synthesizing with AI..." : "Publish Offer"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New AI Marketing Campaign Modal */}
      {showCampaignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Generate AI Marketing Campaign</h3>
                  <p className="text-xs text-slate-400">Polsia Growth Director crafts viral multi-channel traffic assets</p>
                </div>
              </div>
              <button onClick={() => setShowCampaignModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Offer to Promote</label>
                <select
                  value={selectedOfferForCampaign}
                  onChange={(e) => setSelectedOfferForCampaign(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  {offers.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.title} (${o.price.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Marketing Channel</label>
                <select
                  value={campaignChannel}
                  onChange={(e: any) => setCampaignChannel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="linkedin">LinkedIn Thought-Leadership Post</option>
                  <option value="twitter">Twitter / X Viral Value Thread</option>
                  <option value="email_newsletter">Email Newsletter Broadcast Hook</option>
                  <option value="vsl_script">VSL Video Sales Letter Script (8-min)</option>
                  <option value="meta_ad">Meta / Facebook Direct Response Ad Copy</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Core Marketing Angle / Hook</label>
                <input
                  type="text"
                  placeholder="e.g. Replacing 3 SDR salaries with autonomous LangGraph loops"
                  value={campaignAngle}
                  onChange={(e) => setCampaignAngle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowCampaignModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateAiCampaign}
                disabled={isGeneratingCampaign}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-lg disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isGeneratingCampaign ? "animate-spin" : ""}`} />
                <span>{isGeneratingCampaign ? "Crafting Campaign..." : "Generate Campaign"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
