import { calculatePortfolioKPIs } from "@/lib/calculations";
import { formatCurrency, formatPercent } from "@/lib/format";
import { PropertyInvestment } from "@/types";
import {
  BanknotesIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  WrenchIcon,
} from "@heroicons/react/24/outline";

interface AnalysisSummaryProps {
  properties: PropertyInvestment[];
}

const cards = [
  { key: "totalInvestment", title: "Investiertes Kapital", icon: BanknotesIcon },
  { key: "projectedProfit", title: "Potenzial (Verkauf)", icon: ChartBarIcon },
  { key: "renovationBudget", title: "Reno-Budget", icon: WrenchIcon },
  { key: "cashflowReserve", title: "Cashflow-Puffer", icon: ShieldCheckIcon },
] as const;

export const AnalysisSummary = ({ properties }: AnalysisSummaryProps) => {
  const kpis = calculatePortfolioKPIs(properties);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ key, title, icon: Icon }) => (
        <div
          key={key}
          className="rounded-3xl border border-white/5 bg-white/5 p-4 shadow-lg shadow-black/30 backdrop-blur"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-amber-400/10 p-2">
              <Icon className="h-5 w-5 text-amber-300" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                {title}
              </p>
              <p className="text-xl font-semibold text-white">
                {formatCurrency(kpis[key as keyof typeof kpis] as number)}
              </p>
            </div>
          </div>
        </div>
      ))}
      <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-white/10 to-white/5 p-5 shadow-xl shadow-black/30 backdrop-blur lg:col-span-2">
        <p className="text-xs uppercase tracking-wide text-slate-300">
          Portfolio-Status
        </p>
        <div className="mt-2 flex items-end justify-between">
          <div>
            <p className="text-4xl font-bold text-amber-300">
              {kpis.totalUnits} Objekte
            </p>
            <p className="text-sm text-slate-300">
              Ø Rendite {formatPercent(kpis.averageYield)}
            </p>
          </div>
          <div className="text-right text-xs text-slate-400">
            letzte Aktualisierung:{" "}
            {new Date().toLocaleDateString("de-AT", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

