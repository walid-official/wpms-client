"use client"

import { TrendingUp, Users, Package, Award, Clock, Shield } from "lucide-react"
import { useEffect, useState } from "react"

const features = [
  {
    icon: TrendingUp,
    value: "99.9%",
    label: "Uptime",
    description: "Reliable service availability",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Users,
    value: "10K+",
    label: "Active Users",
    description: "Trusted by pharmacies worldwide",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: Package,
    value: "1M+",
    label: "Transactions",
    description: "Processed successfully",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Award,
    value: "4.9/5",
    label: "Rating",
    description: "Customer satisfaction",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Clock,
    value: "<1s",
    label: "Response Time",
    description: "Lightning fast performance",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Shield,
    value: "100%",
    label: "Secure",
    description: "Enterprise-grade security",
    gradient: "from-teal-500 to-blue-500",
  },
]

export const Features = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById("features-section")
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [])

  return (
    <section id="features-section" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-gray-50/50 to-background dark:via-gray-900/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-4">
            <span className="text-sm font-semibold tracking-[0.3em] text-blue-600 dark:text-blue-400 uppercase bg-blue-50 dark:bg-blue-950/30 px-4 py-2 rounded-full">
              Why Choose Us
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">
            Trusted by{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Thousands
            </span>{" "}
            of Pharmacies
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the power of modern pharmacy management with industry-leading features and reliability
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className={`group relative bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`} />
                
                <div className="relative z-10 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
                    {feature.value}
                  </div>
                  <div className="text-sm font-semibold text-foreground mb-1">{feature.label}</div>
                  <div className="text-xs text-muted-foreground">{feature.description}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

