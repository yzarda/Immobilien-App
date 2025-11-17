"use client";

import { useState } from "react";
import { InvestmentCalculator } from "@/components/investment-calculator";
import { FinanceCalculator } from "@/components/finance-calculator";

type TabKey = "investment" | "finance";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "investment", label: "Deal-Rechner" },
  { key: "finance", label: "Finanzierungsrechner" },
];

export const CalculatorPanel = () => {
  const [active, setActive] = useState<TabKey>("investment");

  return (
    <section className="rounded-[32px] border border-white/10 bg-white/5 p-1 shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur">
      <div className="flex rounded-2xl border border-white/10 bg-[#05070f]/70 p-1 text-sm text-slate-300">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`flex-1 rounded-2xl px-4 py-2 font-semibold transition ${
              active === tab.key
                ? "bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200 text-[#05070f]"
                : "hover:bg-white/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {active === "investment" ? <InvestmentCalculator /> : <FinanceCalculator />}
      </div>
    </section>
  );
};

