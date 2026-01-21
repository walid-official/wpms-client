"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Pill } from "lucide-react";
import { Input } from "@/components/ui/input";
import { IMedicineValues } from "@/interfaces/medicine.interface";
import { Pagination } from "@/components/dashboard/common";

interface MedicineTableProps {
  medicines: IMedicineValues[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onRowClick: (medicine: IMedicineValues) => void;
  onEdit: (e: React.MouseEvent, id: string) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
  isLoading?: boolean;
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const MedicineTableComponent: React.FC<MedicineTableProps> = ({
  medicines,
  searchQuery,
  setSearchQuery,
  onRowClick,
  onEdit,
  onDelete,
  isLoading,
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  // Server-side search is handled by the API, so we just display the medicines passed to us
  // Memoize to prevent unnecessary re-renders
  const filteredMedicines = React.useMemo(() => medicines, [medicines]);


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
          <div className="text-center py-4 text-muted-foreground">Loading medicines...</div>
        ) : filteredMedicines.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">No medicines found.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="p-2">Name</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Expiry</th>
                <th className="p-2">MRP</th>
                <th className="p-2">Price</th>
                <th className="p-2">Manufacturer</th>
                <th className="p-2">Batch</th>
                <th className="p-2">Category</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedicines.map((medicine) => {
                const expired = new Date(medicine.expiryDate) < new Date();
                return (
                  <tr
                    key={medicine._id}
                    className="border-b border-border hover:bg-muted/50 cursor-pointer"
                    onClick={() => onRowClick(medicine)}
                  >
                    <td className="p-2 font-medium">{medicine.name}</td>
                    <td className="p-2">{medicine.quantity}</td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        {new Date(medicine.expiryDate).toLocaleDateString("en-GB")}
                        {expired && <Badge variant="destructive" className="text-xs">Expired</Badge>}
                      </div>
                    </td>
                    <td className="p-2">{medicine.mrp ? `৳${medicine.mrp}` : "-"}</td>
                    <td className="p-2 text-green-600 font-semibold">{medicine.price ? `৳${medicine.price}` : "-"}</td>
                    <td className="p-2">{medicine.manufacturer || "-"}</td>
                    <td className="p-2">{medicine.batchNumber || "-"}</td>
                    <td className="p-2">{medicine.category || "-"}</td>
                    <td className="p-2">
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={(e) => onEdit(e, medicine._id ?? "")}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={(e) => onDelete(e, medicine._id ?? "")}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export const MedicineTable = React.memo(MedicineTableComponent);
