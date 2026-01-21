import { useQuery, useQueries } from '@tanstack/react-query';
import { getInventoryReport, InventoryFilters } from './apis';
import { IInventoryReportResponse, MedicineInventoryReport } from '@/interfaces/inventory.interface';

export const useInventoryReport = (filters: InventoryFilters = {}) => {
  const shouldFetchAll = (filters.limit ?? 0) >= 1000;
  
  // First, fetch page 1 to get total count
  const firstPageQuery = useQuery<IInventoryReportResponse, Error>({
    queryKey: ['inventoryReport', { ...filters, page: 1 }],
    queryFn: () => getInventoryReport({ ...filters, page: 1, limit: 100 }), // Backend likely limits to 100
    staleTime: 2 * 60 * 1000,
    enabled: shouldFetchAll,
  });

  const totalItems = firstPageQuery.data?.meta?.total ?? 0;
  const itemsPerPage = 100; // Backend max limit
  const totalPages = Math.min(Math.ceil(totalItems / itemsPerPage), 10); // Limit to max 10 pages (1000 items)

  // Fetch all remaining pages in parallel
  const remainingPagesQueries = useQueries({
    queries: shouldFetchAll && totalPages > 1
      ? Array.from({ length: totalPages - 1 }, (_, i) => ({
          queryKey: ['inventoryReport', { ...filters, page: i + 2 }],
          queryFn: () => getInventoryReport({ ...filters, page: i + 2, limit: itemsPerPage }),
          staleTime: 2 * 60 * 1000,
        }))
      : [],
  });

  // Normal single page query (when not fetching all)
  const singlePageQuery = useQuery<IInventoryReportResponse, Error>({
    queryKey: ['inventoryReport', filters],
    queryFn: () => getInventoryReport(filters),
    staleTime: 2 * 60 * 1000,
    enabled: !shouldFetchAll,
  });

  // Combine all data when fetching all pages
  if (shouldFetchAll) {
    const allData: MedicineInventoryReport[] = [];
    const allLoading = firstPageQuery.isLoading || remainingPagesQueries.some(q => q.isLoading);
    const allError = firstPageQuery.error || remainingPagesQueries.find(q => q.error)?.error;

    if (firstPageQuery.data) {
      allData.push(...firstPageQuery.data.data);
    }
    remainingPagesQueries.forEach(query => {
      if (query.data) {
        allData.push(...query.data.data);
      }
    });

    // Return combined data structure matching useQuery return type
    return {
      ...firstPageQuery,
      data: firstPageQuery.data
        ? {
            ...firstPageQuery.data,
            data: allData,
            meta: {
              ...firstPageQuery.data.meta,
              total: totalItems,
            },
          } as IInventoryReportResponse
        : undefined,
      isLoading: allLoading,
      isError: !!allError,
      error: allError as Error | null,
    };
  }

  // Return normal single page query
  return singlePageQuery;
};

