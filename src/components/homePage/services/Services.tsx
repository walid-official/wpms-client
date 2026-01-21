"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, ShieldCheck, ShoppingCart, Stethoscope, ArrowRight } from "lucide-react"
import { useState } from "react"

const services = [
  {
    title: "Inventory Pulse",
    description: "Track stock, expiry, and supplier performance in one dashboard.",
    icon: LineChart,
    stats: ["Live stock health", "Expiry radar", "Procurement insights"],
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
  },
  {
    title: "Operational Billing",
    description: "Faster checkout with built-in discount control and branded invoices.",
    icon: ShoppingCart,
    stats: ["Smart POS", "Discount guardrails", "Auto invoice emails"],
    gradient: "from-indigo-500 to-purple-500",
    bgGradient: "from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20",
  },
  {
    title: "Security & Compliance",
    description: "Role-based access, audit-ready logs, and encrypted infrastructure.",
    icon: ShieldCheck,
    stats: ["Access policies", "Activity insights", "Data security"],
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
  },
  {
    title: "Clinical Context",
    description: "Reference data and interaction alerts to support pharmacists.",
    icon: Stethoscope,
    stats: ["Medicine guide", "Interaction alerts", "Dosage checks"],
    gradient: "from-red-500 to-pink-500",
    bgGradient: "from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20",
  },
]

export const Services = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-gray-50/50 dark:to-gray-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 text-center mb-16">
          <div className="inline-flex items-center justify-center">
            <span className="text-sm font-semibold tracking-[0.3em] text-blue-600 dark:text-blue-400 uppercase bg-blue-50 dark:bg-blue-950/30 px-4 py-2 rounded-full">
              Our Services
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mt-4">
            A focused toolkit for{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              modern pharmacy
            </span>{" "}
            teams
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4">
            From inventory intelligence to clinical guardrails, each module is crafted to shorten your workflow
            and elevate patient trust.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {services.map((service, index) => {
            const Icon = service.icon
            const isHovered = hoveredIndex === index
            return (
              <Card
                key={service.title}
                className={`group relative border-2 border-transparent bg-white dark:bg-gray-900 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden ${
                  isHovered ? "scale-105 border-blue-500/50" : ""
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Gradient background overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />
                
                {/* Animated border gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`}
                />

                <CardHeader className="relative z-10 flex flex-col gap-4 pb-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.gradient} text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {service.title}
                      </CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        {service.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <ul className="flex flex-wrap gap-2 mb-4">
                    {service.stats.map((stat, idx) => (
                      <li
                        key={idx}
                        className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-foreground/90 text-sm font-medium group-hover:bg-white/80 dark:group-hover:bg-gray-700/80 transition-colors shadow-sm"
                      >
                        {stat}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300 cursor-pointer">
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
