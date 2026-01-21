"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Phone, MapPin } from "lucide-react"
import { CustomerData } from "../main/PharmacyBilling"

interface CustomerInfoProps {
  customer: CustomerData
  setCustomer: (customer: CustomerData) => void
}

export const CustomerInfo = ({ customer, setCustomer }: CustomerInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="h-5 w-5 text-primary" />
          Customer Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="customer-name" className="text-sm font-medium">
              Customer Name
            </Label>
            <div className="relative">
              <Input
                id="customer-name"
                placeholder="Enter customer name"
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                className="pl-3"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone-number" className="text-sm font-medium">
              Phone Number
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="phone-number"
                placeholder="+1 234 567 8900"
                value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="address" className="text-sm font-medium">
              Address <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="address"
                placeholder="123 Pharmacy Lane, Health City"
                value={customer.address}
                onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}