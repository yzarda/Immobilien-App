import {
  MunicipalityAverage,
  PortfolioKPIs,
  PropertyInvestment,
  PropertyKPIs,
} from "@/types";

export const calculatePropertyKPIs = (
  property: PropertyInvestment,
): PropertyKPIs => {
  const totalInvestment =
    property.purchasePrice + property.renovationCost + property.additionalCosts;
  const annualRent = property.expectedRent * 12;
  const grossYield = totalInvestment
    ? (annualRent / totalInvestment) * 100
    : 0;
  const profitPotential = property.expectedSalePrice - totalInvestment;
  const equityMultiplier = totalInvestment
    ? property.expectedSalePrice / totalInvestment
    : 0;

  return {
    totalInvestment,
    grossYield,
    profitPotential,
    equityMultiplier,
  };
};

export const calculatePortfolioKPIs = (
  properties: PropertyInvestment[],
): PortfolioKPIs => {
  if (!properties.length) {
    return {
      totalUnits: 0,
      totalInvestment: 0,
      projectedProfit: 0,
      averageYield: 0,
      renovationBudget: 0,
      cashflowReserve: 0,
    };
  }

  const totals = properties.reduce(
    (acc, property) => {
      const kpis = calculatePropertyKPIs(property);
      acc.totalInvestment += kpis.totalInvestment;
      acc.projectedProfit += kpis.profitPotential;
      acc.renovationBudget += property.renovationCost;
      acc.cashflowReserve += property.expectedRent * 3; // Reserve für 3 Monate Leerstand
      acc.averageYield += kpis.grossYield;
      return acc;
    },
    {
      totalInvestment: 0,
      projectedProfit: 0,
      renovationBudget: 0,
      cashflowReserve: 0,
      averageYield: 0,
    },
  );

  return {
    totalUnits: properties.length,
    totalInvestment: totals.totalInvestment,
    projectedProfit: totals.projectedProfit,
    renovationBudget: totals.renovationBudget,
    cashflowReserve: totals.cashflowReserve,
    averageYield: totals.averageYield / properties.length,
  };
};

export const buildMunicipalityInsights = (
  properties: PropertyInvestment[],
  averages: MunicipalityAverage[],
) => {
  const grouped = properties.reduce<Record<string, { units: number; budget: number }>>(
    (acc, property) => {
      const key = property.municipality;
      if (!acc[key]) {
        acc[key] = { units: 0, budget: 0 };
      }
      acc[key].units += 1;
      acc[key].budget +=
        property.purchasePrice +
        property.renovationCost +
        property.additionalCosts;
      return acc;
    },
    {},
  );

  return averages.map((entry) => ({
    ...entry,
    units: grouped[entry.municipality]?.units ?? 0,
    committedCapital: grouped[entry.municipality]?.budget ?? 0,
  }));
};

