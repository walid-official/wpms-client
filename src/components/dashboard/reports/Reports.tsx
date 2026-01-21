"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSummaryReport } from "@/apis/reports";
import { SalesTrendItem, TopSellingItem } from "@/interfaces/reports.interface";
import { Charts } from "./Charts";
import { OrderReports } from "@/components/orders";
import { OverviewCards } from "./OverviewCards";

type QuickRange = "today" | "week" | "month" | "year" | "90days" | "custom";

const toIsoDate = (d: Date) => d.toISOString().slice(0, 10);

function startEndForQuickRange(r: QuickRange) {
  const now = new Date();
  const end = new Date(now);
  const start = new Date(now);
  switch (r) {
    case "today":
      break;
    case "week":
      start.setDate(now.getDate() - 7);
      break;
    case "month":
      start.setMonth(now.getMonth() - 1);
      break;
    case "year":
      start.setFullYear(now.getFullYear() - 1);
      break;
    default:
      start.setDate(now.getDate() - 90);
  }
  return { start: toIsoDate(start), end: toIsoDate(end) };
}

function formatPeriodLabel(period: string) {
  if (!period) return period;
  const [y, m] = period.split("-");
  if (!y || !m) return period;
  const month = new Date(Number(y), Number(m) - 1).toLocaleString("en", {
    month: "short",
  });
  return `${month} ${y}`;
}

export const Reports: React.FC = () => {
  const [quickRange, setQuickRange] = useState<QuickRange>("90days");
  const initial = startEndForQuickRange("90days");
  const [start, setStart] = useState(initial.start);
  const [end, setEnd] = useState(initial.end);
  const [groupBy, setGroupBy] = useState<"day" | "week" | "month">("month");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    if (quickRange !== "custom") {
      const { start: s, end: e } = startEndForQuickRange(quickRange);
      setStart(s);
      setEnd(e);
    }
  }, [quickRange]);

  const { data, isLoading, isError, error, refetch } = useSummaryReport({
    start,
    end,
    status,
    nearlyDays: 90,
    groupBy,
  });

  const cards = data?.cards ?? {
    totalSKUs: 0,
    totalUnits: 0,
    totalRevenue: 0,
    totalKanaPrice: 0,
    totalProfit: 0,
    totalUnitsSold: 0,
    nearlyExpiryCount: 0,
    expiredCount: 0,
  };

  const salesTrend = useMemo<SalesTrendItem[]>(() => {
    return (data?.charts?.salesTrend ?? []).map((item) => ({
      _id: item._id,
      period: item._id?.period ?? "",
      label: formatPeriodLabel(item._id?.period ?? ""),
      revenue: item.revenue ?? 0,
    }));
  }, [data]);

  const topMedicines = useMemo<TopSellingItem[]>(() => {
    return (data?.charts?.topSelling ?? []).map((m) => ({
      _id: m._id,
      name: m.name ?? "Unknown",
      category: m.category ?? "",
    }));
  }, [data]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <p>Loading report...</p>
      </div>
    );

  if (isError)
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <p className="text-destructive">
          Error loading report: {error?.message}
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-background rounded-lg">
      <div className="max-w-7xl mx-auto px-3">
        <header className="border-b border-border bg-card">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold text-foreground">
              Report & Analysis Panel
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Pharmaceutical Sales Dashboard
            </p>
          </div>
        </header>

        <main className="p-8">
          {/* Filters */}
          <section className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Quick Range Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {(["today", "week", "month", "year", "90days"] as QuickRange[]).map(
                  (r) => (
                    <button
                      key={r}
                      onClick={() => setQuickRange(r)}
                      className={`px-3 py-1 rounded-md text-sm border ${
                        quickRange === r
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card text-foreground border-border hover:bg-accent"
                      }`}
                    >
                      {r === "90days"
                        ? "90 Days"
                        : r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                  )
                )}
              </div>

              {/* Custom Date Picker */}
              <div className="flex items-center gap-3 flex-wrap">
                <label className="text-sm text-muted-foreground">Custom Range:</label>
                <input
                  type="date"
                  value={start}
                  onChange={(e) => {
                    setStart(e.target.value);
                    setQuickRange("custom");
                  }}
                  className="bg-card border border-border rounded px-2 py-1 text-sm"
                />
                <span className="text-muted-foreground">to</span>
                <input
                  type="date"
                  value={end}
                  onChange={(e) => {
                    setEnd(e.target.value);
                    setQuickRange("custom");
                  }}
                  className="bg-card border border-border rounded px-2 py-1 text-sm"
                />

              </div>
            </div>
          </section>

          {/* 🧩 Cards Section */}
          <OverviewCards cards={cards} />

          {/* 📊 Charts */}
          <Charts
            salesTrend={salesTrend}
            topMedicines={topMedicines}
            groupBy={groupBy}
          />

          {/* 🧾 Orders List */}
          <OrderReports filter="custom" start={start} end={end} />
        </main>
      </div>
    </div>
  );
};
