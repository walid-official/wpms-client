"use client";

import { useState, useEffect, useMemo } from "react";
import { useGetOrders } from "@/apis/orders";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  OrderData,
  ApiResponse,
} from "@/interfaces/orders.interface";
import { useDebounce } from "@/utils/debounce";
import { Pagination } from "../dashboard/common";

interface OrderReportsProps {
  filter?: string;
  start?: string;
  end?: string;
}

export const OrderReports = ({
  filter = "custom",
  start,
  end,
}: OrderReportsProps) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const debouncedSearch = useDebounce(search, 400);
  const isDebouncing = search !== debouncedSearch;

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const searchParams = useMemo(() => {
    const q = debouncedSearch.trim();
    return q.length > 0 ? { customerName: q, medicineName: q } : {};
  }, [debouncedSearch]);

  const { data, isLoading, error } = useGetOrders({
    filter,
    start,
    end,
    page,
    limit,
    ...searchParams,
  }) as {
    data?: ApiResponse<OrderData[]>;
    isLoading: boolean;
    error: Error | null;
  };

  const orders: OrderData[] = data?.data || [];
  const metaPagination = data?.meta;

  // 🧾 Function to handle PDF download from Cloudinary URL
  const handleDownloadInvoice = async (invoiceUrl: string, orderId: string) => {
    try {
      const response = await fetch(invoiceUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch invoice PDF");
      }
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error(err);
      alert("Failed to download invoice. Please try again.");
    }
  };

  return (
    <div className="mt-10 space-y-6">
      <h2 className="text-2xl font-semibold">Order Reports</h2>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 text-red-700 px-3 py-2">
          {error.message}
        </div>
      )}

      {/* --- Orders Table --- */}
      <div className="relative border p-3 rounded-xl shadow-sm overflow-hidden">
        {isLoading && !data && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center text-gray-600 text-sm">
            Loading orders...
          </div>
        )}

        <Table>
          <TableCaption>
            {isDebouncing
              ? "Waiting for you to stop typing…"
              : isLoading && data
              ? "Updating results…"
              : orders.length === 0
              ? "No orders found"
              : "All recent orders"}
          </TableCaption>

          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[180px]">Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Grand Total</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Invoice</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading && data ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-gray-600">
                  Updating…
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow
                  key={order._id}
                  className="hover:bg-gray-50 even:bg-gray-50/40 transition-colors"
                >
                  <TableCell className="font-medium">
                    {order.user?.name || "-"}
                  </TableCell>
                  <TableCell>{order.user?.phone || "-"}</TableCell>
                  <TableCell>
                    {order.items?.map((item) => (
                      <div key={item._id} className="text-sm text-gray-700">
                        {item.name} × {item.quantity}
                      </div>
                    )) || "-"}
                  </TableCell>
                  <TableCell className="font-semibold">
                    ৳{order.grandTotal?.toFixed(2) || "0.00"}
                  </TableCell>
                  <TableCell>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("en-GB")
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {order.invoiceUrl ? (
                      <Button
                      className="cursor-pointer"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (order.invoiceUrl) {
                            handleDownloadInvoice(order.invoiceUrl, order._id);
                          }
                        }}
                      >
                        Download Invoice
                      </Button>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- Pagination --- */}
      <Pagination
        currentPage={metaPagination?.page ?? 1}
        totalItems={metaPagination?.total ?? 0}
        itemsPerPage={metaPagination?.limit ?? 10}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
};
