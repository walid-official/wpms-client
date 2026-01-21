"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface DashboardCardProps {
  title: string
  description: string
  icon: LucideIcon
  buttonText: string
  buttonVariant?: "default" | "secondary" | "outline" | "ghost"
  delay?: number
  href: string
}

export const DashboardCard = ({
  title,
  description,
  icon: Icon,
  buttonText,
  delay = 0,
  href,
}: DashboardCardProps) => {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        "border-border/50 hover:border-primary/20 bg-card/50 backdrop-blur-sm",
      )}
      style={{
        animationDelay: `${delay}ms`,
        animation: "fadeInUp 0.6s ease-out forwards",
      }}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-lg transition-colors",
              "bg-primary/10 text-primary group-hover:bg-blue-400 group-hover:text-primary-foreground",
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl font-semibold text-balance">{title}</CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="min-h-[70px]">
          <CardDescription className="text-sm leading-relaxed text-pretty">
            {description}
          </CardDescription>
        </div>

        <Link href={href}>
          <button className="bg-blue-400 rounded-md px-7 py-2 text-white cursor-pointer w-full">
            {buttonText}
          </button>
        </Link>
      </CardContent>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Card>
  )
}
