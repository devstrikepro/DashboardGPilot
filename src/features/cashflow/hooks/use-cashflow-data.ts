"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { CashflowService } from "@/shared/services/cashflow-service";
import { useApiHealth } from "@/shared/providers/api-health-provider";
import { useTradeData } from "@/shared/providers/trade-data-provider";
import type { CashflowSummary, CashflowTransaction } from "@/shared/types/api";

// Re-export Transaction type สำหรับ Components ที่ใช้อยู่
export type { CashflowTransaction as Transaction };

/**
 * useCashflowData
 * ดึง Cashflow Summary จาก Backend โดยตรง
 * Backend คำนวณ: transactions, balance curve, deposits/withdrawals/netFlow
 */
export function useCashflowData() {
  const { account, loading: globalLoading, error: globalError, refreshData } = useTradeData();
  const { isHealthy } = useApiHealth();

  const [summary, setSummary] = useState<CashflowSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    if (!isHealthy) return;
    try {
      setLoading(true);
      setError(null);

      const response = await CashflowService.getCashflowSummary();

      if (response.success && response.data) {
        setSummary(response.data);
      } else {
        setError((response.error as string) ?? "Failed to fetch cashflow summary");
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

  // Format balance data สำหรับ chart (UI-only transform)
  const balanceData = useMemo(() => {
    if (!summary) return [];
    return summary.balanceData.map((point) => ({
      date: new Date(point.time).toLocaleDateString("en-US", { day: "2-digit", month: "short" }),
      time: point.time,
      balance: point.equity ?? 0,
    }));
  }, [summary]);

  return {
    loading: loading || globalLoading,
    error: error ?? globalError,
    account,
    transactions: summary?.transactions ?? [],
    balanceData,
    cashflowStats: {
      deposits: summary?.deposits ?? 0,
      withdrawals: summary?.withdrawals ?? 0,
      netFlow: summary?.netFlow ?? 0,
    },
    currentBalance: summary?.currentBalance ?? 0,
    balanceChange: 0,
    balanceChangePercent: 0,
    refreshData: async () => {
      await Promise.all([refreshData(), fetchSummary()]);
    },
  };
}
