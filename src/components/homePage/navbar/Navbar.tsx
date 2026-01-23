"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Activity,
  BarChart3,
  Package,
  ShoppingCart,
  LogOut,
  Settings,
  Home,
  Menu,
  X,
  Key,
  EyeOff,
  Eye,
} from "lucide-react";

import { useLogoutMutation } from "@/apis/auth";
import { useLoggedInUser } from "@/apis/user";
import { useUpdatePassword } from "@/apis/user";

const navigationItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Dashboard", href: "/admin/dashboard", icon: Activity },
  { name: "Admin Panel", href: "/admin", icon: Settings },
  { name: "Sales/Billing", href: "/admin/sales-billing", icon: ShoppingCart },
  { name: "Stock/Inventory", href: "/admin/stocks", icon: Package },
  { name: "Reports", href: "/admin/reports", icon: BarChart3 },
];

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const { mutate: logout } = useLogoutMutation();
  const { data: user } = useLoggedInUser();
  const { mutate: updatePassword, isPending } = useUpdatePassword();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch by only accessing user data after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const role = isMounted ? user?.data?.role : undefined;

  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
const [showOldPassword, setShowOldPassword] = useState(false);
const [showNewPassword, setShowNewPassword] = useState(false);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => router.push("/signin"),
    });
  };

  const handlePasswordSubmit = () => {
    updatePassword(
      {
        userId: user?.data?._id,
        oldPassword,
        newPassword,
      },
      {
        onSuccess: () => {
          setOpenModal(false);
          setOldPassword("");
          setNewPassword("");
          alert("Password updated successfully!");
        },
        onError: (err: unknown) => {
          const error = err as Error;
          alert(error.message || 'Failed to update password');
        },
      }
    );
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="bg-background border-b border-border shadow-sm py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Image src="/logo/logo1.png" alt="Logo 1" width={40} height={40} />
              <Image src="/logo/logo2.png" alt="Logo 2" width={40} height={40} />
            </div>

            {/* Desktop Navigation - Only show if user is logged in */}
            {user?.data && role !== "MANAGER" && (
              <div className="hidden md:flex items-center space-x-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeItem === item.name;

                  return (
                    <Link key={item.name} href={item.href} onClick={() => setActiveItem(item.name)}>
                      <Button
                        variant="ghost"
                        className={`flex items-center cursor-pointer space-x-2 px-4 py-2 transition-colors ${
                          isActive
                            ? "bg-blue-500 text-white"
                            : "text-black hover:bg-blue-100"
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-black"}`} />
                        <span className="font-medium">{item.name}</span>
                      </Button>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {user?.data && role === "MANAGER" && (
                <Link href="/admin/sales-billing">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2">
                    Sales & Billing
                  </Button>
                </Link>
              )}

              {/* Mobile Menu - Only show if user is logged in */}
              {user?.data && role !== "MANAGER" && (
                <div className="md:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  >
                    {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </Button>
                </div>
              )}

              {/* Profile Dropdown */}
              {user?.data ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user?.data?.avatar || "/pharmacist-consultation.png"}
                          alt={user?.data?.name || "User"}
                        />
                        <AvatarFallback>{user?.data?.name?.[0] || "U"}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user?.data?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.data?.email}</p>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    {/* NEW CHANGE PASSWORD BUTTON */}
                    <DropdownMenuItem
                      onClick={() => setOpenModal(true)}
                      className="cursor-pointer flex items-center"
                    >
                      <Key className="mr-2 h-4 w-4" />
                      Change Password
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      className="text-destructive cursor-pointer"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/signin">
                  <button className="px-4 py-2 bg-blue-500 font-medium text-white rounded-md">
                    Login
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>


      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Password</DialogTitle>
          </DialogHeader>

          {/* Password Fields */}
          <div className="space-y-4">
            {/* Old Password */}
            <div>
              <label className="text-sm font-medium">Old Password</label>

              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  className="w-full mt-1 border px-3 py-2 rounded-md pr-10"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />

                {/* Toggle Icon */}
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                >
                  {showOldPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="text-sm font-medium">New Password</label>

              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="w-full mt-1 border px-3 py-2 rounded-md pr-10"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                {/* Toggle Icon */}
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
            <Button disabled={isPending} onClick={handlePasswordSubmit}>
              {isPending ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
