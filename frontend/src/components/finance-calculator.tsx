"use client";

import { useState, useMemo } from "react";
import { formatCurrency } from "@/lib/format";
import { BanknotesIcon } from "@heroicons/react/24/outline";

const DEFAULT_RATE = 3.95; // Prozent, fiktiver aktueller Marktzinssatz

const annuity = (principal: number, annualRate: number, years: number) => {
  if (!principal || !annualRate || !years) return 0;
  const monthlyRate = annualRate / 100 / 12;
  const periods = years * 12;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -periods));
};

interface FinanceCalculatorProps {
  referencePrice?: number;
}

export const FinanceCalculator = ({
  referencePrice = 500_000,
}: FinanceCalculatorProps) => {
  const [purchasePrice, setPurchasePrice] = useState(referencePrice);
  const [equity, setEquity] = useState(Math.round(referencePrice * 0.2));
  const [rate, setRate] = useState(DEFAULT_RATE);
  const [years, setYears] = useState(25);

  const loanAmount = Math.max(purchasePrice - equity, 0);

  const monthlyPayment = useMemo(
    () => annuity(loanAmount, rate, years),
    [loanAmount, rate, years],
  );

  const totalPaid = monthlyPayment * years * 12;
  const interestPaid = totalPaid - loanAmount;

  return (
    <div className="rounded-3xl border border-white/10 bg-[#080d18]/80 p-6 text-slate-100 shadow-[0_30px_70px_rgba(0,0,0,0.55)] backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-amber-400/15 p-2">
          <BanknotesIcon className="h-5 w-5 text-amber-300" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-amber-300">
            Finanzierungsrechner
          </p>
          <h3 className="text-xl font-semibold text-white">
            Aktuelle Konditionen (Ø Zinssatz {rate.toFixed(2)}%)
          </h3>
          <p className="text-sm text-slate-400">
            Schnellcheck für Annuitätendarlehen – Szenarien vergleichen.
          </p>
        </div>
      </div>

      <form className="mt-6 grid gap-4 lg:grid-cols-2">
        <label className="text-sm font-medium text-slate-200">
          Kaufpreis / Projektvolumen (€)
          <input
            type="number"
            value={purchasePrice}
            onChange={(event) => setPurchasePrice(Number(event.target.value))}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
          />
        </label>

        <label className="text-sm font-medium text-slate-200">
          Eigenkapital (€)
          <input
            type="number"
            value={equity}
            onChange={(event) => setEquity(Number(event.target.value))}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
          />
        </label>

        <label className="text-sm font-medium text-slate-200">
          Zinssatz p.a. (%)
          <input
            type="number"
            step="0.05"
            value={rate}
            onChange={(event) => setRate(Number(event.target.value))}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
          />
          <p className="mt-1 text-xs text-slate-400">
            Hinweis: Fiktiver Marktwert vom {new Date().toLocaleDateString("de-AT")}
          </p>
        </label>

        <label className="text-sm font-medium text-slate-200">
          Laufzeit (Jahre)
          <input
            type="number"
            value={years}
            onChange={(event) => setYears(Number(event.target.value))}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
          />
        </label>
      </form>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-300">
            Finanzierungsvolumen
          </p>
          <h4 className="text-3xl font-semibold text-white">
            {formatCurrency(loanAmount)}
          </h4>
          <p className="text-xs text-slate-400">
            Eigenkapitalanteil {((equity / purchasePrice) * 100 || 0).toFixed(1)}%
          </p>
          <div className="mt-4 text-sm text-slate-300">
            Monatliche Rate:{" "}
            <span className="font-semibold text-amber-300">
              {formatCurrency(monthlyPayment)}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-300">
            Gesamtkosten
          </p>
          <h4 className="text-3xl font-semibold text-white">
            {formatCurrency(totalPaid)}
          </h4>
          <p className="text-xs text-slate-400">davon Zinsen {formatCurrency(interestPaid)}</p>
          <div className="mt-4 text-sm text-slate-300">
            Effektiver Jahreszins:{" "}
            <span className="font-semibold text-amber-300">
              {rate.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

