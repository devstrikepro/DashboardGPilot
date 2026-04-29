import { apiClient } from '@/shared/api/client';
import { SUB_ENDPOINTS, API_GATEWAY_SUB } from '@/shared/api/endpoint';
import { createLogger } from '@/shared/utils/logger';
import type { ServiceResponse, ReferralSyncSummary, ReferralSyncRequest } from '@/shared/types/api';

const logger = createLogger('TradeHistoryService');

/**
 * Service สำหรับจัดการประวัติการเทรด (Deals)
 * ครอบคลุมทั้ง Backend-Main (Real-time) และ Backend-Sub (Synced Referral)
 */
export const TradeHistoryService = {
  /**
   * ดึงประวัติการเทรดของเพื่อน (Referral) ที่ Sync แล้วจาก Backend-Sub
   */
  getReferralHistory: async (params?: ReferralSyncRequest): Promise<ServiceResponse<ReferralSyncSummary>> => {
    try {
      logger.info('Fetching referral synced trades from Backend-Sub', { params });
      
      const response = await apiClient<ServiceResponse<ReferralSyncSummary>>(
        SUB_ENDPOINTS.TRADES,
        undefined,
        params as any,
        API_GATEWAY_SUB
      );

      return response;
    } catch (e) {
      logger.error('Failed to fetch referral history', e instanceof Error ? e : String(e));
      return {
        success: false,
        data: null,
        error: { code: 'FETCH_ERROR', message: 'ไม่สามารถดึงข้อมูล Referral ได้' }
      };
    }
  },
};

/**
 * Mock Data สำหรับ Referral Sync (ตามโครงสร้างใหม่)
 */
const MOCK_REFERRAL_DATA: ReferralSyncSummary = {
  totalThisWeek: 450.75,
  lastSync: new Date().toISOString(),
  trades: [
    {
      email: 'user.one@example.com',
      accountId: '2121978453',
      amount: 150.25,
      currency: 'USD',
      date: '2026-04-01T10:30:00Z',
      status: 'success'
    },
    {
      email: 'trader.pro@gmail.com',
      accountId: '2121989012',
      amount: 220.50,
      currency: 'USD',
      date: '2026-04-02T14:45:00Z',
      status: 'success'
    },
    {
      email: 'newbie.fx@hotmail.com',
      accountId: '2121995544',
      amount: 80.00,
      currency: 'USD',
      date: '2026-04-03T09:15:00Z',
      status: 'success'
    },
    {
      email: 'error.user@provider.com',
      accountId: '2121950000',
      amount: 0,
      currency: 'USD',
      date: '2026-04-04T08:00:00Z',
      status: 'failed',
      error: 'Invalid MT5 Login / Password'
    }
  ]
};
