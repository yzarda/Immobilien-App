"use client";

import { defaultPropertyDraft } from "@/data/mock-data";
import { PropertyDraft } from "@/types";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

interface PropertyFormProps {
  onAdd: (property: PropertyDraft) => Promise<void>;
}

const numericFields: Array<keyof PropertyDraft> = [
  "size",
  "purchasePrice",
  "renovationCost",
  "additionalCosts",
  "expectedRent",
  "expectedSalePrice",
  "holdingPeriodMonths",
];

export const PropertyForm = ({ onAdd }: PropertyFormProps) => {
  const [form, setForm] = useState<PropertyDraft>(defaultPropertyDraft);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    if (numericFields.includes(name as keyof PropertyDraft)) {
      setForm((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await onAdd(form);
      setForm(defaultPropertyDraft);
    } catch (err) {
      console.error(err);
      setSubmitError(
        err instanceof Error ? err.message : "Objekt konnte nicht gespeichert werden.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_60px_rgba(5,6,10,0.6)] backdrop-blur"
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl bg-amber-400/10 p-2">
          <PlusCircle className="h-5 w-5 text-amber-300" />
        </div>
        <h2 className="text-lg font-semibold text-white">
          Neues Objekt erfassen
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-slate-200">
          Titel
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
            placeholder="z.B. Altbau Leopoldstadt"
          />
        </label>

        <label className="text-sm font-medium text-slate-200">
          Gemeinde/Bezirk
          <input
            name="municipality"
            value={form.municipality}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
            placeholder="z.B. Wien 2"
          />
        </label>

        <label className="text-sm font-medium text-slate-200">
          Strategie
          <select
            name="strategy"
            value={form.strategy}
            onChange={handleChange}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-[#0b1526] px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
          >
            <option value="Buy & Hold">Buy & Hold</option>
            <option value="Fix & Flip">Fix & Flip</option>
            <option value="Short-Term">Kurzzeitmiete</option>
          </select>
        </label>

        <label className="text-sm font-medium text-slate-200">
          Status
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-[#0b1526] px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
          >
            <option value="Analyse">Analyse</option>
            <option value="Angebot">Angebot</option>
            <option value="Ankauf">Ankauf</option>
            <option value="Renovierung">Renovierung</option>
            <option value="Vermarktung">Vermarktung</option>
          </select>
        </label>

        <label className="text-sm font-medium text-slate-200">
          Wohnfläche (m²)
          <input
            type="number"
            name="size"
            min={20}
            value={form.size}
            onChange={handleChange}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
          />
        </label>

        <label className="text-sm font-medium text-slate-200">
          Kaufpreis (€)
          <input
            type="number"
            name="purchasePrice"
            value={form.purchasePrice}
            onChange={handleChange}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
          />
        </label>

        <label className="text-sm font-medium text-slate-200">
          Renovierung (€)
          <input
            type="number"
            name="renovationCost"
            value={form.renovationCost}
            onChange={handleChange}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
          />
        </label>

        <label className="text-sm font-medium text-slate-200">
          Nebenkosten (€)
          <input
            type="number"
            name="additionalCosts"
            value={form.additionalCosts}
            onChange={handleChange}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
          />
        </label>

        <label className="text-sm font-medium text-slate-200">
          Monatsmiete (€)
          <input
            type="number"
            name="expectedRent"
            value={form.expectedRent}
            onChange={handleChange}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
          />
        </label>

        <label className="text-sm font-medium text-slate-200">
          Ziel-Verkauf (€)
          <input
            type="number"
            name="expectedSalePrice"
            value={form.expectedSalePrice}
            onChange={handleChange}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
          />
        </label>

        <label className="text-sm font-medium text-slate-200">
          Haltedauer (Monate)
          <input
            type="number"
            name="holdingPeriodMonths"
            value={form.holdingPeriodMonths}
            onChange={handleChange}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
          />
        </label>

        <label className="text-sm font-medium text-slate-200">
          Geplanter Ankauf
          <input
            type="date"
            name="acquisitionDate"
            value={form.acquisitionDate}
            onChange={handleChange}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
          />
        </label>
      </div>

      {submitError && (
        <p className="mt-4 text-sm text-rose-600">{submitError}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Speichern…" : "Objekt hinzufügen"}
      </button>
    </form>
  );
};

