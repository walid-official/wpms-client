"use client";
import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pill, Users, Plus } from "lucide-react";
import { MedicineTable } from "./table";
import { MedicineForm } from "./form/MedicineForm";
import {
  useMedicines,
  useUpdateMedicine,
  useDeleteMedicine,
  useCreateMedicine,
} from "@/apis/medicines";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { IMedicineValues } from "@/interfaces/medicine.interface";
import { useDebounce } from "@/utils/debounce";
import { MedicineDetailsPanel } from "./details";

export const AdminPanel = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  // Optimized debounce: reduced from 500ms to 300ms for faster response
  const debouncedSearch = useDebounce(searchQuery.trim(), 300);

  // Reset page to 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // Only fetch if debouncedSearch has value or is empty (to show all)
  const normalizedSearch = debouncedSearch || undefined;
  const { data, isLoading, isError } = useMedicines(normalizedSearch, page, limit);
  const medicines = data?.data?.medicines ?? [];
  const totalItems = data?.data?.total ?? 0;

  const createMutation = useCreateMedicine();
  const updateMutation = useUpdateMedicine();
  const deleteMutation = useDeleteMedicine();

  const [selectedMedicine, setSelectedMedicine] = useState<IMedicineValues | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [medicineToDelete, setMedicineToDelete] = useState<IMedicineValues | null>(null);

  const handleEdit = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const med = medicines.find((m) => m._id === id);
    setSelectedMedicine(med || null);
    setIsModalOpen(true);
  }, [medicines]);

  const handleDelete = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const med = medicines.find((m) => m._id === id);
    setMedicineToDelete(med || null);
    setDeleteModalOpen(true);
  }, [medicines]);

  const handleRowClick = useCallback((medicine: IMedicineValues) => {
    setSelectedMedicine(medicine);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!medicineToDelete?._id) return;
    await deleteMutation.mutateAsync(medicineToDelete._id, {
      onSuccess: () => {
        toast.success("Medicine deleted");
        if (page > 1 && medicines.length === 1) setPage(page - 1);
      },
    });
    setDeleteModalOpen(false);
  }, [medicineToDelete, deleteMutation, page, medicines.length]);

  const handleFormSubmit = useCallback(async (formData: IMedicineValues) => {
    try {
      if (selectedMedicine?._id) {
        await updateMutation.mutateAsync({ id: selectedMedicine._id, data: formData });
        toast.success("Medicine updated");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Medicine added");
        setPage(1);
      }
      setIsModalOpen(false);
      setSelectedMedicine(null);
    } catch {
      toast.error("Operation failed");
    }
  }, [selectedMedicine, createMutation, updateMutation, setPage]);

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <Button className="bg-blue-600 flex items-center gap-2"
          onClick={() => { setSelectedMedicine(null); setIsModalOpen(true); }}>
          <Plus className="h-4 w-4" /> Add Medicine
        </Button>
      </div>

       {/* Medicine Details */}
        <div>
          <div>
            {selectedMedicine ? (
              <MedicineDetailsPanel medicine={selectedMedicine} />
            ) : (
              <p className="text-muted-foreground">Select a medicine to see details.</p>
            )}
          </div>
        </div>

      {isError && <p className="text-red-500">Failed to load medicines.</p>}

      <MedicineTable
        medicines={medicines}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onRowClick={handleRowClick}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
        totalItems={totalItems}
        itemsPerPage={limit}
        currentPage={page}
        onPageChange={setPage}
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedMedicine ? "Update Medicine" : "Add New Medicine"}</DialogTitle>
          </DialogHeader>
          <MedicineForm defaultValues={selectedMedicine || undefined} onSubmit={handleFormSubmit} />
          <div className="mt-4 flex justify-end">
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Delete “{medicineToDelete?.name}”?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button className="bg-red-600" onClick={confirmDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
