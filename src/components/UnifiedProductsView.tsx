import React, { useState } from "react";
import { MarketingCampaign, OfferItem, PlatformFinancials } from "../types";
import { OperantOffersHub } from "./OperantOffersHub";
import { OperantSalesDesk } from "./OperantSalesDesk";
import { DollarSign, BookOpen, Bot, TrendingUp, Users, Sparkles } from "lucide-react";

interface UnifiedProductsViewProps {
  offers: OfferItem[];
  setOffers: React.Dispatch<React.SetStateAction<OfferItem[]>>;
  campaigns: MarketingCampaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<MarketingCampaign[]>>;
  financials: PlatformFinancials;
  setFinancials: React.Dispatch<React.SetStateAction<PlatformFinancials>>;
  onEnrollStudent: (offer: OfferItem) => void;
  showToast: (msg: string) => void;
  selectedOfferForTriage?: OfferItem | null;
  leads: any[];
}

export const UnifiedProductsView: React.FC<UnifiedProductsViewProps> = ({
  offers,
  setOffers,
  campaigns,
  setCampaigns,
  financials,
  setFinancials,
  onEnrollStudent,
  showToast,
  selectedOfferForTriage,
  leads,
}) => {
  const [subView, setSubView] = useState<"catalog" | "advisor">("catalog");

  return (
    <div className="space-y-6">
      {/* Top Header & View Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Products & Revenue Hub</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/25">
              ${financials.gross_revenue.toLocaleString()} Total Sales
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your digital courses, done-for-you services, pricing tiers, and AI sales recommendations.
          </p>
        </div>

        {/* Clean 2-Option View Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSubView("catalog")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              subView === "catalog"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Products & Packages ({offers.length})</span>
          </button>
          <button
            onClick={() => setSubView("advisor")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              subView === "advisor"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Sales Advisor</span>
          </button>
        </div>
      </div>

      {/* Render Active Sub-View */}
      {subView === "catalog" ? (
        <OperantOffersHub
          offers={offers}
          setOffers={setOffers}
          campaigns={campaigns}
          setCampaigns={setCampaigns}
          financials={financials}
          setFinancials={setFinancials}
          onEnrollStudent={onEnrollStudent}
          showToast={showToast}
          onOpenConsultation={(offer) => {
            setSubView("advisor");
          }}
        />
      ) : (
        <OperantSalesDesk
          offers={offers}
          leads={leads}
          showToast={showToast}
          onEnrollStudent={onEnrollStudent}
          selectedOffer={selectedOfferForTriage || null}
        />
      )}
    </div>
  );
};
