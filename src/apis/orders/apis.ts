import { AxiosError } from "axios";
import {
  ApiResponse,
  CreateOrderRequest,
  CreateOrderResponseData,
  OrdersListPayload,
} from "@/interfaces/orders.interface";
import { apiClient } from "@/utils/apiClient";
import { ORDERS } from "./endpoints";

interface ApiErrorResponse {
  message: string;
  [key: string]: unknown;
}

/* Create Order */
export const createOrder = async (
  payload: CreateOrderRequest
): Promise<ApiResponse<CreateOrderResponseData>> => {
  try {
    const resp = await apiClient.post<ApiResponse<CreateOrderResponseData>>(
      ORDERS,
      payload
    );
    return resp.data;
  } catch (e) {
    const err = e as AxiosError<ApiErrorResponse>;
    const message =
      err.response?.data?.message || err.message || "Failed to create order";
    console.error("createOrder error:", message, err.response?.data);
    throw new Error(message);
  }
};

/* Get Orders with filters, pagination, and search */
export const getOrders = async (
  filters?: {
    filter?: string;
    start?: string;
    end?: string;
    orderId?: string;
    customerName?: string;
    medicineName?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }
): Promise<ApiResponse<OrdersListPayload>> => {
  try {
    const params: Record<string, string> = {};

    if (filters?.filter) params.filter = filters.filter;
    if (filters?.start) params.start = filters.start;
    if (filters?.end) params.end = filters.end;
    if (filters?.orderId) params.orderId = filters.orderId;
    if (filters?.customerName) params.customerName = filters.customerName;
    if (filters?.medicineName) params.medicineName = filters.medicineName;
    if (filters?.page != null) params.page = String(filters.page);
    if (filters?.limit != null) params.limit = String(filters.limit);
    if (filters?.sortBy) params.sortBy = filters.sortBy;
    if (filters?.sortOrder) params.sortOrder = filters.sortOrder;

    const resp = await apiClient.get<ApiResponse<OrdersListPayload>>(ORDERS, { params });
    return resp.data;
  } catch (e) {
    const err = e as AxiosError<ApiErrorResponse>;
    const message =
      err.response?.data?.message || err.message || "Failed to fetch orders";
    console.error("getOrders error:", message, err.response?.data);
    throw new Error(message);
  }
};
