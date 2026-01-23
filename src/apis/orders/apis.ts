import { AxiosError } from "axios";
import {
  ApiResponse,
  CreateOrderRequest,
  CreateOrderResponseData,
  Order,
} from "@/interfaces/orders.interface";
import { apiClient } from "@/utils/apiClient";
import { ORDERS } from "./endpoints";

interface ApiErrorResponse {
  message: string;
  [key: string]: unknown;
};

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
    throw new Error(
      err.response?.data?.message || err.message || "Failed to create order"
    );
  }
};

/* Get Orders */
export const getOrders = async (filters?: {
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
}): Promise<ApiResponse<Order[]>> => {
  try {
    const params: Record<string, string> = {};

    Object.entries(filters || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params[key] = String(value);
      }
    });

    const resp = await apiClient.get<ApiResponse<Order[]>>(ORDERS, {
      params,
    });

    return resp.data;
  } catch (e) {
    const err = e as AxiosError<ApiErrorResponse>;
    throw new Error(
      err.response?.data?.message || err.message || "Failed to fetch orders"
    );
  }
};
