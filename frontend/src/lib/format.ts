const currencyFormatter = new Intl.NumberFormat("de-AT", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export const formatCurrency = (value: number) => currencyFormatter.format(value);

export const formatPercent = (value: number, digits = 1) =>
  `${value.toFixed(digits)}%`;

export const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("de-AT", {
    month: "short",
    year: "numeric",
  });

