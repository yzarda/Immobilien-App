"use client";

import { PropertyInvestment } from "@/types";
import { formatCurrency } from "@/lib/format";
import { useEffect, useState } from "react";
import { XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";

interface PropertyModalProps {
  open: boolean;
  property: PropertyInvestment | null;
  onClose: () => void;
  onSave: (property: PropertyInvestment) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}

const numericFields: Array<keyof PropertyInvestment> = [
  "size",
  "purchasePrice",
  "renovationCost",
  "additionalCosts",
  "expectedRent",
  "expectedSalePrice",
  "holdingPeriodMonths",
];

export const PropertyModal = ({
  open,
  property,
  onClose,
  onSave,
  onRemove,
}: PropertyModalProps) => {
  const [form, setForm] = useState<PropertyInvestment | null>(property);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    setForm(property);
  }, [property]);

  if (!open || !form) {
    return null;
  }

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    if (numericFields.includes(name as keyof PropertyInvestment)) {
      setForm((prev) => (prev ? { ...prev, [name]: Number(value) } : prev));
    } else {
      setForm((prev) => (prev ? { ...prev, [name]: value } : prev));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setModalError(null);
    setIsSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      console.error(err);
      setModalError(
        err instanceof Error
          ? err.message
          : "Änderungen konnten nicht gespeichert werden.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur">
      <div className="w-full max-w-3xl rounded-[32px] border border-white/10 bg-[#060a12]/95 p-6 shadow-[0_35px_120px_rgba(0,0,0,0.7)]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-amber-300">
              Objekt bearbeiten
            </p>
            <h2 className="text-2xl font-semibold text-white">
              {form.title || "Unbenanntes Objekt"}
            </h2>
            <p className="text-sm text-slate-400">
              {form.municipality} • {formatCurrency(form.purchasePrice)} Kaufpreis
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form
          id="property-edit-form"
          onSubmit={handleSubmit}
          className="mt-6 grid gap-4 md:grid-cols-2"
        >
          <label className="text-sm font-medium text-slate-200">
            Titel
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
            />
          </label>

          <label className="text-sm font-medium text-slate-200">
            Gemeinde/Bezirk
            <input
              name="municipality"
              value={form.municipality}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
            />
          </label>

          <label className="text-sm font-medium text-slate-200">
            Strategie
            <select
              name="strategy"
              value={form.strategy}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-[#0a1424] px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
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
              className="mt-1 w-full rounded-2xl border border-white/10 bg-[#0a1424] px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
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
          <div className="md:col-span-2 mt-6 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              disabled={isDeleting}
              onClick={async () => {
                setModalError(null);
                setIsDeleting(true);
                try {
                  await onRemove(form.id);
                  onClose();
                } catch (err) {
                  console.error(err);
                  setModalError(
                    err instanceof Error
                      ? err.message
                      : "Objekt konnte nicht gelöscht werden.",
                  );
                } finally {
                  setIsDeleting(false);
                }
              }}
              className="inline-flex items-center justify-center rounded-xl border border-rose-300/50 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              {isDeleting ? "Wird gelöscht…" : "Objekt löschen"}
            </button>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/5 sm:w-auto"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="w-full rounded-xl bg-gradient-to-r from-amber-400 to-amber-200 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {isSaving ? "Speichern…" : "Änderungen speichern"}
              </button>
            </div>
          </div>
        </form>

        {modalError && (
          <p className="mt-4 text-sm text-rose-600">{modalError}</p>
        )}
      </div>
    </div>
  );
};

