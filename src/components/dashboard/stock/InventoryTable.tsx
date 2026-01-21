"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Pill } from "lucide-react";
import { MedicineInventoryReport } from "@/interfaces/inventory.interface";
import { Pagination } from "@/components/dashboard/common";

interface InventoryTableProps {
  data: MedicineInventoryReport[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoading?: boolean;
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  showPagination?: boolean;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  data,
  searchQuery,
  setSearchQuery,
  isLoading,
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  showPagination = true,
}) => {
  return (
    <div className="bg-white rounded-md shadow border p-4">
      {/* Search */}
      <div className="relative mb-4 max-w-md">
        <Pill className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search medicines..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            onPageChange(1);
          }}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="text-center py-4 text-muted-foreground">Loading inventory report...</div>
        ) : data.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">No inventory data found.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="p-2">Name</th>
                <th className="p-2">Previous Quantity</th>
                <th className="p-2">Sold Quantity</th>
                <th className="p-2">Remaining Quantity</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr
                  key={item.medicineId}
                  className="border-b border-border hover:bg-muted/50"
                >
                  <td className="p-2 font-medium">{item.medicineName}</td>
                  <td className="p-2">{item.totalQuantity}</td>
                  <td className="p-2 text-orange-600 font-semibold">{item.soldQuantity}</td>
                  <td className="p-2 text-green-600 font-semibold">{item.remainingQuantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showPagination && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
        />
      )}
      {!showPagination && data.length > 0 && (
        <div className="mt-4 text-sm text-muted-foreground text-center">
          Showing all {data.length} items
        </div>
      )}
    </div>
  );
};

