CREATE TABLE IF NOT EXISTS properties (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  municipality TEXT NOT NULL,
  size REAL NOT NULL,
  purchasePrice REAL NOT NULL,
  renovationCost REAL NOT NULL,
  additionalCosts REAL NOT NULL,
  expectedRent REAL NOT NULL,
  expectedSalePrice REAL NOT NULL,
  strategy TEXT NOT NULL,
  status TEXT NOT NULL,
  acquisitionDate TEXT NOT NULL,
  holdingPeriodMonths INTEGER NOT NULL,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);


