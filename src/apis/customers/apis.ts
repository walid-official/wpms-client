import { AxiosError } from "axios";
import {
  ApiResponse,
  CustomerData,
} from "@/interfaces/customers.interface";
import { apiClient } from "@/utils/apiClient";
import { CUSTOMERS } from "./endpoints";

interface ApiErrorResponse {
  message: string;
  [key: string]: unknown;
}

/* Get Customers with pagination and search */
export const getCustomers = async (
  filters?: {
    page?: number;
    limit?: number;
    search?: string;
  }
): Promise<ApiResponse<CustomersListPayload>> => {
  try {
    const params: Record<string, string> = {};

    if (filters?.page != null) params.page = String(filters.page);
    if (filters?.limit != null) params.limit = String(filters.limit);
    if (filters?.search) params.search = filters.search;

    const resp = await apiClient.get<ApiResponse<CustomersListPayload>>(CUSTOMERS, { params });
    return resp.data;
  } catch (e) {
    const err = e as AxiosError<ApiErrorResponse>;
    const message =
      err.response?.data?.message || err.message || "Failed to fetch customers";
    console.error("getCustomers error:", message, err.response?.data);
    throw new Error(message);
  }
};
