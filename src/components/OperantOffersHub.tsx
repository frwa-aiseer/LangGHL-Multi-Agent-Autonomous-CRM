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
  BarChart3,
  Search,
  Filter,
} from "lucide-react";
import { MarketingCampaign, OfferItem, PlatformFinancials } from "../types";

interface OperantOffersHubProps {
  offers: OfferItem[];
  setOffers: React.Dispatch<React.SetStateAction<OfferItem[]>>;
  campaigns: MarketingCampaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<MarketingCampaign[]>>;
  financials: PlatformFinancials;
  setFinancials: React.Dispatch<React.SetStateAction<PlatformFinancials>>;
  onEnrollStudent: (offer: OfferItem) => void;
  showToast: (msg: string) => void;
  onOpenConsultation: (offer?: OfferItem) => void;
}

export const OperantOffersHub: React.FC<OperantOffersHubProps> = ({
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
  const [searchQuery, setSearchQuery] = useState("");
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
    const matchesFilter =
      filterType === "all" ||
      (filterType === "course" && (o.type === "course" || o.type === "cohort")) ||
      (filterType === "service" && (o.type === "dfy_buildout" || o.type === "service_retainer" || o.type === "consulting"));
    const matchesSearch =
      searchQuery === "" ||
      o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.short_description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleGenerateAiOffer = async () => {
    if (!newOfferTopic.trim()) {
      showToast("Please enter a topic or outcome for the new offer.");
      return;
    }
    setIsGeneratingOffer(true);
    try {
      const res = await fetch("/api/operant/generate-offer", {
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
        short_description: generated.short_description || "High-converting offer created by Operant AI.",
        full_description: generated.full_description || "End-to-end curriculum and deliverables architecture.",
        target_icp: generated.target_icp || "High-growth operators",
        deliverables: generated.deliverables || [
          { title: "Complete Code Repository", description: "Production-ready templates", type: "code_repository" },
          { title: "1-Click GHL Snapshot", description: "Automated pipeline imports", type: "template" },
        ],
        syllabus: generated.syllabus,
        student_count: 0,
        gross_revenue: 0,
        stripe_checkout_url: generated.stripe_checkout_url || `https://buy.stripe.com/operant_${newOfferType}_${newOfferPrice}`,
        ghl_tag: generated.ghl_tag || `Offer-${newOfferTopic.slice(0, 8)}-Active`,
        status: "live",
        ai_agent_owner: "Operant Strategic AI Co-Founder",
        conversion_rate: generated.conversion_rate || 14.2,
      };

      setOffers((prev) => [newOffer, ...prev]);
      setShowNewOfferModal(false);
      setNewOfferTopic("");
      showToast(`✨ Operant AI Co-Founder published "${newOffer.title}" ($${newOffer.price})`);
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
      const res = await fetch("/api/operant/generate-campaign", {
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
      showToast(`📢 Operant AI generated viral ${campaignChannel.toUpperCase()} campaign!`);
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
      {/* Minimalist Executive Revenue Barometer */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-lg relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Operant Monetization Engine
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Revenue Swarm
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Courses & Retainer Services Hub
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Autonomously plans, architects, markets, and sells digital courses and done-for-you agency services with GHL CRM pipelines and Stripe checkout synchronization.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="operant-new-offer-btn"
              onClick={() => setShowNewOfferModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Architect Offer</span>
            </button>
            <button
              id="operant-new-campaign-btn"
              onClick={() => setShowCampaignModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-semibold rounded-xl transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Launch Campaign</span>
            </button>
          </div>
        </div>

        {/* Financial Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-5 pt-5 border-t border-slate-800/80">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Gross Revenue</span>
            <span className="text-base sm:text-lg font-bold text-emerald-400">${financials.gross_revenue.toLocaleString()}</span>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Course Sales</span>
            <span className="text-base sm:text-lg font-bold text-indigo-300">${financials.course_sales_revenue.toLocaleString()}</span>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Service Retainers</span>
            <span className="text-base sm:text-lg font-bold text-purple-300">${financials.service_retainer_revenue.toLocaleString()}</span>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Monthly MRR</span>
            <span className="text-base sm:text-lg font-bold text-amber-300">${financials.monthly_recurring_revenue.toLocaleString()}</span>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Students & Clients</span>
            <span className="text-base sm:text-lg font-bold text-white">{financials.total_students_enrolled + financials.active_service_clients} total</span>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Net Founder Payout</span>
            <span className="text-base sm:text-lg font-bold text-cyan-300">${financials.net_founder_payout.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/80 rounded-xl p-2.5">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filterType === "all"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            All Products ({offers.length})
          </button>
          <button
            onClick={() => setFilterType("course")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filterType === "course"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            Courses & Cohorts ({offers.filter((o) => o.type === "course" || o.type === "cohort").length})
          </button>
          <button
            onClick={() => setFilterType("service")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filterType === "service"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            Services & Retainers ({offers.filter((o) => o.type === "dfy_buildout" || o.type === "service_retainer" || o.type === "consulting").length})
          </button>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search offers or curricula..."
            className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-full sm:w-60"
          />
        </div>
      </div>

      {/* Offers Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOffers.map((offer) => {
          const isCourse = offer.type === "course" || offer.type === "cohort";
          return (
            <div
              key={offer.id}
              className="bg-slate-900/80 border border-slate-800/80 hover:border-indigo-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all group hover:shadow-xl hover:shadow-indigo-500/5 relative"
            >
              <div className="space-y-3">
                {/* Header tag & price */}
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-slate-800 text-indigo-300 border border-indigo-500/20">
                    {offer.type.replace("_", " ")}
                  </span>
                  <div className="text-right">
                    <span className="text-lg font-bold text-emerald-400">${offer.price.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400 block font-normal">
                      {offer.billing_period === "monthly" ? "/month" : "one-time"}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-3 leading-relaxed">
                    {offer.short_description}
                  </p>
                </div>

                {/* Key Deliverables / Modules Preview */}
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    {isCourse ? "Curriculum Modules" : "Key Deliverables"}
                  </span>
                  {isCourse && offer.syllabus && offer.syllabus.length > 0 ? (
                    <div className="space-y-1">
                      {offer.syllabus.slice(0, 3).map((mod) => (
                        <div key={mod.module_num} className="text-xs text-slate-300 flex items-center gap-1.5 truncate">
                          <CheckCircle2 className="w-3 h-3 text-indigo-400 shrink-0" />
                          <span className="truncate">{mod.title}</span>
                        </div>
                      ))}
                      {offer.syllabus.length > 3 && (
                        <span className="text-[10px] text-indigo-400 block pt-0.5 font-medium">
                          +{offer.syllabus.length - 3} more modules in curriculum
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {offer.deliverables.slice(0, 2).map((del, i) => (
                        <div key={i} className="text-xs text-slate-300 flex items-center gap-1.5 truncate">
                          <CheckCircle2 className="w-3 h-3 text-purple-400 shrink-0" />
                          <span className="truncate">{del.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions & Conversion Stats */}
              <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{offer.student_count} {isCourse ? "Students" : "Clients"}</span>
                  <span className="text-emerald-400 font-medium">${offer.gross_revenue.toLocaleString()} earned</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedOfferForDetail(offer)}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onEnrollStudent(offer)}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-3 h-3" />
                    <span>Simulate Buy</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Marketing Campaigns Broadcast Section */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-indigo-400" />
              <span>Multi-Channel Outbound Marketing Campaigns</span>
            </h3>
            <p className="text-xs text-slate-400">
              Autonomous content sequences distributed across LinkedIn, Twitter/X, and VSL scripts to drive Stripe checkouts.
            </p>
          </div>
          <button
            onClick={() => setShowCampaignModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-semibold rounded-xl transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Generate New Post</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {campaigns.map((camp) => (
            <div key={camp.id} className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-slate-700">
                    {camp.channel.replace("_", " ")}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-medium">
                    {camp.engagement.conversions} Conversions
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-200 line-clamp-1">{camp.title}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-3 italic">"{camp.hook}"</p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">
                  {camp.engagement.impressions.toLocaleString()} views
                </span>
                <button
                  onClick={() => copyToClipboard(camp.content, "Campaign Copy")}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy Content</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Offer Details Modal */}
      {selectedOfferForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                  {selectedOfferForDetail.type.replace("_", " ")}
                </span>
                <h2 className="text-xl font-bold text-white mt-1">{selectedOfferForDetail.title}</h2>
                <span className="text-lg font-bold text-emerald-400 mt-1 block">
                  ${selectedOfferForDetail.price.toLocaleString()} ({selectedOfferForDetail.billing_period})
                </span>
              </div>
              <button
                onClick={() => setSelectedOfferForDetail(null)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{selectedOfferForDetail.full_description}</p>

            {selectedOfferForDetail.syllabus && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Course Syllabus</h4>
                <div className="space-y-2">
                  {selectedOfferForDetail.syllabus.map((mod) => (
                    <div key={mod.module_num} className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="text-xs font-bold text-indigo-300">
                        Module {mod.module_num}: {mod.title}
                      </div>
                      <ul className="mt-1 space-y-0.5">
                        {mod.lessons.map((lesson, idx) => (
                          <li key={idx} className="text-[11px] text-slate-400 flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-indigo-400" />
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
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Included Deliverables</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedOfferForDetail.deliverables.map((del, i) => (
                  <div key={i} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <div className="text-xs font-semibold text-slate-200">{del.title}</div>
                    <div className="text-[10px] text-slate-400">{del.description}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
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
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-sm"
              >
                Simulate Purchase ($ {selectedOfferForDetail.price})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Offer Modal */}
      {showNewOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>AI Offer Architect</span>
              </h3>
              <button onClick={() => setShowNewOfferModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Topic / Core Transformation</label>
                <input
                  type="text"
                  value={newOfferTopic}
                  onChange={(e) => setNewOfferTopic(e.target.value)}
                  placeholder="e.g. Autonomous AI Outbound Lead Engine for GHL"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Offer Type</label>
                  <select
                    value={newOfferType}
                    onChange={(e: any) => setNewOfferType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="course">Video Course ($497)</option>
                    <option value="cohort">Live Cohort ($1,497)</option>
                    <option value="dfy_buildout">Done-For-You ($4,997)</option>
                    <option value="service_retainer">Monthly Retainer ($12,500/mo)</option>
                    <option value="consulting">Advisory ($2,500/mo)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={newOfferPrice}
                    onChange={(e) => setNewOfferPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target ICP / Audience</label>
                <input
                  type="text"
                  value={newOfferAudience}
                  onChange={(e) => setNewOfferAudience(e.target.value)}
                  placeholder="e.g. B2B Founders, Agency Leaders ($30k-$200k/mo)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowNewOfferModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateAiOffer}
                disabled={isGeneratingOffer}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-sm flex items-center gap-1.5 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGeneratingOffer ? "Synthesizing..." : "Generate & Publish"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Campaign Modal */}
      {showCampaignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-indigo-400" />
                <span>Launch AI Outbound Campaign</span>
              </h3>
              <button onClick={() => setShowCampaignModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Offer</label>
                <select
                  value={selectedOfferForCampaign}
                  onChange={(e) => setSelectedOfferForCampaign(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  {offers.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.title} (${o.price})
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
                  <option value="linkedin">LinkedIn Thought Leadership Post</option>
                  <option value="twitter">Twitter / X Viral Breakdown Thread</option>
                  <option value="vsl_script">VSL Video Sales Script</option>
                  <option value="email_newsletter">Email Newsletter Broadcast</option>
                  <option value="meta_ad">Meta / Paid Ad Script</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Angle / Positioning Hook</label>
                <input
                  type="text"
                  value={campaignAngle}
                  onChange={(e) => setCampaignAngle(e.target.value)}
                  placeholder="e.g. Replacing 4 SDRs with autonomous 24/7 AI agents in GHL"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowCampaignModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateAiCampaign}
                disabled={isGeneratingCampaign}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-sm flex items-center gap-1.5 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGeneratingCampaign ? "Writing Copy..." : "Generate Campaign"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
