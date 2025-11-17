export type InvestmentStrategy = "Buy & Hold" | "Fix & Flip" | "Short-Term";

export type PropertyStatus =
  | "Analyse"
  | "Angebot"
  | "Ankauf"
  | "Renovierung"
  | "Vermarktung";

export interface PropertyInvestment {
  id: string;
  title: string;
  municipality: string;
  size: number; // Quadratmeter
  purchasePrice: number;
  renovationCost: number;
  additionalCosts: number;
  expectedRent: number;
  expectedSalePrice: number;
  strategy: InvestmentStrategy;
  status: PropertyStatus;
  acquisitionDate: string;
  holdingPeriodMonths: number;
}

export type PropertyDraft = Omit<PropertyInvestment, "id">;

export interface MunicipalityAverage {
  municipality: string;
  avgPricePerSqm: number;
  avgRentPerSqm: number;
  avgHousePricePerSqm: number;
  avgCondoPricePerSqm: number;
  yoyChange: number;
  sampleSize: number;
}

export interface PropertyKPIs {
  totalInvestment: number;
  grossYield: number;
  profitPotential: number;
  equityMultiplier: number;
}

export interface PortfolioKPIs {
  totalUnits: number;
  totalInvestment: number;
  projectedProfit: number;
  averageYield: number;
  renovationBudget: number;
  cashflowReserve: number;
}

