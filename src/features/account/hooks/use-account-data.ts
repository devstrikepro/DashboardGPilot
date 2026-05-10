import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { AccountService } from "@/shared/services/account-service";
import { AnalyticsService } from "@/shared/services/analytics-service";
import { API_GATEWAY_SUB } from "@/shared/api/endpoint";
import { useApiHealth } from "@/shared/providers/api-health-provider";
import type { 
  AccountProfile, 
  AccountFinance, 
  AccountInfo,
  GroupedTradesResponse,
  TradeRequest
} from "@/shared/types/api";
import type { AccountInitialData } from "../AccountPage";

export function useAccountData(tableParams?: TradeRequest, initialData?: AccountInitialData, mt5Id?: number) {
  const { isHealthy } = useApiHealth();

  const [accountInfoList, setAccountInfoList] = useState<AccountInfo[]>(initialData?.info || []);
  const [profiles, setProfiles] = useState<AccountProfile[]>(() => {
    if (!initialData?.profile) return [];
    return Array.isArray(initialData.profile) ? initialData.profile : [initialData.profile];
  });
  const [finances, setFinances] = useState<AccountFinance[]>(() => {
    if (!initialData?.finance) return [];
    return Array.isArray(initialData.finance) ? initialData.finance : [initialData.finance];
  });
  const [allTradesData, setAllTradesData] = useState<GroupedTradesResponse[]>(() => {
    if (!initialData?.tradesData) return [];
    return Array.isArray(initialData.tradesData) ? initialData.tradesData : [initialData.tradesData];
  });
  
  const [activePortIndex, setActivePortIndex] = useState(0);
  
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If initialData is provided, mark as fetched
  const isInitialFetched = useRef(!!initialData && Object.keys(initialData).length > 0);

  // 1. Fetch Account Info List (Listing Page)
  const fetchAccountInfoList = useCallback(async () => {
    if (!isHealthy) return;
    setLoading(true);
    try {
      const res = await AccountService.getInfo();
      if (res.success && res.data) {
        setAccountInfoList(res.data);
      } else if (!res.success) {
        setError(res.error?.message || "Failed to fetch account list");
      }
    } catch (err) {
      setError("An unexpected error occurred while fetching account list.");
    } finally {
      setLoading(false);
      isInitialFetched.current = true;
    }
  }, [isHealthy]);

  // 2. Fetch Detail Data (Detail Page)
  const fetchDetailInfo = useCallback(async (targetMt5Id: number) => {
    if (!isHealthy) return;
    
    setLoading(true);
    try {
      const [profileRes, financeRes] = await Promise.all([
        AccountService.getProfile(targetMt5Id),
        AccountService.getFinance(targetMt5Id),
      ]);

      if (profileRes.success && profileRes.data) {
        const profileList = Array.isArray(profileRes.data) ? profileRes.data : [profileRes.data];
        setProfiles(profileList);
      }
      if (financeRes.success && financeRes.data) {
        const financeList = Array.isArray(financeRes.data) ? financeRes.data : [financeRes.data];
        setFinances(financeList);
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

  // 3. Fetch Trades (Independent)
  const fetchTrades = useCallback(async (targetMt5Id?: number) => {
    if (!isHealthy) return;

    setTableLoading(true);
    try {
      const tradesRes = await AnalyticsService.getGroupedTrades({
        mt5Id: targetMt5Id,
        page: tableParams?.page || 1,
        limit: tableParams?.limit || 10,
        type: tableParams?.type || null,
        date_from: tableParams?.date_from || null,
        end_date: tableParams?.end_date || null,
      }, API_GATEWAY_SUB);

      if (tradesRes.success && tradesRes.data) {
        // Sub-API returns List of objects, each for one port
        const dataList = Array.isArray(tradesRes.data) ? tradesRes.data : [tradesRes.data];
        setAllTradesData(dataList);
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
      if (mt5Id) {
        fetchDetailInfo(mt5Id);
      } else {
        fetchAccountInfoList();
      }
    }
  }, [isHealthy, mt5Id, fetchDetailInfo, fetchAccountInfoList]);

  // Table update load (Only in Detail View)
  useEffect(() => {
    if (isHealthy && mt5Id) {
      fetchTrades(mt5Id);
    }
  }, [isHealthy, mt5Id, fetchTrades]);
  
  // 3. Sync activePortIndex with mt5Id from URL
  useEffect(() => {
    if (mt5Id && profiles.length > 0) {
      const index = profiles.findIndex(p => p.mt5Id === mt5Id);
      if (index !== -1 && index !== activePortIndex) {
        setActivePortIndex(index);
      }
    }
  }, [mt5Id, profiles, activePortIndex]);

  const profile = profiles[activePortIndex] || null;
  const finance = finances[activePortIndex] || null;
  const tradesData = allTradesData[activePortIndex] || null;

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
    profiles, // Expose for tabs
    finances, // Expose all financial data
    accountInfoList, // Expose for listing page
    activePortIndex,
    setActivePortIndex,
    trades: tradesData?.paginated?.list || [],
    totalTrades: tradesData?.total_trades || 0,
    tradesTotals: {
      volume: tradesData?.total_volume || 0,
      grossProfit: tradesData?.gross_profit || 0,
      grossLoss: tradesData?.gross_loss || 0,
      netPL: (tradesData as any)?.totalPL ?? (tradesData as any)?.["totalP/L"] ?? tradesData?.net_profit ?? 0,
      commission: 0,
      swap: 0,
      fee: tradesData?.fee || 0,
      totalTrades: tradesData?.total_trades || 0
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
      setLoading(true);
      try {
        // 1. First trigger manual sync
        await AccountService.syncAccount();
        
        // 2. Then fetch updated data based on view
        if (mt5Id) {
          await Promise.all([fetchDetailInfo(mt5Id), fetchTrades(mt5Id)]);
        } else {
          await fetchAccountInfoList();
        }
      } catch (err) {
        setError("Failed to sync and refresh data.");
      } finally {
        setLoading(false);
      }
    },
  };
}


