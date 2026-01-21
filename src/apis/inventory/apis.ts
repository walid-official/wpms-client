import { apiClient } from '@/utils/apiClient';
import { INVENTORY } from './endpoint';
import { IInventoryReportResponse } from '@/interfaces/inventory.interface';

interface ApiError {
  response?: { data?: { error?: string } };
  message?: string;
}

export interface InventoryFilters {
  filter?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  start?: string;
  end?: string;
  medicineId?: string;
  medicineName?: string;
  category?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Get Inventory Report
export const getInventoryReport = async (
  filters: InventoryFilters = {}
): Promise<IInventoryReportResponse> => {
  try {
    const query = new URLSearchParams();
    
    if (filters.filter) query.append('filter', filters.filter);
    if (filters.start) query.append('start', filters.start);
    if (filters.end) query.append('end', filters.end);
    if (filters.medicineId) query.append('medicineId', filters.medicineId);
    if (filters.medicineName) query.append('medicineName', filters.medicineName);
    if (filters.category) query.append('category', filters.category);
    if (filters.page) query.append('page', filters.page.toString());
    if (filters.limit) query.append('limit', filters.limit.toString());
    if (filters.sortBy) query.append('sortBy', filters.sortBy);
    if (filters.sortOrder) query.append('sortOrder', filters.sortOrder);

    const response = await apiClient.get<IInventoryReportResponse>(
      `${INVENTORY}?${query.toString()}`
    );
    return response.data;
  } catch (error) {
    const err = error as ApiError;
    console.error('Error fetching inventory report:', err.response?.data?.error || err.message);
    throw new Error(err.response?.data?.error || 'Failed to fetch inventory report');
  }
};

