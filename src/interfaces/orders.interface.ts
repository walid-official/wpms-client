// src/interfaces/orders.interface.ts

export interface UserPayload {
  name?: string;
  phone?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrderItem {
  medicineId: string | { _id: string; name: string };
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
  _id: string;
}

export interface OrderData {
  _id: string;
  user?: UserPayload;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  grandTotal: number;
  createdAt: string;
  updatedAt: string;
  invoiceUrl?: string;
  meta?: PaginationMeta;
  __v?: number;
}

export type OrdersListPayload = {
  data: OrderData[];
  meta: PaginationMeta;
};

export interface CreateOrderRequest {
  user?: UserPayload;
  items: Pick<OrderItem, "medicineId" | "quantity">[];
  discount?: number;
}

export interface CreateOrderResponseData {
  orderId: string;
  invoiceUrl: string;
}

export interface ApiResponse<T = unknown> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}