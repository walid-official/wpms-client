// src/interfaces/customers.interface.ts

export interface CustomerData {
  _id: string;
  name: string;
  phone: string;
  loyaltyPoints: number;
  totalSpent: number;
  orderHistory: string[] | Array<{ _id: string; grandTotal: number; createdAt: string }>;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPage?: number;
  totalPages?: number;
}

export type CustomersListPayload = {
  data: CustomerData[];
  meta: PaginationMeta;
};

export interface ApiResponse<T = unknown> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}
