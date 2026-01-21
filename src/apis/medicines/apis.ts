import { apiClient } from '@/utils/apiClient';
import { MEDICINES } from './endpoints';
import { IMedicinesResponse, IMedicineValues } from '@/interfaces/medicine.interface';

interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
  message?: string;
  code?: string;
  name?: string;
}

const cleanPayload = <T extends object>(obj: T): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined && v !== null && v !== "")
  ) as Partial<T>;
};

// 🔹 CREATE Medicine (optimized)
export const createMedicine = async (data: Partial<IMedicineValues>): Promise<IMedicineValues> => {
  try {
    const payload = cleanPayload({
      name: data.name,
      category: data.category,
      expiryDate: data.expiryDate,
      price: data.price,
      quantity: data.quantity,
      mrp: data.mrp ?? 0, // default fallback
      strength: data.strength,
      manufacturer: data.manufacturer,
      batchNumber: data.batchNumber,
    });

    const response = await apiClient.post<IMedicineValues>(MEDICINES, payload, {
      timeout: 8000,
    });

    return response.data;
  } catch (error) {
    const err = error as ApiError;
    // Don't throw for canceled requests
    if (err.code === 'ERR_CANCELED' || err.message === 'canceled' || err.name === 'CanceledError') {
      throw error; // Re-throw canceled errors without logging
    }
    // Error will be handled by mutation's onError handler which shows toast
    throw new Error(err.response?.data?.error || err.message || "Failed to create medicine");
  }
};

// 🔹 UPDATE Medicine (optimized)
export const updateMedicine = async (
  id: string,
  data: Partial<IMedicineValues>
): Promise<IMedicineValues> => {
  try {
    const payload = cleanPayload(data);
    const response = await apiClient.put<IMedicineValues>(`${MEDICINES}/${id}`, payload, {
      timeout: 8000,
    });
    return response.data;
  } catch (error) {
    const err = error as ApiError;
    // Don't throw for canceled requests
    if (err.code === 'ERR_CANCELED' || err.message === 'canceled' || err.name === 'CanceledError') {
      throw error; // Re-throw canceled errors without logging
    }
    // Error will be handled by mutation's onError handler which shows toast
    throw new Error(err.response?.data?.error || err.message || "Failed to update medicine");
  }
};

export const getMedicines = async (
  search?: string,
  page: number = 1,
  limit: number = 10,
  signal?: AbortSignal // abort if query changes fast
): Promise<IMedicinesResponse> => {
  try {
    const query = new URLSearchParams();
    // Send search query as-is (trimmed) - backend handles case-insensitive matching
    // URLSearchParams automatically handles URL encoding for special characters
    if (search) {
      const normalizedSearch = search.trim();
      if (normalizedSearch) {
        query.append("search", normalizedSearch);
      }
    }
    query.append("page", page.toString());
    query.append("limit", limit.toString());

    const response = await apiClient.get<IMedicinesResponse>(
      `${MEDICINES}?${query.toString()}`,
      { signal } // cancel stale fetches
    );

    return response.data;
  } catch (error) {
    const err = error as ApiError;
    // Don't throw for canceled requests (expected when React Query cancels stale requests)
    if (err.code === 'ERR_CANCELED' || err.message === 'canceled' || err.name === 'CanceledError') {
      throw error; // Re-throw canceled errors silently
    }
    // Error will be handled by query's onError or component error boundary
    throw new Error(err.response?.data?.error || err.message || "Failed to fetch medicines");
  }
};



//  Get Medicine by ID
export const getMedicineById = async (id: string): Promise<IMedicineValues> => {
  try {
    const response = await apiClient.get<IMedicineValues>(`${MEDICINES}/${id}`);
    return response.data;
  } catch (error) {
    const err = error as ApiError;
    // Don't throw for canceled requests
    if (err.code === 'ERR_CANCELED' || err.message === 'canceled' || err.name === 'CanceledError') {
      throw error; // Re-throw canceled errors without logging
    }
    // Error will be handled by query's onError or component error boundary
    throw new Error(err.response?.data?.error || err.message || 'Failed to fetch medicine');
  }
};


// 🔹 Get Expired or Nearly Expired Medicines
export const getExpiredMedicines = async (
  status: 'expired' | 'nearly' | 'all' = 'expired',
  nearlyDays: number = 30
): Promise<IMedicinesResponse> => {
  try {
    const query = new URLSearchParams();
    query.append('status', status);
    query.append('nearlyDays', nearlyDays.toString());

    const response = await apiClient.get<IMedicinesResponse>(`${MEDICINES}/expired?${query.toString()}`);
    return response.data;
  } catch (error) {
    const err = error as ApiError;
    // Don't throw for canceled requests
    if (err.code === 'ERR_CANCELED' || err.message === 'canceled' || err.name === 'CanceledError') {
      throw error; // Re-throw canceled errors without logging
    }
    // Error will be handled by query's onError or component error boundary
    throw new Error(err.response?.data?.error || err.message || 'Failed to fetch expired medicines');
  }
};



// //  Update Medicine
// export const updateMedicine = async (
//   id: string,
//   data: Partial<IMedicineValues>
// ): Promise<IMedicineValues> => {
//   try {
//     const response = await apiClient.put<IMedicineValues>(`${MEDICINES}/${id}`, data);
//     return response.data;
//   } catch (error) {
//     const err = error as ApiError;
//     console.error('Error updating medicine:', err.response?.data?.error || err.message);
//     throw new Error(err.response?.data?.error || 'Failed to update medicine');
//   }
// };


//  Delete Medicine
export const deleteMedicine = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`${MEDICINES}/${id}`);
  } catch (error) {
    const err = error as ApiError;
    // Don't throw for canceled requests
    if (err.code === 'ERR_CANCELED' || err.message === 'canceled' || err.name === 'CanceledError') {
      throw error; // Re-throw canceled errors without logging
    }
    // Error will be handled by mutation's onError handler which shows toast
    throw new Error(err.response?.data?.error || err.message || 'Failed to delete medicine');
  }
};


// Update Medicine MRP Only
export const updateMedicineMRP = async (id: string, mrp: number): Promise<IMedicineValues> => {
  try {
    const response = await apiClient.patch<IMedicineValues>(`${MEDICINES}/${id}/mrp`, { mrp });
    return response.data;
  } catch (error) {
    const err = error as ApiError;
    // Don't throw for canceled requests
    if (err.code === 'ERR_CANCELED' || err.message === 'canceled' || err.name === 'CanceledError') {
      throw error; // Re-throw canceled errors without logging
    }
    // Error will be handled by mutation's onError handler which shows toast
    throw new Error(err.response?.data?.error || err.message || 'Failed to update MRP');
  }
};