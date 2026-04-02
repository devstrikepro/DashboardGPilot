"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { AnalyticsService } from "@/shared/services/analytics-service";
import { TradeHistoryService } from "@/shared/services/trade-history-service";
import { HealthService } from "@/shared/services/health-service";
import { useApiHealth } from "@/shared/providers/api-health-provider";
import type { DashboardSummary, Deal } from "@/shared/types/api";

/**
 * useDashboardData
 * ดึง Dashboard Summary, Trades และ Health Check ขนานกันแบบ 3 เส้น
 */
export function useDashboardData() {
  const { isHealthy } = useApiHealth();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [deals, setDeals] = useState<readonly Deal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    if (!isHealthy) return;
    try {
      setLoading(true);
      setError(null);
      
      const [dashResponse, historyResponse, healthResponse] = await Promise.all([
        AnalyticsService.getDashboardSummary(),
        TradeHistoryService.getHistory(),
        HealthService.checkHealth()
      ]);

      if (healthResponse.success && healthResponse.data?.status === 'ok') {
        if (dashResponse.success && dashResponse.data) {
          setSummary(dashResponse.data);
        } else if (!dashResponse.success) {
          setError(dashResponse.error?.message ?? "Failed to fetch dashboard summary");
        }

        if (historyResponse.success && historyResponse.data) {
          setDeals(historyResponse.data);
        }
      } else {
        setError(healthResponse.error || "System health check failed. Cannot load dashboard data.");
        setSummary(null);
        setDeals([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }, [isHealthy]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  // Format equity curve สำหรับ chart
  const equityData = useMemo(() => {
    if (!summary) return [];
    return summary.equityCurve.map((point) => ({
      date: new Date(point.time).toLocaleDateString("en-US", { day: "2-digit", month: "short" }),
      time: point.time,
      equity: point.equity,
      balance: point.equity, 
    }));
  }, [summary]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  // คำนวณ Volume และ Trade Count จาก Backend BG Sync
  const tradesVolume = useMemo(() => {
    return deals.filter(d => ['BUY', 'SELL'].includes(d.type)).reduce((acc, d) => acc + d.volume, 0);
  }, [deals]);



  return {
    loading,
    error,
    account: { balance: summary?.balance ?? 0 },
    equityData,
    symbolStats: summary?.symbolStats?.list ?? [],
    recent: summary?.recent ?? [],
    volumeStats: {
      currentVolume: tradesVolume,
      targetVolume: Math.max(10, Math.round((summary?.balance ?? 10000) / 100)),
      tradeCount: summary?.symbolStats?.totaltrades ?? summary?.symbolStats?.totalTrades ?? 0,
    },
    profitToday: summary?.profitToday ?? 0,
    profitWeek: summary?.profitWeek ?? 0,
    profitMonth: summary?.profitMonth ?? 0,
    formatCurrency,
    refreshData: fetchSummary,
  };
}
