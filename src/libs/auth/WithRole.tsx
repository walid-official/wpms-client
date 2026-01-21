"use client"

import React, { JSX, useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useLoggedInUser } from "@/apis/user"
import { useLogoutMutation } from "@/apis/auth"
import { toast } from "react-hot-toast"

export function withRole<P extends JSX.IntrinsicAttributes>(
  Component: React.ComponentType<P>,
  requiredRoles: string[]
) {
  return function WithRoleComponent(props: P) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const { isPending, error, data } = useLoggedInUser()
    const { mutate: logout } = useLogoutMutation()

    const userRole = data?.data?.role
    const currentPath =
      pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "")

    const hasRequiredRole = requiredRoles.includes(userRole ?? "")

    useEffect(() => {
      // Don’t run checks while data is still loading
      if (isPending) return

      // If user data fetch failed or no role after loading, redirect to login
      if (!userRole) {
        if (!isPending) {
          const redirectPath = `/signin?redirect=${encodeURIComponent(currentPath)}`
          toast.error("You must be logged in to access this page.")
          router.replace(redirectPath)
        }
        return
      }

      // If user exists but doesn’t have required role
      if (!hasRequiredRole) {
        toast.error("Access denied: insufficient permissions. Logging out...")
        logout(undefined, {
          onSuccess: () => {
            const redirectPath = `/signin?redirect=${encodeURIComponent(currentPath)}`
            router.replace(redirectPath)
          },
        })
      }
    }, [isPending, userRole, hasRequiredRole, logout, router, currentPath])

    // UI rendering states
    if (isPending) {
      return <div className="text-center text-3xl flex justify-center items-center min-h-[80vh]">Loading...</div>
    }

    if (!userRole) {
      return <div className="text-center py-10">Redirecting to login...</div>
    }

    if (!hasRequiredRole) {
      return <div className="text-center py-10">Logging out...</div>
    }

    return <Component {...props} />
  }
}