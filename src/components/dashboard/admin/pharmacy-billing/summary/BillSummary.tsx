"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Receipt } from "lucide-react"

interface BillSummaryProps {
  itemCount: number
  subtotal: number
  discountPercent: number
  discountFlat: number
  totalDiscount: number
  grandTotal: number
  onDiscountPercentChange: (value: number) => void
  onDiscountFlatChange: (value: number) => void
}

export const BillSummary = ({
  itemCount,
  subtotal,
  discountPercent,
  discountFlat,
  totalDiscount,
  grandTotal,
  onDiscountPercentChange,
  onDiscountFlatChange,
}: BillSummaryProps) => {
  const handlePercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow empty string for clearing
    if (value === "") {
      onDiscountPercentChange(0)
      return
    }
    // Parse and validate the number
    const numValue = Number(value)
    if (!isNaN(numValue)) {
      // Clamp between 0 and 100
      const clampedValue = Math.max(0, Math.min(100, numValue))
      onDiscountPercentChange(clampedValue)
    }
  }

  const handleFlatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow empty string for clearing
    if (value === "") {
      onDiscountFlatChange(0)
      return
    }
    // Parse and validate the number
    const numValue = Number(value)
    if (!isNaN(numValue)) {
      // Ensure non-negative
      const clampedValue = Math.max(0, numValue)
      onDiscountFlatChange(clampedValue)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Receipt className="h-5 w-5 text-primary" />
          Current Bill Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items Count */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Items</span>
          <span className="text-sm font-medium text-primary">{itemCount}</span>
        </div>

        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Subtotal</span>
          <span className="text-sm font-semibold text-foreground">৳{subtotal.toFixed(2)}</span>
        </div>

        {/* Discount Section */}
        <div className="space-y-3 rounded-lg bg-muted/50 p-4">
          <div className="space-y-2">
            <Label htmlFor="discount-percent" className="text-xs font-medium">
              Discount (%)
            </Label>
            <Input
              id="discount-percent"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={discountPercent === 0 ? "" : discountPercent}
              onChange={handlePercentChange}
              onBlur={(e) => {
                // Normalize on blur - if empty, set to 0
                if (e.target.value === "") {
                  onDiscountPercentChange(0)
                }
              }}
              placeholder="0"
              className="h-9"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount-flat" className="text-xs font-medium">
              Discount (Flat)
            </Label>
            <Input
              id="discount-flat"
              type="number"
              min="0"
              step="0.01"
              value={discountFlat === 0 ? "" : discountFlat}
              onChange={handleFlatChange}
              onBlur={(e) => {
                // Normalize on blur - if empty, set to 0
                if (e.target.value === "") {
                  onDiscountFlatChange(0)
                }
              }}
              placeholder="0"
              className="h-9"
            />
          </div>

          {totalDiscount > 0 && (
            <div className="flex items-center justify-between border-t border-border pt-2">
              <span className="text-xs text-muted-foreground">Total Discount</span>
              <span className="text-sm font-medium text-destructive">-৳{totalDiscount.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Grand Total */}
        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="text-base font-semibold text-foreground">Grand Total</span>
          <span className="text-2xl font-bold text-primary">৳{grandTotal.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
