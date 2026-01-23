"use client";

import { useState, useEffect, useMemo } from "react";
import { useGetCustomers } from "@/apis/customers";
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
import {
  CustomerData,
  ApiResponse,
} from "@/interfaces/customers.interface";
import { useDebounce } from "@/utils/debounce";
import { Pagination } from "../dashboard/common";
import { Search, User, Phone, Coins, DollarSign, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const CustomersList = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  const debouncedSearch = useDebounce(search, 400);
  const isDebouncing = search !== debouncedSearch;

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data, isLoading, error } = useGetCustomers({
    page,
    limit,
    search: debouncedSearch.trim() || undefined,
  });

  // Backend returns: { success, statusCode, message, data: CustomerData[], meta }
  const customers: CustomerData[] = Array.isArray(data?.data) ? data.data : [];
  const metaPagination = data?.meta;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">All Customers</h2>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 text-red-700 px-3 py-2">
          {error.message}
        </div>
      )}

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or phone number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <div className="relative border p-3 rounded-xl shadow-sm overflow-hidden">
        {isLoading && !data && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center text-gray-600 text-sm">
            Loading customers...
          </div>
        )}

        <Table>
          <TableCaption>
            {isDebouncing
              ? "Waiting for you to stop typing…"
              : isLoading && data
              ? "Updating results…"
              : customers.length === 0
              ? "No customers found"
              : `Showing ${customers.length} customer${customers.length !== 1 ? "s" : ""}`}
          </TableCaption>

          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[200px]">Customer Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-center">Loyalty Points</TableHead>
              <TableHead className="text-right">Total Spent</TableHead>
              <TableHead className="text-center">Orders</TableHead>
              <TableHead>Joined Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading && data ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-gray-600">
                  Updating…
                </TableCell>
              </TableRow>
            ) : customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <User className="h-12 w-12 text-gray-300" />
                    <p className="text-sm">No customers found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow
                  key={customer._id}
                  className="hover:bg-gray-50 even:bg-gray-50/40 transition-colors"
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {customer.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {customer.phone}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Coins className="h-4 w-4 text-yellow-500" />
                      <span className="font-semibold">{customer.loyaltyPoints}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    <div className="flex items-center justify-end gap-1">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      ৳{customer.totalSpent?.toFixed(2) || "0.00"}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <ShoppingBag className="h-4 w-4 text-blue-500" />
                      <span>
                        {Array.isArray(customer.orderHistory)
                          ? customer.orderHistory.length
                          : 0}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {customer.createdAt
                      ? new Date(customer.createdAt).toLocaleDateString("en-GB", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {metaPagination && metaPagination.total > 0 && (
        <Pagination
          currentPage={metaPagination.page ?? 1}
          totalItems={metaPagination.total ?? 0}
          itemsPerPage={metaPagination.limit ?? 20}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}
    </div>
  );
};
