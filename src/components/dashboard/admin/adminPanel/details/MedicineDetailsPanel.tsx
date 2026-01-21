"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Pill,
  Calendar,
  Building2,
  Package,
  AlertTriangle,
  // Plus,
  // Minus,
  // XCircle,
  // ShoppingCart,
  Tag,
} from "lucide-react"
import { IMedicineValues } from "@/interfaces/medicine.interface"
// import { useDispatch } from "react-redux"
// import { addOrderItem, removeOrderItem } from "@/store/slices/orderSlice"

interface MedicineDetailsPanelProps {
  medicine: IMedicineValues | null
}

export const MedicineDetailsPanel: React.FC<MedicineDetailsPanelProps> = ({ medicine }) => {
  const [quantity, setQuantity] = useState(1)
  // const dispatch = useDispatch()
  // const handleIncrease = () => setQuantity((prev) => prev + 1)
  // const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  // const handleAddToOrder = () => {
  //   if (medicine?._id) {
  //     const mrp = medicine.mrp ?? 0
  //     const totalPrice = mrp * quantity

  //     dispatch(
  //       addOrderItem({
  //         medicineId: medicine._id,
  //         name: medicine.name,
  //         quantity,
  //         mrp,
  //         price: totalPrice,
  //       })
  //     )
  //     setQuantity(1)
  //   }
  // }

  // const handleRemove = () => {
  //   if (medicine?._id) {
  //     dispatch(removeOrderItem(medicine._id))
  //     setQuantity(1)
  //   }
  // }

  const isExpired = medicine?.expiryDate && new Date(medicine.expiryDate) < new Date()

  return (
    <Card className="sticky top-6 border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-white">
        <CardTitle className="text-xl flex items-center gap-2">
          <Pill className="h-5 w-5 text-blue-600" />
          Medicine Details
          {medicine && (
            <Badge 
              variant={medicine.quantity > 10 ? "default" : "destructive"} 
              className="ml-auto"
            >
              {medicine.quantity > 10 ? "In Stock" : "Low Stock"}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        {medicine ? (
          <div className="space-y-4">
            {/* Header Row - Horizontal Layout */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-gray-900 truncate">{medicine.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {medicine.category}
                  </Badge>
                  {isExpired && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Expired
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Stock & Price - Horizontal */}
              <div className="flex gap-4 text-right">
                <div className="bg-green-50 px-3 py-2 rounded-lg border">
                  <div className="text-xs text-green-600 font-medium">Stock</div>
                  <div className="text-lg font-bold text-green-700">{medicine.quantity}</div>
                </div>
                <div className="bg-blue-50 px-3 py-2 rounded-lg border">
                  <div className="text-xs text-blue-600 font-medium">MRP</div>
                  <div className="text-lg font-bold text-blue-700">৳{medicine.mrp?.toFixed(2) ?? "0.00"}</div>
                </div>
              </div>
            </div>

            {/* Details Grid - Horizontal Layout */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-orange-500" />
                  <span className="text-xs font-medium text-gray-600">Expiry</span>
                </div>
                <div className={`text-sm font-semibold ${isExpired ? 'text-red-600' : 'text-gray-900'}`}>
                  {new Date(medicine.expiryDate).toLocaleDateString("en-GB")}
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="h-4 w-4 text-purple-500" />
                  <span className="text-xs font-medium text-gray-600">Manufacturer</span>
                </div>
                <div className="text-sm font-semibold text-gray-900 truncate">
                  {medicine.manufacturer || "-"}
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border">
                <div className="flex items-center gap-2 mb-1">
                  <Package className="h-4 w-4 text-indigo-500" />
                  <span className="text-xs font-medium text-gray-600">Batch No.</span>
                </div>
                <div className="text-sm font-semibold text-gray-900 font-mono">
                  {medicine.batchNumber || "-"}
                </div>
              </div>
            </div>

            {/* Quantity & Actions - Horizontal Layout */}
            <div className="flex items-center justify-between gap-4 bg-gradient-to-r from-gray-50 to-white p-3 rounded-lg border">
              {/* <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center gap-2 bg-white border rounded-lg px-2 py-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleDecrease}
                    className="h-6 w-6 hover:bg-gray-100"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-lg font-bold text-gray-900 min-w-8 text-center">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleIncrease}
                    className="h-6 w-6 hover:bg-gray-100"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div> */}

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-gray-500">Total Amount</div>
                  <div className="text-lg font-bold text-green-600">
                    ৳{((medicine.mrp ?? 0) * quantity).toFixed(2)}
                  </div>
                </div>

                {/* <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={handleAddToOrder}
                    className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRemove}
                    className="border-red-300 cursor-pointer text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    Remove
                  </Button>
                </div> */}
              </div>
            </div>

            {/* Warning Message */}
            {isExpired && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <div>
                  <div className="text-red-800 font-semibold text-sm">Expired Medicine</div>
                  <div className="text-red-600 text-xs">
                    This medicine has expired and should not be sold to customers.
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Pill className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-700 mb-2">No Medicine Selected</h3>
            <p className="text-gray-500 text-sm">
              Select a medicine from the table to view detailed information
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}