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
  const [lastUpdate, setLastUpdate] = useState<string | null>(initialData?.lastUpdate || null);

  // If initialData is provided, mark as fetched
  const isInitialFetched = useRef(!!initialData && Object.keys(initialData).length > 0);

  // 1. Fetch Account Info List (Listing Page)
  const fetchAccountInfoList = useCallback(async (options?: RequestInit) => {
    if (!isHealthy) return;
    setLoading(true);
    try {
      const res = await AccountService.getInfo(options);
      if (res.success && res.data) {
        // Backend-Sub คืนแบบ wrapped: { list: AccountInfo[], last_update: string | null }
        setAccountInfoList(res.data.list);
        setLastUpdate(res.data.last_update);
      } else if (!res.success) {
        setError(res.message || "Failed to fetch account list");
      }
    } catch (err) {
      setError("An unexpected error occurred while fetching account list.");
    } finally {
      setLoading(false);
      isInitialFetched.current = true;
    }
  }, [isHealthy]);

  // 2. Fetch Detail Data (Detail Page)
  const fetchDetailInfo = useCallback(async (targetMt5Id: number, options?: RequestInit) => {
    if (!isHealthy) return;
    
    setLoading(true);
    try {
      const [profileRes, financeRes] = await Promise.all([
        AccountService.getProfile(targetMt5Id, options),
        AccountService.getFinance(targetMt5Id, options),
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
        setError(profileRes.message || financeRes.message || "Failed to fetch account info");
      }
    } catch (err) {
      setError("An unexpected error occurred while fetching account info.");
    } finally {
      setLoading(false);
      isInitialFetched.current = true;
    }
  }, [isHealthy]);

  // 3. Fetch Trades (Independent)
  const fetchTrades = useCallback(async (targetMt5Id?: number, options?: RequestInit) => {
    if (!isHealthy) return;

    setTableLoading(true);
    try {
      const tradesRes = await AnalyticsService.getGroupedTrades({
        mt5_id: targetMt5Id,
        page: tableParams?.page || 1,
        limit: tableParams?.limit || 10,
        type: tableParams?.type || null,
        date_from: tableParams?.date_from || null,
        end_date: tableParams?.end_date || null,
      }, API_GATEWAY_SUB, options);

      if (tradesRes.success && tradesRes.data) {
        // Sub-API returns List of objects, each for one port
        const dataList = Array.isArray(tradesRes.data) ? tradesRes.data : [tradesRes.data];
        setAllTradesData(dataList);
      } else if (!tradesRes.success) {
        setError(tradesRes.message || "Failed to fetch trades");
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
      const index = profiles.findIndex(p => p.mt5_id === mt5Id);
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
      login: profile.mt5_id,
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
    trades: (tradesData?.paginated?.list || []).map((deal: any) => ({
      ...deal,
      net_profit: deal.net_profit ?? 0,
      close_time: deal.close_time ?? deal.time ?? "",
    })),
    totalTrades: tradesData?.total_trades ?? 0,
    tradesTotals: {
      volume: tradesData?.total_volume ?? 0,
      grossProfit: tradesData?.gross_profit ?? 0,
      grossLoss: tradesData?.gross_loss ?? 0,
      netPL: tradesData?.net_profit ?? 0,
      commission: 0,
      swap: 0,
      fee: tradesData?.fee ?? 0,
      totalTrades: tradesData?.total_trades ?? 0
    },
    realBalance: finance?.total_balance ?? profile?.balance ?? 0,
    grossTradeProfit: finance?.gross_trade_profit ?? 0,
    totalDeposits: finance?.total_deposits ?? 0,
    totalWithdrawals: finance?.total_withdrawals ?? 0,
    totalProfitSharing: finance?.total_profit_sharing ?? 0,
    netProfit: finance?.net_profit ?? 0,
    equityCurve: finance?.equity_curve || [],
    formatCurrency,
    lastUpdate,
    canRefresh: useMemo(() => {
      if (!lastUpdate) return true;
      const lastUpdateTime = new Date(lastUpdate).getTime();
      const now = new Date().getTime();
      return now - lastUpdateTime > 15 * 60 * 1000;
    }, [lastUpdate]),
    refreshData: async () => {
      // 1. ตรวจสอบว่าสามารถรีเฟรชได้หรือไม่ (Cooldown 15 นาที)
      if (!lastUpdate) {
        // ถ้าไม่มี lastUpdate เลยให้ข้ามไปทำต่อได้ (เช่น โหลดครั้งแรก)
      } else {
        const lastUpdateTime = new Date(lastUpdate).getTime();
        const now = new Date().getTime();
        if (now - lastUpdateTime <= 15 * 60 * 1000) {
          console.warn("Refresh blocked: Cooldown active");
          return;
        }
      }

      setLoading(true);
      try {
        // 2. Trigger manual sync (เส้นนี้หนักที่สุด)
        await AccountService.syncAccount();
        
        // 3. Then fetch updated data based on view (Force no-cache)
        const fetchOptions: RequestInit = { cache: 'no-store' };
        if (mt5Id) {
          await Promise.all([
            fetchDetailInfo(mt5Id, fetchOptions), 
            fetchTrades(mt5Id, fetchOptions)
          ]);
        } else {
          await fetchAccountInfoList(fetchOptions);
        }
      } catch (err) {
        setError("Failed to sync and refresh data.");
      } finally {
        setLoading(false);
      }
    },
  };
}


