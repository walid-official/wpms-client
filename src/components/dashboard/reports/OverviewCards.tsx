"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TrendingUp,
  Package,
  Coins,
  Layers,
  ShoppingCart,
  Clock,
  AlertTriangle,
} from "lucide-react";

type Tone = "neutral" | "info" | "success" | "warning" | "danger";

const toneRing: Record<Tone, string> = {
  neutral:
    "ring-border hover:ring-muted-foreground/30 before:from-muted/40 before:to-transparent",
  info: "ring-sky-600/25 hover:ring-sky-600/40 before:from-sky-500/10 before:to-transparent",
  success:
    "ring-emerald-600/25 hover:ring-emerald-600/40 before:from-emerald-500/10 before:to-transparent",
  warning:
    "ring-amber-600/25 hover:ring-amber-600/40 before:from-amber-500/10 before:to-transparent",
  danger:
    "ring-rose-600/25 hover:ring-rose-600/40 before:from-rose-500/10 before:to-transparent",
};

const fmtInt = (n: number | undefined | null) =>
  new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(
    Number(n ?? 0)
  );

const fmtCurrency = (n: number | undefined | null) => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 0,
    }).format(Number(n ?? 0));
  } catch {
    return `৳${fmtInt(n ?? 0)}`;
  }
};

type StatCardProps = {
  title: string;
  value: React.ReactNode;
  hint?: string;
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  tone?: Tone;
  "aria-label"?: string;
};
const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  hint,
  Icon,
  tone = "neutral",
  ...aria
}) => {
  return (
    <Card
      className={`relative overflow-hidden transition-all ring-1 ${toneRing[tone]} hover:shadow-lg before:pointer-events-none before:absolute before:-top-24 before:-right-24 before:h-48 before:w-48 before:rounded-full before:bg-gradient-to-br`}
      {...aria}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-muted/60 backdrop-blur ring-1 ring-inset ring-border">
            <Icon className="h-5 w-5 opacity-80" aria-hidden="true" />
          </span>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold tracking-tight">{value}</div>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
};

interface OverviewCardsProps {
  cards: {
    totalSKUs: number;
    totalUnits: number;
    totalRevenue: number;
    totalKanaPrice: number;
    totalProfit: number;
    totalUnitsSold: number;
    nearlyExpiryCount: number;
    expiredCount: number;
  };
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({ cards }) => {
  const soldHint =
    Number(cards.totalUnitsSold ?? 0) === 0
      ? "No sales in this window"
      : "Total items sold in the selected period";

  const nearlyHint =
    Number(cards.nearlyExpiryCount ?? 0) === 0
      ? "No products nearing expiry in 90 days"
      : "Items nearing expiry soon";

  const expiredHint =
    Number(cards.expiredCount ?? 0) === 0
      ? "No expired items"
      : "Already expired items";

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-foreground mb-4">
        Overview Metrics
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total SKUs"
          value={fmtInt(cards.totalSKUs)}
          hint="Unique products in inventory"
          Icon={Layers}
          tone="info"
        />
        <StatCard
          title="Total Units"
          value={fmtInt(cards.totalUnits)}
          hint="Units across all SKUs"
          Icon={Package}
        />
        <StatCard
          title="Total Revenue"
          value={fmtCurrency(cards.totalRevenue)}
          hint="Gross revenue"
          Icon={Coins}
          tone="success"
        />
        {/* 🟢 New Kana Price Card */}
        <StatCard
          title="Total Kana Price"
          value={fmtCurrency(cards.totalKanaPrice)}
          hint="Total buying cost"
          Icon={Coins}
          tone="neutral"
        />
        <StatCard
          title="Total Profit"
          value={fmtCurrency(cards.totalProfit)}
          hint="Net profit (Revenue - Kana)"
          Icon={TrendingUp}
          tone="success"
        />
        <StatCard
          title="Total Items Sold"
          value={fmtInt(cards.totalUnitsSold)}
          hint={soldHint}
          Icon={ShoppingCart}
          tone="info"
        />
        <StatCard
          title="Nearly Expiring (90d)"
          value={fmtInt(cards.nearlyExpiryCount)}
          hint={nearlyHint}
          Icon={Clock}
          tone={Number(cards.nearlyExpiryCount ?? 0) > 0 ? "warning" : "neutral"}
        />
        <StatCard
          title="Expired Items"
          value={fmtInt(cards.expiredCount)}
          hint={expiredHint}
          Icon={AlertTriangle}
          tone={Number(cards.expiredCount ?? 0) > 0 ? "danger" : "neutral"}
        />
      </div>
    </section>
  );
};
