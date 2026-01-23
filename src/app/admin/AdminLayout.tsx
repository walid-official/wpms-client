"use client";

import React from "react";
import { Sidebar, TopHeader, Breadcrumb } from "@/components/dashboard/layout";
import { cn } from "@/lib/utils";

export const AdminLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="lg:pl-64 transition-all duration-300">
        <TopHeader />
        <main className="p-4 lg:p-6 xl:p-8 min-h-[calc(100vh-4rem)]">
          <Breadcrumb />
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 lg:p-6 min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
