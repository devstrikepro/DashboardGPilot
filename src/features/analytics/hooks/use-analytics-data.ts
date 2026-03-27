import { useState, useEffect, useMemo } from 'react';
import { AccountService } from '@/shared/services/account-service';
import { TradeHistoryService } from '@/shared/services/trade-history-service';
import type { AccountInfo, Deal } from '@/shared/types/api';
import { 
  calculateEquityCurve, 
  calculateDailyReturns, 
  calculateSharpeRatio, 
  calculateMaxDrawdown, 
  calculateWinRate,
  calculatePLDistribution,
  calculateAssetExposure
} from '../utils/performance-utils';

export function useAnalyticsData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [deals, setDeals] = useState<readonly Deal[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [accRes, historyRes] = await Promise.all([
          AccountService.getAccountInfo(),
          TradeHistoryService.getHistory()
        ]);

        const formatError = (err: string | readonly any[] | null): string => {
          if (Array.isArray(err)) {
            return err.map(e => `${e.loc.join('.')}: ${e.msg}`).join(', ');
          }
          return typeof err === 'string' ? err : 'Unknown error';
        };

        if (accRes.success && accRes.data) {
          setAccount(accRes.data);
        } else if (!accRes.success) {
          setError(formatError(accRes.error));
        }

        if (historyRes.success && historyRes.data) {
          setDeals(historyRes.data.data);
        } else if (!historyRes.success) {
          setError(formatError(historyRes.error));
        }
      } catch (err: any) {
        setError('เกิดข้อผิดพลาดในการดึงข้อมูลวิเคราะห์');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = useMemo(() => {
    if (deals.length === 0) return null;

    const equityCurve = calculateEquityCurve(deals);
    const dailyReturns = calculateDailyReturns(deals);
    const sharpeRatio = calculateSharpeRatio(dailyReturns);
    const maxDrawdown = calculateMaxDrawdown(equityCurve);
    const winRate = calculateWinRate(deals);
    const plDistribution = calculatePLDistribution(deals);
    const assetExposure = calculateAssetExposure(deals);

    return {
      equityCurve,
      dailyReturns,
      sharpeRatio,
      maxDrawdown,
      winRate,
      plDistribution,
      assetExposure,
      totalTrades: deals.filter(d => d.type !== 'BALANCE').length,
      wins: deals.filter(d => d.type !== 'BALANCE' && d.profit > 0).length,
    };
  }, [deals]);

  return {
    loading,
    error,
    account,
    deals,
    stats
  };
}
