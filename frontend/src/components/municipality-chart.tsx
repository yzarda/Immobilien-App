import { buildMunicipalityInsights } from "@/lib/calculations";
import { formatCurrency, formatPercent } from "@/lib/format";
import { MunicipalityAverage, PropertyInvestment } from "@/types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface MunicipalityChartProps {
  properties: PropertyInvestment[];
  averages: MunicipalityAverage[];
}

export const MunicipalityChart = ({
  properties,
  averages,
}: MunicipalityChartProps) => {
  const insights = buildMunicipalityInsights(properties, averages);

  return (
    <div className="rounded-3xl border border-white/10 bg-[#090f1b]/85 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.6)] backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Durchschnittspreise je Gemeinde
          </h3>
          <p className="text-sm text-slate-400">
            Marktvergleich mit deinem aktuellen Portfolio
          </p>
        </div>
        <div className="text-xs text-slate-400">
          Quelle: Statistik Mockup 2024
        </div>
      </div>
      <div className="mt-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={insights}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="municipality" tick={{ fontSize: 12, fill: "#cbd5f5" }} />
            <YAxis
              tickFormatter={(value) => `${Math.round(value / 1000)}k`}
              tick={{ fontSize: 12, fill: "#cbd5f5" }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={{ stroke: "rgba(255,255,255,0.1)" }}
            />
            <Tooltip
              formatter={(value: number, name) => {
                if (name === "avgPricePerSqm") {
                  return [formatCurrency(value), "Preis/m²"];
                }
                if (name === "yoyChange") {
                  return [formatPercent(value), "YoY"];
                }
                return [formatCurrency(value), "Kapital"];
              }}
              labelFormatter={(label) => `Gemeinde ${label}`}
              contentStyle={{
                borderRadius: 16,
                borderColor: "rgba(255,255,255,0.1)",
                backgroundColor: "rgba(5,8,15,0.95)",
                color: "#f8fafc",
              }}
            />
            <Bar dataKey="avgPricePerSqm" fill="#f4c15d" radius={10} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {insights.map((entry) => (
          <div
            key={entry.municipality}
            className="rounded-xl border border-white/5 bg-white/5 p-3 text-slate-200"
          >
            <div className="flex items-center justify-between text-sm">
              <p className="font-semibold text-white">
                {entry.municipality}
              </p>
              <p
                className={`text-xs font-semibold ${
                  entry.yoyChange >= 0 ? "text-amber-300" : "text-rose-300"
                }`}
              >
                {entry.yoyChange >= 0 ? "+" : ""}
                {formatPercent(entry.yoyChange)}
              </p>
            </div>
            <div className="mt-1 text-xs text-slate-400">
              {entry.units} Objekte • {formatCurrency(entry.committedCapital)} im
              Portfolio
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

