"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Lock, Zap, FileText, Sparkles } from "lucide-react"
import { useState } from "react"

export const UsageGuidelines = () => {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)

  const guidelines = [
    {
      step: 1,
      title: "Authentication",
      description: "Login with your admin credentials to access the system",
      icon: Lock,
      gradient: "from-blue-500 to-cyan-500",
      details: [
        "Enter your registered email or username",
        "Use secure password",
        "You'll be redirected to the homepage",
      ],
    },
    {
      step: 2,
      title: "Dashboard Overview",
      description: "Access the main dashboard with Get Started button",
      icon: Zap,
      gradient: "from-indigo-500 to-purple-500",
      details: [
        "Click the 'Get Started' button on homepage",
        "Four main modules available",
        "Navigate based on your requirements",
      ],
    },
    {
      step: 3,
      title: "Module Operations",
      description: "Manage your pharmacy operations efficiently",
      icon: FileText,
      gradient: "from-green-500 to-emerald-500",
      details: [
        "Admin Panel: Add, search, update, and delete medicines",
        "Sales/Billing: Sell products with discounts and generate invoices",
        "Stocks/Inventory: Monitor all medicine stocks",
        "Reports: View and filter data by date",
      ],
    },
    {
      step: 4,
      title: "Generate Bills",
      description: "Complete the billing process and print invoices",
      icon: CheckCircle2,
      gradient: "from-orange-500 to-red-500",
      details: [
        "Add customer name and mobile number",
        "Click 'Generate Bill' to create invoice",
        "Print or download the PDF invoice",
      ],
    },
  ]

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50/50 dark:from-gray-900/50 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <span className="text-sm font-semibold tracking-[0.3em] text-blue-600 dark:text-blue-400 uppercase bg-blue-50 dark:bg-blue-950/30 px-4 py-2 rounded-full">
              Quick Start Guide
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">
            Get Started in{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              4 Simple Steps
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Follow these steps to efficiently manage your pharmacy operations and unlock the full potential of our platform
          </p>
        </div>

        {/* Cards with connecting line */}
        <div className="relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-indigo-200 via-green-200 to-orange-200 dark:from-blue-800 dark:via-indigo-800 dark:via-green-800 dark:to-orange-800" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
            {guidelines.map((guideline, index) => {
              const Icon = guideline.icon
              const isHovered = hoveredStep === guideline.step
              
              return (
                <div key={index} className="relative">
                  {/* Step number badge */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20 lg:relative lg:top-0 lg:left-0 lg:transform-none lg:mb-4 lg:flex lg:justify-center">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${guideline.gradient} text-white flex items-center justify-center font-bold text-lg shadow-lg ${isHovered ? 'scale-110 ring-4 ring-blue-200 dark:ring-blue-800' : ''} transition-all duration-300`}>
                      {guideline.step}
                    </div>
                  </div>
                  
                  <Card
                    className={`group relative border-2 bg-white dark:bg-gray-900 shadow-xl hover:shadow-2xl transition-all duration-500 h-full ${
                      isHovered ? "border-blue-500 scale-105" : "border-transparent"
                    }`}
                    onMouseEnter={() => setHoveredStep(guideline.step)}
                    onMouseLeave={() => setHoveredStep(null)}
                  >
                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${guideline.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-lg`} />
                    
                    <CardHeader className="relative z-10 pt-8 lg:pt-4">
                      <div className="flex flex-col items-center text-center gap-3 mb-4">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${guideline.gradient} text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                          <Icon className="w-8 h-8" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {guideline.title}
                          </CardTitle>
                          <CardDescription className="text-sm leading-relaxed">
                            {guideline.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <ul className="space-y-3">
                        {guideline.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-foreground/90">
                            <CheckCircle2 className={`w-5 h-5 mt-0.5 flex-shrink-0 text-green-500 ${isHovered ? 'scale-110' : ''} transition-transform`} />
                            <span className="leading-relaxed">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>

        {/* Pro Tip */}
        <div className="mt-16 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 border-blue-200 dark:border-blue-800 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground mb-2">💡 Pro Tip</p>
              <p className="text-sm text-foreground/80 leading-relaxed">
                For faster operation, use the search functionality in Admin Panel and Sales modules. Master the discount and quantity adjustment
                features to optimize your billing process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
