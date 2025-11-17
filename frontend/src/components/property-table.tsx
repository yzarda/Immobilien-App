import { calculatePropertyKPIs } from "@/lib/calculations";
import { formatCurrency, formatPercent, formatDate } from "@/lib/format";
import { PropertyInvestment } from "@/types";
import {
  ArrowTrendingUpIcon,
  BuildingOffice2Icon,
  ClockIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface PropertyTableProps {
  properties: PropertyInvestment[];
  onRemove: (id: string) => Promise<void>;
  onSelect: (property: PropertyInvestment) => void;
}

export const PropertyTable = ({
  properties,
  onRemove,
  onSelect,
}: PropertyTableProps) => {
  if (!properties.length) {
    return (
      <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-8 text-center text-sm text-slate-300 backdrop-blur">
        Noch keine Objekte erfasst. Erfasse dein erstes Objekt über das Formular.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-white/5 bg-[#0b101c]/85 shadow-[0_30px_70px_rgba(3,6,10,0.65)] backdrop-blur">
      <table className="w-full table-auto border-collapse text-sm text-slate-200">
        <thead className="bg-white/5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
          <tr>
            <th className="px-6 py-4">Objekt</th>
            <th className="px-6 py-4">Markt</th>
            <th className="px-6 py-4">Investition</th>
            <th className="px-6 py-4">Miete p.m.</th>
            <th className="px-6 py-4">Rendite</th>
            <th className="px-6 py-4">Potenzial</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Aktion</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property) => {
            const metrics = calculatePropertyKPIs(property);
            return (
              <tr
                key={property.id}
                onClick={() => onSelect(property)}
                className="cursor-pointer border-t border-white/5 transition hover:bg-white/5"
              >
                <td className="px-6 py-4">
                  <div className="font-semibold text-white">
                    {property.title}
                  </div>
                  <div className="text-xs text-slate-400">
                    {property.strategy} • {property.size} m²
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-200">
                    <BuildingOffice2Icon className="h-4 w-4 text-amber-300" />
                    {property.municipality}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <ClockIcon className="h-3.5 w-3.5" />
                    {formatDate(property.acquisitionDate)} •{" "}
                    {property.holdingPeriodMonths} Monate
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-white">
                    {formatCurrency(metrics.totalInvestment)}
                  </div>
                  <div className="text-xs text-slate-400">
                    + {formatCurrency(property.renovationCost)} Reno
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold text-white">
                  {formatCurrency(property.expectedRent)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-amber-300">
                    <ArrowTrendingUpIcon className="h-4 w-4" />
                    {formatPercent(metrics.grossYield)}
                  </div>
                  <div className="text-xs text-slate-400">
                    Equity {metrics.equityMultiplier.toFixed(1)}x
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-white">
                    {formatCurrency(metrics.profitPotential)}
                  </div>
                  <div className="text-xs text-slate-400">
                    Ziel {formatCurrency(property.expectedSalePrice)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90">
                    {property.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onSelect(property);
                    }}
                    className="mr-2 inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:border-amber-200 hover:bg-amber-400/10 hover:text-amber-200"
                  >
                    Bearbeiten
                  </button>
                  <button
                    type="button"
                    onClick={async (event) => {
                      event.stopPropagation();
                      try {
                        await onRemove(property.id);
                      } catch (error) {
                        console.error(error);
                      }
                    }}
                    className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-slate-300 transition hover:border-rose-200 hover:bg-rose-500/10 hover:text-rose-200"
                  >
                    <TrashIcon className="mr-1 h-3.5 w-3.5" />
                    Entfernen
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

