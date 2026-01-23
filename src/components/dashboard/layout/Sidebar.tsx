"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Activity,
  BarChart3,
  Package,
  ShoppingCart,
  Settings,
  Users,
  UserCircle,
  Truck,
  FileText,
  Home,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLoggedInUser } from "@/apis/user";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navigationSections: NavSection[] = [
  {
    title: "Main",
    items: [
      { name: "Dashboard", href: "/admin/dashboard", icon: Activity },
      { name: "Home", href: "/", icon: Home },
    ],
  },
  {
    title: "Operations",
    items: [
      { name: "Sales & Billing", href: "/admin/sales-billing", icon: ShoppingCart },
      { name: "Inventory", href: "/admin/stocks", icon: Package },
    ],
  },
  {
    title: "Management",
    items: [
      { name: "Admin Panel", href: "/admin", icon: Settings },
      { name: "Customers", href: "/admin/customers", icon: UserCircle },
      // { name: "Suppliers", href: "/admin/suppliers", icon: Truck },
      // { name: "Users", href: "/admin/users", icon: Users },
    ],
  },
  {
    title: "Analytics",
    items: [
      { name: "Reports", href: "/admin/reports", icon: BarChart3 },
    ],
  },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["Main", "Operations", "Management", "Analytics"])
  );
  const [isMounted, setIsMounted] = useState(false);
  const { data: user } = useLoggedInUser();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const role = isMounted ? user?.data?.role : undefined;

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") {
      return pathname === "/admin/dashboard";
    }
    if (href === "/admin") {
      return pathname === "/admin" || pathname === "/admin/";
    }
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href + "/") || pathname === href;
  };

  // Filter navigation based on role
  const getFilteredSections = () => {
    if (role === "MANAGER") {
      return navigationSections
        .map((section) => {
          if (section.title === "Main") {
            return {
              ...section,
              items: section.items.filter((item) => item.href === "/"),
            };
          }
          if (section.title === "Operations") {
            return {
              ...section,
              items: section.items.filter((item) => item.name === "Sales & Billing"),
            };
          }
          // Hide Management and Analytics sections for MANAGER role
          return null;
        })
        .filter((section): section is NavSection => section !== null);
    }
    return navigationSections;
  };

  const filteredSections = getFilteredSections();

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="bg-white shadow-md border border-slate-200"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Image src="/logo/logo1.png" alt="Logo 1" width={32} height={32} className="object-contain" />
              <Image src="/logo/logo2.png" alt="Logo 2" width={32} height={32} className="object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-900">Pharmacy</span>
              <span className="text-xs text-slate-500">Management</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {filteredSections.map((section) => (
              <div key={section.title} className="mb-6">
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-700 transition-colors"
                >
                  <span>{section.title}</span>
                  {expandedSections.has(section.title) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>

                {expandedSections.has(section.title) && (
                  <div className="mt-1 space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);

                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsMobileOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                            "hover:bg-slate-50 hover:text-slate-900",
                            active
                              ? "bg-teal-50 text-teal-700 border-l-4 border-teal-500 shadow-sm"
                              : "text-slate-600"
                          )}
                        >
                          <Icon
                            className={cn(
                              "h-5 w-5 flex-shrink-0",
                              active ? "text-teal-600" : "text-slate-400"
                            )}
                          />
                          <span className="flex-1">{item.name}</span>
                          {item.badge && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-teal-100 text-teal-700 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* User Info Footer */}
          {user?.data && (
            <div className="px-4 py-4 border-t border-slate-200">
              <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-slate-50">
                <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
                  <span className="text-sm font-semibold text-teal-700">
                    {user.data.name?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{user.data.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user.data.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
