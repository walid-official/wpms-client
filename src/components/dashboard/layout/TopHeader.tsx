"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, Settings, LogOut, Key, Eye, EyeOff } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { useLogoutMutation } from "@/apis/auth";
import { useLoggedInUser } from "@/apis/user";
import { useUpdatePassword } from "@/apis/user";

export const TopHeader = () => {
  const router = useRouter();
  const { mutate: logout } = useLogoutMutation();
  const { data: user } = useLoggedInUser();
  const { mutate: updatePassword, isPending } = useUpdatePassword();
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
          alert(error.message || "Failed to update password");
        },
      }
    );
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200 shadow-sm">
        <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Search medicines, customers, orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-slate-50 border-slate-200 focus:bg-white focus:border-teal-300 transition-colors"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-teal-500 rounded-full border-2 border-white" />
            </Button>

            {/* Settings */}
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <Settings className="h-5 w-5" />
            </Button>

            {/* Profile Dropdown */}
            {user?.data ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full hover:bg-slate-100"
                  >
                    <Avatar className="h-10 w-10 border-2 border-slate-200">
                      <AvatarImage
                        src={user?.data?.avatar || "/pharmacist-consultation.png"}
                        alt={user?.data?.name || "User"}
                      />
                      <AvatarFallback className="bg-teal-100 text-teal-700 font-semibold">
                        {user?.data?.name?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold text-slate-900">{user?.data?.name}</p>
                      <p className="text-xs text-slate-500">{user?.data?.email}</p>
                      {user?.data?.role && (
                        <p className="text-xs text-teal-600 font-medium mt-1">
                          {user.data.role}
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => setOpenModal(true)}
                    className="cursor-pointer flex items-center text-slate-700"
                  >
                    <Key className="mr-2 h-4 w-4" />
                    Change Password
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => router.push("/signin")}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Password Change Dialog */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Password</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Old Password</label>
              <div className="relative mt-1">
                <input
                  type={showOldPassword ? "text" : "password"}
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter old password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
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

            <div>
              <label className="text-sm font-medium text-slate-700">New Password</label>
              <div className="relative mt-1">
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
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
            <Button
              variant="outline"
              onClick={() => setOpenModal(false)}
              className="border-slate-300"
            >
              Cancel
            </Button>
            <Button
              disabled={isPending}
              onClick={handlePasswordSubmit}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              {isPending ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
