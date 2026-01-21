"use client";

import { useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Trash2, Plus, Minus } from "lucide-react";
import { debounce } from "lodash";
import { useUpdateMedicineMRP } from "@/apis/medicines";

interface Medicine {
  medicineId: string;
  name: string;
  quantity: number;
  mrp: number;
  price?: number;
  stockQuantity?: number; // Original stock quantity
}

interface MedicineTableProps {
  medicines: Medicine[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (
    id: string,
    updated: { quantity: number; price: number; mrp?: number }
  ) => void;
}

export const CartTable = ({
  medicines,
  onRemove,
  onUpdateQuantity,
}: MedicineTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const updateMRP = useUpdateMedicineMRP();
  // Local state for input values to allow free typing
  const [quantityInputs, setQuantityInputs] = useState<Record<string, string>>({});
  const [mrpInputs, setMrpInputs] = useState<Record<string, string>>({});

  // Memoize filtered medicines to prevent unnecessary re-renders
  const filteredMedicines = useMemo(() => {
    if (!searchQuery.trim()) return medicines;
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return medicines.filter((m) => m.name.toLowerCase().includes(normalizedQuery));
  }, [medicines, searchQuery]);

  // Debounced MRP API update
  const debouncedUpdateMRP = useCallback(
    debounce((id: string, mrp: number) => {
      updateMRP.mutate({ id, mrp });
    }, 1000),
    [updateMRP] 
  );

  // Get display value for quantity input (use local state if exists, otherwise use medicine quantity)
  const getQuantityValue = (medicineId: string, currentQuantity: number) => {
    return quantityInputs[medicineId] !== undefined 
      ? quantityInputs[medicineId] 
      : currentQuantity.toString();
  };

  // Get display value for MRP input (use local state if exists, otherwise use medicine MRP)
  const getMrpValue = (medicineId: string, currentMrp: number) => {
    return mrpInputs[medicineId] !== undefined 
      ? mrpInputs[medicineId] 
      : currentMrp.toString();
  };

  // Handle quantity input change - allow free typing
  const handleQuantityInputChange = (medicine: Medicine, value: string) => {
    setQuantityInputs(prev => ({ ...prev, [medicine.medicineId]: value }));
  };

  // Handle quantity input blur - validate and update
  const handleQuantityInputBlur = (medicine: Medicine, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 1) {
      const newPrice = medicine.mrp * numValue;
      onUpdateQuantity(medicine.medicineId, {
        quantity: numValue,
        price: newPrice,
        mrp: medicine.mrp,
      });
      // Clear local state to use the actual value
      setQuantityInputs(prev => {
        const newState = { ...prev };
        delete newState[medicine.medicineId];
        return newState;
      });
    } else {
      // Invalid input, revert to current quantity
      setQuantityInputs(prev => {
        const newState = { ...prev };
        delete newState[medicine.medicineId];
        return newState;
      });
    }
  };

  // Quantity change via buttons
  const handleQuantityChange = (medicine: Medicine, newQty: number) => {
    if (newQty < 1) return;
    const newPrice = medicine.mrp * newQty;
    onUpdateQuantity(medicine.medicineId, {
      quantity: newQty,
      price: newPrice,
      mrp: medicine.mrp,
    });
    // Clear local state
    setQuantityInputs(prev => {
      const newState = { ...prev };
      delete newState[medicine.medicineId];
      return newState;
    });
  };

  // Handle MRP input change - allow free typing
  const handleMrpInputChange = (medicine: Medicine, value: string) => {
    setMrpInputs(prev => ({ ...prev, [medicine.medicineId]: value }));
  };

  // Handle MRP input blur - validate and update
  const handleMrpInputBlur = (medicine: Medicine, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      const newPrice = numValue * medicine.quantity;
      onUpdateQuantity(medicine.medicineId, {
        quantity: medicine.quantity,
        price: newPrice,
        mrp: numValue,
      });
      // Call debounced API
      debouncedUpdateMRP(medicine.medicineId, numValue);
      // Clear local state
      setMrpInputs(prev => {
        const newState = { ...prev };
        delete newState[medicine.medicineId];
        return newState;
      });
    } else {
      // Invalid input, revert to current MRP
      setMrpInputs(prev => {
        const newState = { ...prev };
        delete newState[medicine.medicineId];
        return newState;
      });
    }
  };

  // MRP change via buttons
  const handleMrpChange = (medicine: Medicine, newMrp: number) => {
    if (newMrp < 0) return;
    const newPrice = newMrp * medicine.quantity;

    // Update UI first
    onUpdateQuantity(medicine.medicineId, {
      quantity: medicine.quantity,
      price: newPrice,
      mrp: newMrp,
    });

    // Call debounced API
    debouncedUpdateMRP(medicine.medicineId, newMrp);
    
    // Clear local state
    setMrpInputs(prev => {
      const newState = { ...prev };
      delete newState[medicine.medicineId];
      return newState;
    });
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Added Medicines</CardTitle>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by medicine name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Medicine</th>
                <th className="pb-3 text-center text-sm font-medium text-muted-foreground">Qty</th>
                <th className="pb-3 text-center text-sm font-medium text-muted-foreground">MRP</th>
                <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Total</th>
                <th className="pb-3 text-center text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredMedicines.map((medicine) => {
                const isOutOfStock = medicine.stockQuantity !== undefined && medicine.stockQuantity <= 0;
                return (
                  <tr 
                    key={medicine.medicineId} 
                    className={`border-b border-border last:border-0 ${isOutOfStock ? "bg-red-50" : ""}`}
                  >
                    <td className="py-4 text-sm font-medium text-foreground">
                      <div className="flex items-center gap-2">
                        {medicine.name}
                        {isOutOfStock && (
                          <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                        )}
                      </div>
                    </td>

                  {/* Quantity */}
                  <td className="py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => handleQuantityChange(medicine, medicine.quantity - 1)} disabled={medicine.quantity <= 1}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input 
                        type="text" 
                        inputMode="numeric"
                        className="w-14 text-center" 
                        value={getQuantityValue(medicine.medicineId, medicine.quantity)}
                        onChange={(e) => handleQuantityInputChange(medicine, e.target.value)}
                        onBlur={(e) => handleQuantityInputBlur(medicine, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.currentTarget.blur();
                          }
                        }}
                      />
                      <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => handleQuantityChange(medicine, medicine.quantity + 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>

                  {/* MRP */}
                  <td className="py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => handleMrpChange(medicine, medicine.mrp - 1)} disabled={medicine.mrp <= 0}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        type="text"
                        inputMode="numeric"
                        className="w-16 text-center"
                        value={getMrpValue(medicine.medicineId, medicine.mrp)}
                        onChange={(e) => handleMrpInputChange(medicine, e.target.value)}
                        onBlur={(e) => handleMrpInputBlur(medicine, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.currentTarget.blur();
                          }
                        }}
                      />
                      <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => handleMrpChange(medicine, medicine.mrp + 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>

                  {/* Total */}
                  <td className="py-4 text-right text-sm font-semibold text-primary">
                    ৳{(medicine.price ?? medicine.mrp * medicine.quantity).toFixed(2)}
                  </td>

                  {/* Remove */}
                  <td className="py-4 text-center">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive" 
                      onClick={() => onRemove(medicine.medicineId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
          {filteredMedicines.length === 0 && <div className="py-12 text-center"><p className="text-sm text-muted-foreground">No medicines found.</p></div>}
        </div>
      </CardContent>
    </Card>
  );
};
