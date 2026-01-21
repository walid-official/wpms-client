"use client"

import { useLoggedInUser } from "@/apis/user"
import { Button } from "@/components/ui/button"
import { Stethoscope, ArrowRight, Sparkles, TrendingUp, Shield, Zap } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export const Hero = () => {
  const { data: user } = useLoggedInUser()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Determine the correct route based on user role
  const role = user?.data?.role
  let redirectUrl = "/signin"

  if (role === "ADMIN") {
    redirectUrl = "/admin/dashboard"
  } else if (role === "MANAGER") {
    redirectUrl = "/admin/sales-billing"
  }

  const features = [
    { icon: TrendingUp, text: "Real-time Analytics" },
    { icon: Shield, text: "Secure & Compliant" },
    { icon: Zap, text: "Lightning Fast" },
  ]

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50/30 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950/20 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center min-h-[95vh] py-20">
          {/* Content */}
          <div className={`space-y-10 text-center w-full transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="space-y-8">
              {/* Tagline with animation */}
              <div className="inline-flex justify-center items-center space-x-2 text-white bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 rounded-full text-sm sm:text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 animate-pulse" />
                <span>Healthcare Technology Leader</span>
              </div>

              {/* Heading with enhanced gradient */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold max-w-full sm:max-w-[85%] md:max-w-[75%] lg:max-w-[65%] mx-auto leading-tight">
                <span className="block">Talha</span>
                <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                  Pharmacy
                </span>
                <span className="block">Management</span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 text-pretty leading-relaxed py-4 max-w-full sm:max-w-2xl mx-auto font-medium">
                Transform your pharmacy operations with our comprehensive management platform. Ensure compliance,
                optimize workflows, and deliver exceptional patient care with cutting-edge technology.
              </p>

              {/* Feature badges */}
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <Icon className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{feature.text}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* CTA Buttons with enhanced styling */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href={redirectUrl}>
                <Button
                  size="lg"
                  className="group text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white cursor-pointer shadow-2xl hover:shadow-blue-500/50 flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 rounded-full font-semibold"
                >
                  Get Started
                  <ArrowRight className="ml-1 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
