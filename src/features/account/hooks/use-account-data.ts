import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { AccountService } from "@/shared/services/account-service";
import { AnalyticsService } from "@/shared/services/analytics-service";
import { API_GATEWAY_SUB } from "@/shared/api/endpoint";
import { useApiHealth } from "@/shared/providers/api-health-provider";
import type { 
  AccountProfile, 
  AccountFinance, 
  GroupedTradesResponse,
  TradeRequest
} from "@/shared/types/api";
import type { AccountInitialData } from "../AccountPage";

export function useAccountData(tableParams?: TradeRequest, initialData?: AccountInitialData) {
  const { isHealthy } = useApiHealth();

  const [profile, setProfile] = useState<AccountProfile | null>(initialData?.profile || null);
  const [finance, setFinance] = useState<AccountFinance | null>(initialData?.finance || null);
  const [tradesData, setTradesData] = useState<GroupedTradesResponse | null>(initialData?.tradesData || null);
  
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If initialData is provided, mark as fetched
  const isInitialFetched = useRef(!!initialData);

  // 1. Fetch Profile & Finance (Initial or Refresh)
  const fetchAccountInfo = useCallback(async () => {
    if (!isHealthy) return;
    
    setLoading(true);
    try {
      const [profileRes, financeRes] = await Promise.all([
        AccountService.getProfile(),
        AccountService.getFinance(),
      ]);

      if (profileRes.success && profileRes.data && profileRes.data.length > 0) {
        setProfile(profileRes.data[0]);
      }
      if (financeRes.success && financeRes.data && financeRes.data.length > 0) {
        setFinance(financeRes.data[0]);
      }
      
      if (!profileRes.success || !financeRes.success) {
        setError(profileRes.error?.message || financeRes.error?.message || "Failed to fetch account info");
      }
    } catch (err) {
      setError("An unexpected error occurred while fetching account info.");
    } finally {
      setLoading(false);
      isInitialFetched.current = true;
    }
  }, [isHealthy]);

  // 2. Fetch Trades (Independent)
  const fetchTrades = useCallback(async () => {
    if (!isHealthy) return;

    setTableLoading(true);
    try {
      const tradesRes = await AnalyticsService.getGroupedTrades({
        page: tableParams?.page || 1,
        limit: tableParams?.limit || 10,
        type: tableParams?.type || null,
        date_from: tableParams?.date_from || null,
        end_date: tableParams?.end_date || null,
      }, API_GATEWAY_SUB);

      if (tradesRes.success && tradesRes.data) {
        // Handle both single object (Main-API) and array (Sub-API) responses
        const data = Array.isArray(tradesRes.data) ? tradesRes.data[0] : tradesRes.data;
        setTradesData(data);
      } else if (!tradesRes.success) {
        setError(tradesRes.error?.message || "Failed to fetch trades");
      }
    } catch (err) {
      setError("An unexpected error occurred while fetching trades.");
    } finally {
      setTableLoading(false);
    }
  }, [isHealthy, tableParams]);

  // Initial load
  useEffect(() => {
    if (!isInitialFetched.current && isHealthy) {
      fetchAccountInfo();
    }
  }, [isHealthy, fetchAccountInfo]);

  // Table update load
  useEffect(() => {
    if (isHealthy) {
      fetchTrades();
    }
  }, [isHealthy, fetchTrades]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: profile?.currency || "USD",
    }).format(value);
  };

  const summary = useMemo(() => {
    if (!profile) return null;
    return {
      name: profile.name,
      login: profile.mt5Id,
      server: profile.server,
      leverage: profile.leverage,
      currency: profile.currency,
      balance: profile.balance,
      ...finance
    };
  }, [profile, finance]);

  return {
    loading,
    tableLoading,
    error,
    summary,
    profile,
    finance,
    trades: tradesData?.paginated?.list || [],
    totalTrades: tradesData?.totalTrades || 0,
    tradesTotals: {
      volume: tradesData?.totalVolume || 0,
      grossProfit: tradesData?.grossProfit || 0,
      grossLoss: tradesData?.grossLoss || 0,
      netPL: tradesData?.totalPL ?? (tradesData as any)?.["totalP/L"] ?? tradesData?.netProfit ?? 0,
      commission: 0,
      swap: 0,
      fee: tradesData?.fee || 0,
      totalTrades: tradesData?.totalTrades || 0
    },
    realBalance: (finance as any)?.totalBalance ?? profile?.balance ?? 0,
    grossTradeProfit: finance?.grossTradeProfit ?? 0,
    totalDeposits: finance?.totalDeposits ?? 0,
    totalWithdrawals: finance?.totalWithdrawals ?? 0,
    totalProfitSharing: finance?.totalProfitSharing ?? 0,
    netProfit: finance?.netProfit ?? 0,
    equityCurve: finance?.equityCurve || [],
    formatCurrency,
    refreshData: async () => {
      await Promise.all([fetchAccountInfo(), fetchTrades()]);
    },
  };
}


