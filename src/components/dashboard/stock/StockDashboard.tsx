"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useInventoryReport } from "@/apis/inventory"
import { useExpiredMedicines } from "@/apis/medicines"
import { InventoryTable } from "./InventoryTable"
import { MedicineTable } from "../admin/adminPanel/table"
import { useDebounce } from "@/utils/debounce"
import { IMedicineValues } from "@/interfaces/medicine.interface"
import toast from "react-hot-toast"
import { useDeleteMedicine } from "@/apis/medicines"

type DateFilter = "daily" | "weekly" | "monthly" | "yearly" | "custom" | "all"
type TabType = "inventory" | "expired"

const toIsoDate = (d: Date) => d.toISOString().slice(0, 10)

export const StockDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("inventory")
  
  // Inventory Report State
  const [dateFilter, setDateFilter] = useState<DateFilter>("all")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [category, setCategory] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [inventoryPage, setInventoryPage] = useState(1)
  const [inventoryLimit] = useState(10) // Default limit for pagination
  const [sortBy, setSortBy] = useState<string>("soldQuantity")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // Expired Medicines State
  const [expiredFilter, setExpiredFilter] = useState<"expired" | "nearly" | "all">("expired")
  const [expiredPage, setExpiredPage] = useState(1)
  const [expiredLimit] = useState(10)
  const [expiredSearchQuery, setExpiredSearchQuery] = useState("")
  const [selectedMedicine, setSelectedMedicine] = useState<IMedicineValues | null>(null)

  // Debounce the search inputs
  const debouncedSearch = useDebounce(searchQuery, 500)
  const debouncedExpiredSearch = useDebounce(expiredSearchQuery, 500)

  // Mutations for expired medicines
  const deleteMutation = useDeleteMedicine()

  // Calculate date range based on filter
  useEffect(() => {
    if (dateFilter === "custom") {
      // Keep custom dates as is
      return
    }

    if (dateFilter === "all") {
      setStartDate("")
      setEndDate("")
      return
    }

    const now = new Date()
    let start: Date
    let end: Date = new Date(now)

    switch (dateFilter) {
      case "daily":
        start = new Date(now)
        start.setHours(0, 0, 0, 0)
        end.setHours(23, 59, 59, 999)
        break
      case "weekly":
        start = new Date(now)
        start.setDate(now.getDate() - 7)
        start.setHours(0, 0, 0, 0)
        end.setHours(23, 59, 59, 999)
        break
      case "monthly":
        start = new Date(now.getFullYear(), now.getMonth(), 1)
        start.setHours(0, 0, 0, 0)
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
        break
      case "yearly":
        start = new Date(now.getFullYear(), 0, 1)
        start.setHours(0, 0, 0, 0)
        end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999)
        break
      default:
        return
    }

    setStartDate(toIsoDate(start))
    setEndDate(toIsoDate(end))
  }, [dateFilter])

  

  // Build filters for Inventory API
  // When filtered (not "all"), fetch all data without pagination
  // When "all" is selected, use normal pagination
  const isFiltered = dateFilter !== "all"
  const inventoryFilters = {
    filter: isFiltered ? (dateFilter as "daily" | "weekly" | "monthly" | "yearly" | "custom") : undefined,
    start: dateFilter === "custom" && startDate ? startDate : isFiltered ? startDate : undefined,
    end: dateFilter === "custom" && endDate ? endDate : isFiltered ? endDate : undefined,
    medicineName: debouncedSearch || undefined,
    category: category || undefined,
    page: isFiltered ? 1 : inventoryPage, // When filtered, always use page 1
    limit: isFiltered ? 1000 : inventoryLimit, // When filtered, fetch all (1000), otherwise use normal limit
    sortBy,
    sortOrder,
  }

  console.log("inventoryFilters", inventoryFilters)

  // Fetch inventory report
  const { data: inventoryData, isLoading: inventoryLoading, isError: inventoryError } = useInventoryReport(inventoryFilters)
  const allInventoryItems = inventoryData?.data ?? []
  const inventoryTotalItems = inventoryData?.meta?.total ?? 0

  console.log("inventoryTotalItems", inventoryTotalItems)

  // Filter items: only show items with soldQuantity > 0 when date filter is active (not "all")
  // When "all" is selected, show all items regardless of soldQuantity
  const inventoryItems = isFiltered 
    ? allInventoryItems.filter((item) => item.soldQuantity > 0)
    : allInventoryItems
  
  // When filtered, use the filtered items count; otherwise use the API total
  const displayTotalItems = isFiltered ? inventoryItems.length : inventoryTotalItems

  // Fetch expired medicines
  const { data: expiredData, isLoading: expiredLoading, isError: expiredError } = useExpiredMedicines(expiredFilter, 30)
  const expiredMedicines = expiredData?.data?.medicines ?? []
  const expiredTotalItems = expiredData?.data?.total ?? 0

  // Filter expired medicines by search
  const filteredExpiredMedicines = expiredMedicines.filter((m) =>
    m.name.toLowerCase().includes(debouncedExpiredSearch.toLowerCase()) ||
    m.category?.toLowerCase().includes(debouncedExpiredSearch.toLowerCase()) ||
    m.manufacturer?.toLowerCase().includes(debouncedExpiredSearch.toLowerCase())
  )

  // Client-side pagination for expired medicines
  const expiredStartIndex = (expiredPage - 1) * expiredLimit
  const expiredEndIndex = expiredStartIndex + expiredLimit
  const paginatedExpiredMedicines = filteredExpiredMedicines.slice(expiredStartIndex, expiredEndIndex)
  const expiredTotalFiltered = filteredExpiredMedicines.length

  const handleDeleteClick = (e: React.MouseEvent, medicineId: string) => {
    e.stopPropagation()
    const medicine = expiredMedicines.find((m) => m._id === medicineId)
    if (!medicine) return
    deleteMutation.mutate(medicine._id ?? '', {
      onSuccess: () => toast.success("Medicine deleted successfully"),
      onError: () => toast.error("Failed to delete medicine"),
    })
  }

  return (
    <div className="max-w-7xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Stock Management</h1>

      {/* 🔹 Tabs */}
      <div className="flex items-center gap-4 mb-6 border-b">
        <Button
          variant={activeTab === "inventory" ? "default" : "ghost"}
          onClick={() => setActiveTab("inventory")}
          className="rounded-b-none"
        >
          Inventory Report
        </Button>
        <Button
          variant={activeTab === "expired" ? "default" : "ghost"}
          onClick={() => setActiveTab("expired")}
          className="rounded-b-none"
        >
          Expired Medicines
        </Button>
      </div>

      {/* 🔹 Inventory Report Tab */}
      {activeTab === "inventory" && (
        <>
          {/* Filters */}
          <div className="bg-white rounded-md shadow border p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Date Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Date Range</label>
                <Select
                  value={dateFilter}
                  onValueChange={(value) => {
                    setDateFilter(value as DateFilter)
                    setInventoryPage(1)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="daily">Today</SelectItem>
                    <SelectItem value="weekly">Last 7 Days</SelectItem>
                    <SelectItem value="monthly">This Month</SelectItem>
                    <SelectItem value="yearly">This Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Date Range */}
              {dateFilter === "custom" && (
                <>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Start Date</label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value)
                        setInventoryPage(1)
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">End Date</label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value)
                        setInventoryPage(1)
                      }}
                    />
                  </div>
                </>
              )}

              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Input
                  placeholder="Filter by category"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value)
                    setInventoryPage(1)
                  }}
                />
              </div>

              {/* Sort By */}
              <div>
                <label className="text-sm font-medium mb-2 block">Sort By</label>
                <Select
                  value={sortBy}
                  onValueChange={(value) => {
                    setSortBy(value)
                    setInventoryPage(1)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="soldQuantity">Sold Quantity</SelectItem>
                    <SelectItem value="remainingQuantity">Remaining Quantity</SelectItem>
                    <SelectItem value="totalQuantity">Total Quantity</SelectItem>
                    <SelectItem value="medicineName">Medicine Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="text-sm font-medium mb-2 block">Order</label>
                <Select
                  value={sortOrder}
                  onValueChange={(value) => {
                    setSortOrder(value as "asc" | "desc")
                    setInventoryPage(1)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Descending</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="grid grid-cols-1">
            <div>
              {inventoryError && <p className="text-red-500 mb-4">Failed to load inventory report.</p>}
              <InventoryTable
                data={inventoryItems}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isLoading={inventoryLoading}
                totalItems={displayTotalItems}
                itemsPerPage={isFiltered ? inventoryItems.length : inventoryLimit}
                currentPage={inventoryPage}
                onPageChange={setInventoryPage}
                showPagination={!isFiltered}
              />
            </div>
          </div>
        </>
      )}

      {/* 🔹 Expired Medicines Tab */}
      {activeTab === "expired" && (
        <>
          {/* Filter Buttons */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant={expiredFilter === "expired" ? "default" : "outline"}
              onClick={() => setExpiredFilter("expired")}
            >
              Expired
            </Button>
            <Button
              variant={expiredFilter === "nearly" ? "default" : "outline"}
              onClick={() => setExpiredFilter("nearly")}
            >
              Nearly Expired
            </Button>
            <Button
              variant={expiredFilter === "all" ? "default" : "outline"}
              onClick={() => setExpiredFilter("all")}
            >
              All
            </Button>
          </div>

          {/* Table Section */}
          <div className="grid grid-cols-1">
            <div>
              {expiredError && <p className="text-red-500 mb-4">Failed to load medicines.</p>}
              <MedicineTable
                medicines={paginatedExpiredMedicines}
                searchQuery={expiredSearchQuery}
                setSearchQuery={setExpiredSearchQuery}
                onRowClick={(m) => setSelectedMedicine(m)}
                onEdit={() => {}}
                onDelete={handleDeleteClick}
                isLoading={expiredLoading}
                totalItems={expiredTotalFiltered}
                itemsPerPage={expiredLimit}
                currentPage={expiredPage}
                onPageChange={setExpiredPage}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
