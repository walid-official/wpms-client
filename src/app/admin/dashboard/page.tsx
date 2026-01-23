"use client"

import React from "react"
import { DashboardCard } from "@/components/dashboard/admin/dashboard"
import { Settings, ShoppingCart, Package, BarChart3 } from "lucide-react"

import { ROLE } from "@/constants/role"
import { withRole } from "@/libs"

const DashboardPage = () => {
  const dashboardSections = [
    {
      title: "Admin Panel",
      description:
        "Manage medicines, users, suppliers, and manufacturers. Requires additional security.",
      icon: Settings,
      buttonText: "Go to Admin",
      buttonVariant: "default" as const,
      href: "/admin",
    },
    {
      title: "Sales & Billing",
      description:
        "Process sales, generate bills, and manage customer transactions.",
      icon: ShoppingCart,
      buttonText: "Start Selling",
      buttonVariant: "secondary" as const,
      href: "/admin/sales-billing",
    },
    {
      title: "Stock & Inventory",
      description:
        "Monitor medicine stock, manage inventory, and track low stock.",
      icon: Package,
      buttonText: "Manage Stock",
      buttonVariant: "secondary" as const,
      href: "/admin/stocks",
    },
    {
      title: "Reports & Analysis",
      description:
        "Generate sales, inventory, and profit reports with data visualizations.",
      icon: BarChart3,
      buttonText: "View Reports",
      buttonVariant: "secondary" as const,
      href: "/admin/reports",
    },
  ]

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">
          Manage your pharmacy operations efficiently
        </p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardSections.map((section, index) => (
          <DashboardCard
            key={section.title}
            title={section.title}
            description={section.description}
            icon={section.icon}
            buttonText={section.buttonText}
            buttonVariant={section.buttonVariant}
            delay={index * 100}
            href={section.href}
          />
        ))}
      </div>
    </div>
  )
}

export default withRole(DashboardPage, [ROLE.ADMIN, ROLE.MANAGER])
