export interface MedicineInventoryReport {
  medicineId: string;
  medicineName: string;
  category?: string;
  manufacturer?: string;
  strength?: string;
  batchNumber?: string;
  mrp: number;
  price: number;
  soldQuantity: number;
  remainingQuantity: number;
  totalQuantity: number; // sold + remaining (PreviousQuantity)
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalPage: number;
  total: number;
}

export interface IInventoryReportResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: PaginationMeta;
  data: MedicineInventoryReport[];
}

