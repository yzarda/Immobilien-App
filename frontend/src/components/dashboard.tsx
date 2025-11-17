"use client";

import { AnalysisSummary } from "@/components/analysis-summary";
import { MunicipalityChart } from "@/components/municipality-chart";
import { PropertyForm } from "@/components/property-form";
import { PropertyModal } from "@/components/property-modal";
import { PropertyTable } from "@/components/property-table";
import { LivePriceList } from "@/components/live-price-list";
import { CalculatorPanel } from "@/components/calculator-panel";
import { municipalityAverages } from "@/data/mock-data";
import { formatCurrency } from "@/lib/format";
import { PropertyDraft, PropertyInvestment } from "@/types";
import { useCallback, useEffect, useState } from "react";
import {
  fetchProperties,
  createProperty,
  deleteProperty as deletePropertyApi,
  updateProperty as updatePropertyApi,
} from "@/lib/api";

type SectionKey = "overview" | "portfolio" | "market" | "tools";

const sections: Array<{ key: SectionKey; label: string }> = [
  { key: "overview", label: "Portfolio" },
  { key: "market", label: "Markt" },
  { key: "tools", label: "Rechner" },
];

export const Dashboard = () => {
  const [properties, setProperties] = useState<PropertyInvestment[]>([]);
  const [selectedProperty, setSelectedProperty] =
    useState<PropertyInvestment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<SectionKey>("overview");

  const loadProperties = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchProperties();
      setProperties(data);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Objekte konnten nicht geladen werden.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const addProperty = async (property: PropertyDraft) => {
    setError(null);
    const created = await createProperty(property);
    setProperties((prev) => [...prev, created]);
  };

  const removeProperty = async (id: string) => {
    setError(null);
    const previous = properties;
    setProperties((prev) => prev.filter((property) => property.id !== id));
    try {
      await deletePropertyApi(id);
      if (selectedProperty?.id === id) {
        setSelectedProperty(null);
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Objekt konnte nicht gelöscht werden.",
      );
      setProperties(previous);
      throw err;
    }
  };

  const selectProperty = (property: PropertyInvestment) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const saveProperty = async (updated: PropertyInvestment) => {
    setError(null);
    const saved = await updatePropertyApi(updated.id, updated);
    setProperties((prev) =>
      prev.map((property) => (property.id === saved.id ? saved : property)),
    );
  };

  const totalRent = properties.reduce(
    (sum, property) => sum + property.expectedRent,
    0,
  );

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            <AnalysisSummary properties={properties} />
            <section className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                {isLoading ? (
                  <div className="rounded-3xl border border-white/5 bg-white/5 p-8 text-center text-sm text-slate-300 backdrop-blur">
                    Daten werden geladen …
                  </div>
                ) : (
                  <PropertyTable
                    properties={properties}
                    onRemove={removeProperty}
                    onSelect={selectProperty}
                  />
                )}
              </div>
              <PropertyForm onAdd={addProperty} />
            </section>
          </div>
        );
      case "market":
        return (
          <section className="grid gap-6 lg:grid-cols-[3fr_2fr]">
            <MunicipalityChart
              properties={properties}
              averages={municipalityAverages}
            />
            <LivePriceList data={municipalityAverages} />
          </section>
        );
      case "tools":
        return <CalculatorPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 py-8 text-slate-100">
      <header className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#070b13] via-[#0f1a2c] to-[#05060a] p-8 shadow-[0_25px_80px_rgba(6,8,15,0.45)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
              Immobilien Cockpit
            </p>
            <h1 className="mt-2 text-4xl font-semibold text-white">
              Akquise & Analyse Dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-300">
              Fokusgebiet: Vorarlberg & Bodensee (50 km Umkreis) – laufende Deals,
              Budgets und Marktpreise je Gemeinde.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-right backdrop-blur-md">
            <p className="text-xs uppercase tracking-wider text-slate-300">
              Monatsmieterträge
            </p>
            <p className="text-4xl font-semibold text-white">
              {formatCurrency(totalRent)}
            </p>
            <p className="text-xs text-slate-400">geplant nach Renovierung</p>
          </div>
        </div>
      </header>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/70 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="rounded-[24px] border border-white/10 bg-[#04060c]/80 p-1 text-sm backdrop-blur">
        <div className="flex divide-x divide-white/5 rounded-2xl">
          {sections.map((section) => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`flex-1 px-4 py-2 font-semibold transition ${
                activeSection === section.key
                  ? "rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200 text-[#05070f]"
                  : "text-slate-300 hover:bg-white/5"
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {renderSection()}

      <PropertyModal
        open={isModalOpen}
        property={selectedProperty}
        onClose={() => setIsModalOpen(false)}
        onSave={saveProperty}
        onRemove={removeProperty}
      />
    </div>
  );
};

