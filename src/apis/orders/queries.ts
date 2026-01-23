import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ApiResponse,
  CreateOrderRequest,
  CreateOrderResponseData,
  Order,
} from "@/interfaces/orders.interface";
import { createOrder, getOrders } from "./apis";

/* Create Order Hook */
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<CreateOrderResponseData>,
    Error,
    CreateOrderRequest
  >({
    mutationFn: (payload) => createOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

/* Get Orders Hook */
export const useGetOrders = (filters?: {
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
}) => {
  return useQuery<ApiResponse<Order[]>, Error>({
    queryKey: ["orders", filters],
    queryFn: () => getOrders(filters),
    staleTime: 1000 * 60 * 2,
  });
};
