"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const routeLabels: Record<string, string> = {
  "/admin": "Admin Panel",
  "/admin/dashboard": "Dashboard",
  "/admin/sales-billing": "Sales & Billing",
  "/admin/stocks": "Inventory",
  "/admin/reports": "Reports",
  "/admin/customers": "Customers",
  "/admin/suppliers": "Suppliers",
  "/admin/users": "Users",
  "/": "Home",
};

export const Breadcrumb = () => {
  const pathname = usePathname();

  const generateBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean);
    const breadcrumbs = [{ label: "Home", href: "/" }];

    let currentPath = "";
    paths.forEach((path) => {
      currentPath += `/${path}`;
      const label = routeLabels[currentPath] || path.charAt(0).toUpperCase() + path.slice(1);
      breadcrumbs.push({ label, href: currentPath });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center gap-2 text-sm text-slate-600 mb-4">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return (
          <div key={crumb.href} className="flex items-center gap-2">
            {index === 0 ? (
              <Link
                href={crumb.href}
                className={cn(
                  "flex items-center gap-1 hover:text-teal-600 transition-colors",
                  isLast && "text-slate-900 font-medium"
                )}
              >
                <Home className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <ChevronRight className="h-4 w-4 text-slate-400" />
                {isLast ? (
                  <span className="text-slate-900 font-medium">{crumb.label}</span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="hover:text-teal-600 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </>
            )}
          </div>
        );
      })}
    </nav>
  );
};
