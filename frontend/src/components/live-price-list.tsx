import { formatCurrency, formatPercent } from "@/lib/format";
import { MunicipalityAverage } from "@/types";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/outline";

interface LivePriceListProps {
  data: MunicipalityAverage[];
}

export const LivePriceList = ({ data }: LivePriceListProps) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#0a0f1d]/80 p-6 shadow-[0_30px_70px_rgba(2,4,10,0.55)] backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-amber-300">
            Live-Preise
          </p>
          <h3 className="text-lg font-semibold text-white">
            Durchschnittliche Kaufpreise / m²
          </h3>
          <p className="text-sm text-slate-400">
            Fokusgebiet Vorarlberg & Bodensee (50 km)
          </p>
        </div>
        <div className="text-xs text-slate-400">
          Aktualisiert:{" "}
          {new Date().toLocaleDateString("de-AT", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {data.map((entry) => {
          const TrendIcon =
            entry.yoyChange >= 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
          return (
            <div
              key={entry.municipality}
              className="rounded-2xl border border-white/5 bg-white/5 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">
                    {entry.municipality}
                  </p>
                  <p className="text-xs text-slate-400">
                    {entry.sampleSize} Angebote • {formatCurrency(entry.avgPricePerSqm)}/m² Ø
                  </p>
                </div>
                <div
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                    entry.yoyChange >= 0
                      ? "bg-amber-400/15 text-amber-200"
                      : "bg-rose-500/15 text-rose-200"
                  }`}
                >
                  <TrendIcon className="mr-1 h-4 w-4" />
                  {entry.yoyChange >= 0 ? "+" : ""}
                  {formatPercent(entry.yoyChange)}
                </div>
              </div>

              <div className="mt-3 grid gap-3 text-xs text-slate-300 sm:grid-cols-3">
                <div className="rounded-xl bg-white/5 p-3">
                  <p className="font-semibold text-white">
                    {formatCurrency(entry.avgHousePricePerSqm)}/m²
                  </p>
                  <p>Einfamilienhaus</p>
                </div>
                <div className="rounded-xl bg-white/5 p-3">
                  <p className="font-semibold text-white">
                    {formatCurrency(entry.avgCondoPricePerSqm)}/m²
                  </p>
                  <p>Eigentumswohnung</p>
                </div>
                <div className="rounded-xl bg-emerald-400/15 p-3">
                  <p className="font-semibold text-emerald-200">
                    {entry.avgRentPerSqm.toFixed(2)} €/m²
                  </p>
                  <p>Miete (Warm)</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

