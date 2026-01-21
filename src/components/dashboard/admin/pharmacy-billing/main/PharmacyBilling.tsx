"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { CustomerInfo } from "../info";
import { CartTable } from "../table";
import { BillSummary } from "../summary";
import { BillAction } from "../action";
import { useCreateOrder } from "@/apis/orders/queries";
import { useMedicines } from "@/apis/medicines/queries";
import { IMedicineValues } from "@/interfaces/medicine.interface";
import { debounce } from "lodash";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";

// ---------- Types ----------
type MedicineItem = {
  medicineId: string;
  name: string;
  mrp: number;
  price: number;
  quantity: number;
  stockQuantity?: number; // Store original stock quantity
};

export type CustomerData = {
  name: string;
  phone: string;
  address?: string;
};

// ---------- Component ----------
export const PharmacyBilling = () => {
  const createOrderMutation = useCreateOrder();

  const [medicines, setMedicines] = useState<MedicineItem[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Optimized search: reduced limit from 50 to 20 for better performance
  // Only fetch when there's a search query (empty string won't trigger)
  const normalizedSearch = debouncedSearch.trim() || undefined;
  const { data } = useMedicines(normalizedSearch, 1, 20);
  const searchResults: IMedicineValues[] = useMemo(() => data?.data?.medicines ?? [], [data?.data?.medicines]);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setPopoverOpen(false);
      }
    };

    if (popoverOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popoverOpen]);

  // Optimized debounce: cleanup on unmount to prevent memory leaks
  const debouncedSet = useMemo(
    () => debounce((val: string) => setDebouncedSearch(val.trim()), 300),
    []
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSet.cancel();
    };
  }, [debouncedSet]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPopoverOpen(true);
    debouncedSet(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!popoverOpen || searchResults.length === 0) return;

    if (e.key === "ArrowDown") {
      setHighlightIndex((prev) => (prev + 1) % searchResults.length);
    } else if (e.key === "ArrowUp") {
      setHighlightIndex(
        (prev) => (prev - 1 + searchResults.length) % searchResults.length
      );
    } else if (e.key === "Enter") {
      const selected = searchResults[highlightIndex];
      if (selected) {
        handleAddMedicine(selected);
      }
    }
  };

  const handleAddMedicine = useCallback((medicine: IMedicineValues) => {
    // Check if stock is out
    if (medicine.quantity <= 0) {
      toast.error(`${medicine.name} is out of stock!`);
      return;
    }

    const medicineItem: MedicineItem = {
      medicineId: medicine._id ?? '',
      name: medicine.name,
      mrp: medicine.mrp,
      price: medicine.mrp,
      quantity: 1,
      stockQuantity: medicine.quantity,
    };

    setMedicines((prev) => {
      const existing = prev.find((m) => m.medicineId === medicineItem.medicineId);
      if (existing) {
        // Check if adding more would exceed stock
        const newQuantity = existing.quantity + 1;
        if (existing.stockQuantity !== undefined && newQuantity > existing.stockQuantity) {
          toast.error(`Cannot add more. Only ${existing.stockQuantity} units available for ${medicine.name}`);
          return prev;
        }
        return prev.map((m) =>
          m.medicineId === medicineItem.medicineId
            ? {
                ...m,
                quantity: newQuantity,
                price: m.mrp * newQuantity,
              }
            : m
        );
      } else {
        return [...prev, medicineItem];
      }
    });

    setSearch("");
    setPopoverOpen(false);
    setHighlightIndex(0);
  }, []);

  const addItem = (item: MedicineItem) => {
    // This function is kept for backward compatibility but should use handleAddMedicine instead
    setMedicines((prev) => {
      const existing = prev.find((m) => m.medicineId === item.medicineId);
      if (existing) {
        return prev.map((m) =>
          m.medicineId === item.medicineId
            ? {
                ...m,
                quantity: m.quantity + 1,
                price: m.mrp * (m.quantity + 1),
              }
            : m
        );
      } else {
        return [...prev, item];
      }
    });
  };

  const updateQuantity = (id: string, quantity: number, mrp?: number) => {
    setMedicines((prev) =>
      prev.map((m) => {
        if (m.medicineId === id) {
          // Check stock limit
          if (m.stockQuantity !== undefined && quantity > m.stockQuantity) {
            toast.error(`Cannot add more. Only ${m.stockQuantity} units available for ${m.name}`);
            return m;
          }
          return {
            ...m,
            quantity,
            mrp: mrp ?? m.mrp,
            price: (mrp ?? m.mrp) * quantity,
          };
        }
        return m;
      })
    );
  };

  // Soft delete - just remove from local state, not from database
  const removeItem = (id: string) => {
    setMedicines((prev) => prev.filter((m) => m.medicineId !== id));
    toast.success("Medicine removed from cart");
  };

  const [customer, setCustomer] = useState<CustomerData>({
    name: "",
    phone: "",
    address: "",
  });
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountFlat, setDiscountFlat] = useState(0);
  const [loading, setLoading] = useState(false);

  // Normalized discount handlers
  const handleDiscountPercentChange = (value: number) => {
    const normalized = isNaN(value) || value < 0 ? 0 : Math.min(100, Math.max(0, value));
    setDiscountPercent(normalized);
  };

  const handleDiscountFlatChange = (value: number) => {
    const normalized = isNaN(value) || value < 0 ? 0 : value;
    setDiscountFlat(normalized);
  };

  const subtotal = medicines.reduce(
    (sum, med) => sum + (med.price ?? med.mrp * med.quantity),
    0
  );
  const percentDiscount = (subtotal * discountPercent) / 100;
  const totalDiscount = percentDiscount + discountFlat;
  const grandTotal = Math.max(0, subtotal - totalDiscount);

  const handleClearBill = () => {
    setCustomer({ name: "", phone: "", address: "" });
    setDiscountPercent(0);
    setDiscountFlat(0);
    setMedicines([]);
  };

  const handlePrintBill = () => window.print();

 const handleGenerateBill = async () => {
  if (medicines.length === 0) return;
  setLoading(true);

  // Only include user if at least one field has a value
  const userData = (customer.name?.trim() || customer.phone?.trim()) 
    ? { 
        ...(customer.name?.trim() && { name: customer.name.trim() }),
        ...(customer.phone?.trim() && { phone: customer.phone.trim() })
      }
    : undefined;

  const payload = {
    ...(userData && { user: userData }),
    items: medicines.map((med) => ({
      medicineId: med.medicineId,
      quantity: med.quantity,
    })),
    discount: totalDiscount,
  };

  try {
    const res = await createOrderMutation.mutateAsync(payload);

    if (res.success) {
      alert("Bill generated successfully!");

      const invoiceUrl = res.data.invoiceUrl;

      // Force download properly
      const response = await fetch(invoiceUrl);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `invoice-${res.data.orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);

      handleClearBill();
    } else {
      alert("Failed to generate bill: " + res.message);
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong while generating the bill.");
  } finally {
    setLoading(false);
  }
};


  const handleUpdateQuantity = (
    id: string,
    updated: { quantity: number; price: number; mrp?: number }
  ) => {
    updateQuantity(id, updated.quantity, updated.mrp);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-3 lg:px-3">
        <div className="relative mb-4 w-full max-w-md" ref={searchContainerRef}>
          <Input
            placeholder="Search medicine..."
            value={search}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setPopoverOpen(true)}
          />
          {popoverOpen && searchResults.length > 0 && (
            <div className="absolute z-50 mt-1 w-full max-h-80 overflow-auto rounded-md border bg-white shadow-lg">
             {searchResults.map((med, idx) => {
                const isOutOfStock = med.quantity <= 0;
                const isHighlighted = idx === highlightIndex;
                return (
                  <div
                    key={med._id ?? idx}
                    className={`px-3 py-2 cursor-pointer border-b last:border-0 ${
                      isHighlighted ? "bg-blue-100" : isOutOfStock ? "bg-red-50 opacity-75" : "hover:bg-gray-50"
                    } ${isOutOfStock ? "cursor-not-allowed" : ""}`}
                    onClick={() => {
                      if (!med._id || isOutOfStock) {
                        if (isOutOfStock) {
                          toast.error(`${med.name} is out of stock!`);
                        }
                        return;
                      }
                      handleAddMedicine(med);
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium flex items-center gap-2">
                          {med.name}
                          {isOutOfStock && (
                            <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="text-sm text-gray-500">MRP: ৳ {med.mrp}</div>
                          {med.category && (
                            <div className="text-xs text-gray-400">• {med.category}</div>
                          )}
                          {med.manufacturer && (
                            <div className="text-xs text-gray-400">• {med.manufacturer}</div>
                          )}
                        </div>
                        {!isOutOfStock && (
                          <div className="text-xs text-green-600 mt-1">Stock: {med.quantity}</div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <CustomerInfo customer={customer} setCustomer={setCustomer} />
            <CartTable
              medicines={medicines}
              onRemove={removeItem}
              onUpdateQuantity={handleUpdateQuantity}
            />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              <BillSummary
                itemCount={medicines.length}
                subtotal={subtotal}
                discountPercent={discountPercent}
                discountFlat={discountFlat}
                totalDiscount={totalDiscount}
                grandTotal={grandTotal}
                onDiscountPercentChange={handleDiscountPercentChange}
                onDiscountFlatChange={handleDiscountFlatChange}
              />
              <BillAction
                onClear={handleClearBill}
                onPrint={handlePrintBill}
                onGenerate={handleGenerateBill}
                disabled={medicines.length === 0 || loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
