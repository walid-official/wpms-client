import {
  ApiResponse,
  CustomerData,
} from "@/interfaces/customers.interface";
import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "./apis";

/** Get Customers Hook */
export const useGetCustomers = (
  filters?: {
    page?: number;
    limit?: number;
    search?: string;
  }
) => {
  return useQuery<ApiResponse<CustomerData[]>, Error>({
    queryKey: ["customers", filters],
    queryFn: () => getCustomers(filters),
    staleTime: 1000 * 60 * 2,
  });
};
