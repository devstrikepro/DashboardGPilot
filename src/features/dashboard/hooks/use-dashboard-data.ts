"use client";

import { useState, useEffect, useMemo } from "react";
import { AccountService } from "@/shared/services/account-service";
import { TradeHistoryService } from "@/shared/services/trade-history-service";
import { calculateEquityCurve } from "@/features/analytics/utils/performance-utils";
import type { AccountInfo, Deal } from "@/shared/types/api";

export function useDashboardData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [deals, setDeals] = useState<readonly Deal[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [accRes, historyRes] = await Promise.all([
          AccountService.getAccountInfo(),
          TradeHistoryService.getHistory()
        ]);

        if (accRes.success) {
          setAccount(accRes.data);
        } else {
          setError("Failed to fetch account information");
        }

        if (historyRes.success && historyRes.data) {
          setDeals(historyRes.data.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const equityData = useMemo(() => 
    calculateEquityCurve(deals).map(point => ({
      date: new Date(point.time).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }),
      equity: point.equity,
      balance: point.equity
    })), [deals]);

  const symbolStats = useMemo(() => {
    const stats: Record<string, { trades: number; wins: number; profit: number }> = {};

    deals.forEach((deal) => {
      if (deal.type === "BALANCE") return;
      
      const symbol = deal.symbol || "Unknown";
      if (!stats[symbol]) {
        stats[symbol] = { trades: 0, wins: 0, profit: 0 };
      }

      stats[symbol].trades += 1;
      stats[symbol].profit += deal.profit;
      if (deal.profit > 0) {
        stats[symbol].wins += 1;
      }
    });

    return Object.entries(stats)
      .map(([symbol, data]) => ({
        symbol,
        trades: data.trades,
        profit: data.profit,
        winRate: data.trades > 0 ? Math.round((data.wins / data.trades) * 100) : 0,
      }))
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 5);
  }, [deals]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: account?.currency || "USD",
    }).format(value);
  };

  return {
    loading,
    error,
    account,
    deals,
    equityData,
    symbolStats,
    formatCurrency,
  };
}
