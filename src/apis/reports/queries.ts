import { useQuery } from '@tanstack/react-query';
import { getSummaryReport } from '@/apis/reports';
import { IReportSummaryResponse } from '@/interfaces/reports.interface';

interface ISummaryParams {
  start: string;
  end: string;
  status?: string;
  nearlyDays?: number;
  groupBy?: string;
}

export const useSummaryReport = ({
  start,
  end,
  status = 'all',
  nearlyDays = 90,
  groupBy = 'month',
}: ISummaryParams) => {
  return useQuery<IReportSummaryResponse, Error>({
    queryKey: ['summaryReport', start, end, status, nearlyDays, groupBy],
    queryFn: () => getSummaryReport(start, end, status, nearlyDays, groupBy),
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
    enabled: !!start && !!end, // only run when both are available
  });
};

