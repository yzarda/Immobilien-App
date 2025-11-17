"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/format";
import { CalculatorIcon } from "@heroicons/react/24/outline";

export const InvestmentCalculator = () => {
  const [size, setSize] = useState(75);
  const [rentPerSqm, setRentPerSqm] = useState(16);
  const [targetYield, setTargetYield] = useState(5.5);
  const [basePricePerSqm, setBasePricePerSqm] = useState(6_500);
  const [renovationPerSqm, setRenovationPerSqm] = useState(900);
  const [additionalCostsPercent, setAdditionalCostsPercent] = useState(8);

  const annualRent = size * rentPerSqm * 12;
  const yieldDecimal = targetYield / 100;
  const rentBasedPrice = yieldDecimal ? annualRent / yieldDecimal : 0;
  const rentBasedPricePerSqm = size ? rentBasedPrice / size : 0;

  const purchaseCost = size * basePricePerSqm;
  const renovationBudget = size * renovationPerSqm;
  const additionalCosts =
    ((purchaseCost + renovationBudget) * additionalCostsPercent) / 100;
  const costBasedTotal = purchaseCost + renovationBudget + additionalCosts;
  const costBasedPricePerSqm = size ? costBasedTotal / size : 0;

  return (
    <div className="rounded-3xl border border-white/10 bg-[#080e19]/85 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.6)] backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-amber-400/15 p-2">
          <CalculatorIcon className="h-5 w-5 text-amber-300" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-amber-300">
            Deal-Rechner
          </p>
          <h3 className="text-xl font-semibold text-white">
            Zielkaufpreis & Kostenvergleich
          </h3>
          <p className="text-sm text-slate-400">
            Eingaben anpassen und Varianten vergleichen (Mietrendite vs. Kostenansatz).
          </p>
        </div>
      </div>

      <form className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-slate-200">
          Wohnfläche (m²)
          <input
            type="number"
            min={20}
            value={size}
            onChange={(event) => setSize(Number(event.target.value))}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
          />
        </label>

        <label className="text-sm font-medium text-slate-200">
          Marktmiete €/m²
          <input
            type="number"
            step="0.1"
            value={rentPerSqm}
            onChange={(event) => setRentPerSqm(Number(event.target.value))}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
          />
        </label>

        <label className="text-sm font-medium text-slate-200">
          Ziel-Bruttorendite (%)
          <input
            type="number"
            step="0.1"
            value={targetYield}
            onChange={(event) => setTargetYield(Number(event.target.value))}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
          />
        </label>

        <label className="text-sm font-medium text-slate-200">
          Kaufpreis €/m² (Markt)
          <input
            type="number"
            value={basePricePerSqm}
            onChange={(event) => setBasePricePerSqm(Number(event.target.value))}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
          />
        </label>

        <label className="text-sm font-medium text-slate-200">
          Renovierung €/m²
          <input
            type="number"
            value={renovationPerSqm}
            onChange={(event) => setRenovationPerSqm(Number(event.target.value))}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
          />
        </label>

        <label className="text-sm font-medium text-slate-200">
          Nebenkosten (%)
          <input
            type="number"
            step="0.5"
            value={additionalCostsPercent}
            onChange={(event) => setAdditionalCostsPercent(Number(event.target.value))}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
          />
        </label>
      </form>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-wide text-amber-300">
            Miet-Variante
          </p>
          <h4 className="text-2xl font-bold text-white">
            {formatCurrency(rentBasedPrice)}
          </h4>
          <p className="text-sm text-slate-400">
            {formatCurrency(rentBasedPricePerSqm)} pro m² bei {targetYield}% Zielrendite
          </p>
          <ul className="mt-4 space-y-1 text-sm text-slate-300">
            <li>Jahresmiete: {formatCurrency(annualRent)}</li>
            <li>Monatsmiete: {formatCurrency(size * rentPerSqm)}</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-300">
            Kosten-Variante
          </p>
          <h4 className="text-2xl font-bold text-white">
            {formatCurrency(costBasedTotal)}
          </h4>
          <p className="text-sm text-slate-300">
            {formatCurrency(costBasedPricePerSqm)} pro m² inkl. Reno & Kaufnebenkosten
          </p>
          <ul className="mt-4 space-y-1 text-sm text-slate-300">
            <li>Kaufpreis: {formatCurrency(purchaseCost)}</li>
            <li>Renovierung: {formatCurrency(renovationBudget)}</li>
            <li>
              Nebenkosten ({additionalCostsPercent}%): {formatCurrency(additionalCosts)}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

