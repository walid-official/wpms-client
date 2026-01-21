"use client"

import { Button } from "@/components/ui/button"
import { FileText, Printer, Trash2 } from "lucide-react"

interface BillActionsProps {
  onClear: () => void
  onPrint: () => void
  onGenerate: () => void
  disabled?: boolean
}

export const BillAction = ({ onClear, onPrint, onGenerate, disabled = false }: BillActionsProps) => {
  return (
    <div className="flex flex-col gap-3">
      <Button onClick={onGenerate} disabled={disabled} size="lg" className="w-full cursor-pointer text-base font-semibold">
        <FileText className="mr-2 h-5 w-5" />
        Generate Bill
      </Button>

      <div className="grid grid-cols-2 gap-3">
        <Button className="cursor-pointer" onClick={onPrint} disabled={disabled} variant="outline" size="lg">
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
        <Button
          onClick={onClear}
          disabled={disabled}
          variant="outline"
          size="lg"
          className="text-destructive cursor-pointer hover:bg-destructive/10 hover:text-destructive bg-transparent"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear
        </Button>
      </div>
    </div>
  )
}
