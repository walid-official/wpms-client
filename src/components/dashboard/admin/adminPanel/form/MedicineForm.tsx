"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IMedicineValues } from "@/interfaces/medicine.interface";
import { medicineCategories } from "@/enums/medicine.enums";

type MedicineFormValues = IMedicineValues;

interface MedicineFormProps {
  defaultValues?: IMedicineValues;
  onSubmit: (data: MedicineFormValues) => Promise<void>;
}

export const MedicineForm: React.FC<MedicineFormProps> = ({ defaultValues, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(defaultValues?.category || "");

  // Convert expiryDate to YYYY-MM-DD format for date input
  const formatDateForInput = (dateString?: string): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      return date.toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<MedicineFormValues>({
    defaultValues: defaultValues
      ? {
          ...defaultValues,
          expiryDate: formatDateForInput(defaultValues.expiryDate),
        }
      : undefined,
    mode: "onChange", 
  });

  // Update form when defaultValues change (e.g., switching from create to edit)
  useEffect(() => {
    if (defaultValues) {
      reset({
        ...defaultValues,
        expiryDate: formatDateForInput(defaultValues.expiryDate),
      });
      setCategory(defaultValues.category || "");
    } else {
      reset({
        name: "",
        expiryDate: "",
        price: 0,
        mrp: 0,
        quantity: 0,
        strength: "",
        category: "",
        manufacturer: "",
        batchNumber: "",
      });
      setCategory("");
    }
  }, [defaultValues, reset]);

  const handleFormSubmit = async (values: MedicineFormValues) => {
    try {
      setLoading(true);
      await onSubmit({
        ...values,
        mrp: values.mrp ?? 0,
        category,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 min-w-[300px]">
      <h3 className="text-lg font-semibold">Required Fields</h3>
      <div className="grid gap-4">
        {/* Medicine Name */}
        <div>
          <Label className="mb-2">
            Medicine Name <span className="text-red-500">*</span>
          </Label>
          <Input {...register("name", { required: "Medicine name is required" })} placeholder="Paracetamol 500mg" />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        {/* Expiry Date */}
        <div>
          <Label className="mb-2">
            Expiry Date <span className="text-red-500">*</span>
          </Label>
          <Input type="date" {...register("expiryDate", { required: "Expiry date is required" })} />
          {errors.expiryDate && <p className="text-red-500 text-sm">{errors.expiryDate.message}</p>}
        </div>

        {/* Price */}
        <div>
          <Label className="mb-2">
            Price <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            step="0.01"
            {...register("price", {
              required: "Price is required",
              min: { value: 0, message: "Price must be positive" },
              valueAsNumber: true,
            })}
            placeholder="12.00"
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
        </div>

        {/* MRP */}
        <div>
          <Label className="mb-2">MRP</Label>
          <Input
            type="number"
            step="0.01"
            {...register("mrp", {
              min: { value: 0, message: "MRP must be positive" },
              setValueAs: (v) => (v === "" || v == null ? 0 : Number(v)),
            })}
            placeholder="15.00"
          />
        </div>

        {/* Quantity */}
        <div>
          <Label className="mb-2">
            Quantity <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            {...register("quantity", {
              required: "Quantity is required",
              min: { value: 1, message: "Quantity must be at least 1" },
              valueAsNumber: true,
            })}
            placeholder="100"
          />
          {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
        </div>

        
      </div>

      {/* Optional Fields */}
      <h3 className="text-lg font-semibold mt-6">Optional Fields</h3>
      <div className="grid gap-4">
        <div>
          <Label className="mb-2">Strength</Label>
          <Input {...register("strength")} placeholder="500mg" />
        </div>

        <div>
          <Label className="mb-2">
            Category <span className="text-red-500">*</span>
          </Label>
          <Select value={category} onValueChange={(v) => setCategory(v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {medicineCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
        </div>

        <div>
          <Label className="mb-2">Manufacturer</Label>
          <Input {...register("manufacturer")} placeholder="Square Pharma" />
        </div>

        <div>
          <Label className="mb-2">Batch Number</Label>
          <Input {...register("batchNumber")} placeholder="SQP2025A" />
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full bg-blue-600">
        {loading ? "Saving..." : defaultValues ? "Update Medicine" : "Add Medicine"}
      </Button>
    </form>
  );
};
