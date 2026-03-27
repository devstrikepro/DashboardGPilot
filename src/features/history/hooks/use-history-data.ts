"use client";

import { useState, useMemo, useEffect } from "react";
import { TradeHistoryService } from "@/shared/services/trade-history-service";
import type { Deal } from "@/shared/types/api";

export type SortField = "ticket" | "symbol" | "profit" | "volume";
export type SortDirection = "asc" | "desc";

export interface HistoryTotals {
  volume: number;
  grossProfit: number;
  grossLoss: number;
  netPL: number;
  commission: number;
  swap: number;
}

export function useHistoryData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deals, setDeals] = useState<readonly Deal[]>([]);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("ticket");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await TradeHistoryService.getHistory();
        if (response.success && response.data) {
          setDeals(response.data.data);
        } else {
          setError("Failed to fetch trade history");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredDeals = useMemo(() => {
    let result = [...deals].filter(
      (deal) =>
        (deal.symbol?.toLowerCase() || "").includes(search.toLowerCase()) ||
        deal.ticket.toString().includes(search)
    );

    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const modifier = sortDirection === "asc" ? 1 : -1;

      if (typeof aVal === "string") {
        return (aVal || "").localeCompare((bVal as string) || "") * modifier;
      }
      return ((aVal as number || 0) - (bVal as number || 0)) * modifier;
    });

    return result;
  }, [deals, search, sortField, sortDirection]);

  const totals = useMemo<HistoryTotals>(() => {
    return filteredDeals.reduce(
      (acc, deal) => ({
        volume: acc.volume + deal.volume,
        grossProfit: acc.grossProfit + (deal.profit > 0 ? deal.profit : 0),
        grossLoss: acc.grossLoss + (deal.profit < 0 ? deal.profit : 0),
        netPL: acc.netPL + deal.profit + deal.commission + deal.swap,
        commission: acc.commission + deal.commission,
        swap: acc.swap + deal.swap,
      }),
      { volume: 0, grossProfit: 0, grossLoss: 0, netPL: 0, commission: 0, swap: 0 }
    );
  }, [filteredDeals]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  return {
    loading,
    error,
    deals: filteredDeals,
    totals,
    search,
    setSearch,
    sortField,
    sortDirection,
    handleSort,
    totalCount: deals.length,
    filteredCount: filteredDeals.length,
  };
}
