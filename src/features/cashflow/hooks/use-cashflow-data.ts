"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { CashflowService } from "@/shared/services/cashflow-service";
import { TradeHistoryService } from "@/shared/services/trade-history-service";
import { HealthService } from "@/shared/services/health-service";
import { useApiHealth } from "@/shared/providers/api-health-provider";
import type { CashflowSummary, CashflowTransaction, Deal } from "@/shared/types/api";

export type { CashflowTransaction as Transaction };

/**
 * useCashflowData
 * ดึง Cashflow Summary ขนานกับ Background Sync และ Health Check (Parallel 3)
 */
export function useCashflowData() {
  const { isHealthy } = useApiHealth();

  const [summary, setSummary] = useState<CashflowSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const fetchSummary = useCallback(async () => {
    if (!isHealthy) return;
    try {
      setLoading(true);
      setError(null);

      const [cashResponse, healthResponse] = await Promise.all([
        CashflowService.getCashflowSummary({ page, limit }),
        HealthService.checkHealth(),
      ]);

      // Background Sync
      TradeHistoryService.getHistory().catch(() => null);

      if (healthResponse.success && healthResponse.data?.status === "ok") {
        if (cashResponse.success && cashResponse.data) {
          setSummary(cashResponse.data);
        } else {
          setError(cashResponse.error?.message ?? "Failed to fetch cashflow summary");
        }
      } else {
        setError(healthResponse.error || "System health check failed. Cannot load cashflow data.");
        setSummary(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }, [isHealthy, page, limit]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary, page, limit]);

  return {
    loading,
    error,
    transactions: summary?.transactions ?? [],
    cashflowStats: {
      deposits: summary?.totalDeposit ?? 0,
      withdrawals: summary?.totalWithdrawal ?? 0,
      netFlow: (summary?.totalDeposit ?? 0) - (summary?.totalWithdrawal ?? 0),
    },
    summary,
    
    // Pagination
    page,
    limit,
    total: summary?.totalTransactions ?? 0,
    setPage,
    setLimit,

    refreshData: fetchSummary,
  };
}
