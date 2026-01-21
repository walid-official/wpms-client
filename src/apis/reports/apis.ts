import { apiClient } from '@/utils/apiClient';
import { REPORTS } from './endpoint';
import { IReportSummaryResponse } from '@/interfaces/reports.interface';

interface ApiError {
  response?: { data?: { error?: string } };
  message?: string;
}

//  Get Summary Report
export const getSummaryReport = async (
  start: string,
  end: string,
  status: string = 'all',
  nearlyDays: number = 90,
  groupBy: string = 'month'
): Promise<IReportSummaryResponse> => {
  try {
    const query = new URLSearchParams();
    query.append('start', start);
    query.append('end', end);
    query.append('status', status);
    query.append('nearlyDays', nearlyDays.toString());
    query.append('groupBy', groupBy);

    const response = await apiClient.get<IReportSummaryResponse>(
      `${REPORTS}/summary?${query.toString()}`
    );
    return response.data;
  } catch (error) {
    const err = error as ApiError;
    console.error('Error fetching summary report:', err.response?.data?.error || err.message);
    throw new Error(err.response?.data?.error || 'Failed to fetch summary report');
  }
};
