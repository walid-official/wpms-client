"use client"

import type React from "react"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useSigninMutation } from "@/apis/auth"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

export const LoginForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const { mutate: signin, isPending } = useSigninMutation()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    signin(
      { email, password },
      {
        onSuccess: () => {
          toast.success("Login successful! 🎉")
          router.push("/")
        },
      }
    )
  }

  return (
    <div className="flex justify-center min-h-screen items-center">
      <Card className="w-full max-w-md mx-auto bg-white shadow-lg">
        <CardHeader className="text-center pb-3">
          {/* Logo Section */}
          <div className="flex justify-center gap-2 mb-4">
            <Image
              src="/logo/logo1.png"
              alt="Logo 1"
              width={50}
              height={50}
              className="object-contain"
            />
            <Image
              src="/logo/logo2.png"
              alt="Logo 2"
              width={50}
              height={50}
              className="object-contain"
            />
          </div>

          {/* Title */}
          <h1 className="text-xl font-semibold text-gray-900">
            Sign in to PharmaManage Pro
          </h1>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                required
              />
            </div>

            {/* Password Field with Show/Hide Toggle */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-blue-500 cursor-pointer hover:bg-blue-600 text-white font-medium py-2 mt-6"
            >
              {isPending ? "Signing in..." : "Login"}
            </Button>

            {/* Quick Login Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <Button
                type="button"
                variant="outline"
                className="w-full text-xs"
                onClick={() => {
                  setEmail("talha.medicin@gmail.com")
                  setPassword("Medicine@90")
                }}
              >
                Login as Admin
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full text-xs"
                onClick={() => {
                  setEmail("walid.official8@gmail.com")
                  setPassword("Medicin@90")
                }}
              >
                Login as Manager
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
