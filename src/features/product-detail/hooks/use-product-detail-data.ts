"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnalyticsService } from "@/shared/services/analytics-service";
import { useApiHealth } from "@/shared/providers/api-health-provider";
import type { ProductDetail } from "@/shared/types/api";

/**
 * useProductDetailData
 * ดึง Product Detail โดยใช้ TanStack Query เพื่อรองรับ Caching และ Revalidation
 */
export function useProductDetailData(serviceBase?: string, initialData?: ProductDetail | null) {
  const { isHealthy } = useApiHealth();

  const { 
    data: summary, 
    isLoading: loading, 
    error: queryError,
    refetch: refreshData,
  } = useQuery({
    queryKey: ["product-detail", serviceBase],
    initialData: initialData || undefined, // ใช้ข้อมูลจาก Server ถ้ามี
    queryFn: async () => {
      const response = await AnalyticsService.getProductDetail(undefined, serviceBase);

      if (!response.success || !response.data) {
        throw new Error(response.error?.message ?? "Failed to fetch product detail");
      }

      return response.data;
    },
    enabled: true, // ปรับให้ดึงข้อมูลเสมอ ไม่รอสถานะ Health เพื่อแก้ปัญหาตอนเปลี่ยนหน้า
    // SCALE OPTIMIZATION: Keep data fresh for 1 minute
    staleTime: 60 * 1000,
  });

  const error = queryError instanceof Error ? queryError.message : null;

  // Format equity curve สำหรับ chart
  const equityData = useMemo(() => {
    if (!summary) return [];
    return summary.equity_curve.map((point: any) => ({
      date: new Date(point.time).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
      }),
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

  return {
    loading,
    error,
    account: { balance: summary?.balance ?? 0 },
    equityData,
    symbolStats: summary?.symbol_statistics?.list ?? [],
    recent: [], 
    volumeStats: {
      tradeCount: summary?.symbol_statistics?.total_trades ?? 0,
    },
    performance: {
      winRate: summary?.win_rate ?? 0,
      recoveryFactor: summary?.recovery_factor ?? 0,
      maxDrawdown: summary?.max_drawdown ?? 0,
      profitFactor: summary?.profit_factor ?? 0,
      sharpeRatio: 0, 
    },
    profitToday: summary?.profit_today ?? 0,
    profitWeek: summary?.avg_profit_week ?? 0,
    profitMonth: summary?.avg_profit_month ?? 0,
    formatCurrency,
    refreshData,
  };
}
