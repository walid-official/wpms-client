import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createMedicine, deleteMedicine, getExpiredMedicines, getMedicineById, getMedicines, updateMedicine, updateMedicineMRP } from './apis';
import { IMedicinesResponse, IMedicineValues } from '@/interfaces/medicine.interface';
import toast from 'react-hot-toast';



export const useMedicines = (search?: string, page = 1, limit = 10) => {
  // Normalize search query for consistent caching and performance
  // Empty string becomes undefined to avoid unnecessary API calls with empty search
  // Keep original case - backend handles case-insensitive search
  const normalizedSearch = search?.trim() || undefined;
  
  return useQuery<IMedicinesResponse, Error>({
    queryKey: ["medicines", normalizedSearch, page, limit],
    queryFn: ({ signal }) => getMedicines(normalizedSearch, page, limit, signal),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000, // cache for 5 min
    gcTime: 10 * 60 * 1000, // memory retention
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    // Errors are handled by apiClient interceptor for server errors
    // Canceled errors are silently ignored (expected behavior)
  });
};


//  Fetch single medicine by ID
export const useMedicineById = (id: string) => {
  return useQuery<IMedicineValues, Error>({
    queryKey: ['medicine', id],
    queryFn: () => getMedicineById(id),
    enabled: !!id,
    // Errors are handled by apiClient interceptor for server errors
    // Canceled errors are silently ignored (expected behavior)
  });
};


// 🔹 Fetch expired or nearly expired medicines
export const useExpiredMedicines = (
  status: 'expired' | 'nearly' | 'all' = 'expired',
  nearlyDays: number = 30
) => {
  return useQuery<IMedicinesResponse, Error>({
    queryKey: ['expired-medicines', status, nearlyDays],
    queryFn: () => getExpiredMedicines(status, nearlyDays),
    staleTime: 5 * 60 * 1000,
    // Errors are handled by apiClient interceptor for server errors
    // Canceled errors are silently ignored (expected behavior)
  });
};


export const useCreateMedicine = () => {
  const queryClient = useQueryClient();

  return useMutation<IMedicineValues, Error, Partial<IMedicineValues>>({
    mutationFn: (data) => createMedicine(data),
    onSuccess: () => {
      toast.success("Medicine created successfully!");
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create medicine");
    },
  });
};


// Update medicine mutation
export const useUpdateMedicine = () => {
  const queryClient = useQueryClient();

  return useMutation<IMedicineValues, Error, { id: string; data: Partial<IMedicineValues> }>({
    mutationFn: ({ id, data }) => updateMedicine(id, data),
    onSuccess: (_, { id }) => {
      toast.success("Medicine updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      queryClient.invalidateQueries({ queryKey: ["medicine", id] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update medicine");
    },
  });
};

//  Delete medicine mutation
export const useDeleteMedicine = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) => deleteMedicine(id),
    onSuccess: () => {
      toast.success("Medicine deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete medicine");
    },
  });
};


export const useUpdateMedicineMRP = () => {
  const queryClient = useQueryClient();

  return useMutation<IMedicineValues, Error, { id: string; mrp: number }>({
    mutationFn: ({ id, mrp }) => updateMedicineMRP(id, mrp),
    onSuccess: (_, { id }) => {
      toast.success("MRP updated successfully!");
      // Refresh both list and single view
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
      queryClient.invalidateQueries({ queryKey: ['medicine', id] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update MRP");
    },
  });
};