"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Order } from "@/interfaces/orders.interface";
import { useDebounce } from "@/utils/debounce";
import { Pagination } from "../dashboard/common";
import { ArrowUpDown, ArrowUp, ArrowDown, Search, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { useGetOrders } from "@/apis/orders";

interface OrderReportsProps {
  filter?: string;
  start?: string;
  end?: string;
}

export const OrderReports = ({ filter = "custom", start, end }: OrderReportsProps) => {
  const [customerSearch, setCustomerSearch] = useState("");
  const [medicineSearch, setMedicineSearch] = useState("");
  const [orderIdSearch, setOrderIdSearch] = useState("");

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const debouncedCustomer = useDebounce(customerSearch, 500);
  const debouncedMedicine = useDebounce(medicineSearch, 500);
  const debouncedOrderId = useDebounce(orderIdSearch, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedCustomer, debouncedMedicine, debouncedOrderId, filter, start, end]);

  const searchParams = useMemo(
    () => ({
      customerName: debouncedCustomer,
      medicineName: debouncedMedicine,
      orderId: debouncedOrderId,
    }),
    [debouncedCustomer, debouncedMedicine, debouncedOrderId]
  );

  const { data, isLoading, error } = useGetOrders({
    filter,
    start,
    end,
    page,
    limit,
    sortBy,
    sortOrder,
    ...searchParams,
  });

  const orders: Order[] = data?.data ?? [];
  const meta = data?.meta;

  const handleSort = (field: string) => {
    setPage(1);
    if (sortBy === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return <ArrowUpDown className="ml-2 h-4 w-4 text-gray-400" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4 text-primary" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4 text-primary" />
    );
  };

  const handleDownloadInvoice = (invoiceUrl: string) => window.open(invoiceUrl, "_blank");

  const clearFilters = () => {
    setCustomerSearch("");
    setMedicineSearch("");
    setOrderIdSearch("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  const isFiltering = customerSearch || medicineSearch || orderIdSearch;

  return (
    <div className="mt-10 space-y-6">
      {/* Header + Rows */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold">Order Reports</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Rows:</span>
          <Select
            value={String(limit)}
            onValueChange={(val) => { setLimit(Number(val)); setPage(1); }}
          >
            <SelectTrigger className="w-[70px] h-8">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {["Customer", "Medicine", "Order ID"].map((label, idx) => {
            const val = [customerSearch, medicineSearch, orderIdSearch][idx];
            const setter = [setCustomerSearch, setMedicineSearch, setOrderIdSearch][idx];
            return (
              <div className="relative" key={label}>
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder={`Search ${label}...`}
                  value={val}
                  onChange={(e) => setter(e.target.value)}
                  className="pl-9"
                />
              </div>
            );
          })}
          <Button
            variant="outline"
            onClick={clearFilters}
            disabled={!isFiltering && sortBy === "createdAt" && sortOrder === "desc"}
          >
            <X className="mr-2 h-4 w-4" /> Clear Filters
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 text-red-700 px-3 py-2">
          {error.message}
        </div>
      )}

      {/* Table */}
      <div className="relative border rounded-xl shadow-sm overflow-hidden bg-white">
        <Table>
          <TableCaption>
            {meta?.total ? `Showing ${orders.length} of ${meta.total} orders` : "No orders found"}
          </TableCaption>
          <TableHeader>
            <TableRow>
              {["user.name", "Phone", "Items", "grandTotal", "createdAt", "Invoice"].map((col) => (
                <TableHead
                  key={col}
                  className={["user.name","grandTotal","createdAt"].includes(col) ? "cursor-pointer" : ""}
                  onClick={["user.name","grandTotal","createdAt"].includes(col) ? () => handleSort(col) : undefined}
                >
                  <div className="flex items-center">
                    {col === "user.name" ? "Customer" : col === "grandTotal" ? "Grand Total" : col === "createdAt" ? "Date" : col}
                    {["user.name","grandTotal","createdAt"].includes(col) && renderSortIcon(col)}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
            ) : orders.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">No orders found.</TableCell></TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order.user?.name || "Walk-in"}</TableCell>
                  <TableCell>{order.user?.phone || "-"}</TableCell>
                  <TableCell>
                    {order.items?.map((item) => (
                      <div key={item._id}>{item.name} × {item.quantity}</div>
                    ))}
                  </TableCell>
                  <TableCell>৳{order.grandTotal?.toFixed(2)}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    {order.invoiceUrl ? (
                      <Button size="sm" variant="outline" onClick={() => order.invoiceUrl && handleDownloadInvoice(order.invoiceUrl)}>
                        Download
                      </Button>
                    ) : "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination
        currentPage={meta?.page ?? 1}
        totalItems={meta?.total ?? 0}
        itemsPerPage={meta?.limit ?? limit}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
};
