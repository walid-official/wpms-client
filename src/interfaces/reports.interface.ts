export interface IReportSummaryResponse {
  cards: {
    totalSKUs: number;
    totalUnits: number;
    expiredCount: number;
    nearlyExpiryCount: number;
    totalRevenue: number;
    totalUnitsSold: number;
    totalKanaPrice: number;
    totalProfit: number;
  };
  byCategory: {
    _id: string;
    skus: number;
    units: number;
  }[];
  charts: {
    salesTrend: SalesTrendItem[];
    medicinesSoldMonthly: MedicinesSoldMonthlyItem[];
    topSelling: TopSellingItem[];
  };
}

export interface SalesTrendItem {
  _id: {
    period: string;
  };
  revenue: number;
}

export interface MedicinesSoldMonthlyItem {
  _id: {
    med: string;
    period: string;
  };
  qty: number;
}

export interface TopSellingItem {
  _id: string;
  name: string;
  category: string;
}
