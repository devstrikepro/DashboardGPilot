import { apiClient } from '@/shared/api/client';
import { ApiError } from '@/shared/api/api-error';
import type { TradesHistoryResponse, ServiceResponse } from '@/shared/types/api';

/**
 * รองรับ IS_MOCK_MODE (Global Rules #10)
 */
const IS_MOCK_MODE = process.env.NEXT_PUBLIC_IS_MOCK_MODE === 'true';

export const TradeHistoryService = {
  /**
   * ดึง Trade History
   * เรียกผ่าน apiClient → Next.js Gateway Proxy → Backend (URL ซ่อนอยู่ใน server-side env)
   */
  getHistory: async (): Promise<ServiceResponse<TradesHistoryResponse>> => {
    try {
      const isMockMode = process.env.NEXT_PUBLIC_IS_MOCK_MODE === 'true';
      if (isMockMode) {
        // [ Mock Data ] - จำลองตาม Response Structure ใน api_interface.md
        return {
          success: true,
          data: {
            total: 6,
            data: [
              {
                ticket: 1001,
                order: 2001,
                symbol: 'XAUUSD',
                type: 'BALANCE',
                entry: null,
                volume: 0,
                price: 0,
                profit: 10000,
                commission: 0,
                swap: 0,
                magic: 0,
                comment: 'Initial Deposit',
                time: '2026-01-01T09:00:00',
              },
              {
                ticket: 1002,
                order: 2002,
                symbol: 'XAUUSD',
                type: 'BUY',
                entry: 'IN',
                volume: 0.1,
                price: 2650.5,
                profit: 0,
                commission: -0.5,
                swap: 0,
                magic: 100,
                comment: 'EA_Gold_v1',
                time: '2026-02-10T10:15:00',
              },
              {
                ticket: 1003,
                order: 2002,
                symbol: 'XAUUSD',
                type: 'BUY',
                entry: 'OUT',
                volume: 0.1,
                price: 2680,
                profit: 295,
                commission: -0.5,
                swap: -1.2,
                magic: 100,
                comment: 'EA_Gold_v1',
                time: '2026-02-15T14:30:00',
              },
              {
                ticket: 1004,
                order: 2003,
                symbol: 'EURUSD',
                type: 'SELL',
                entry: 'IN',
                volume: 0.5,
                price: 1.085,
                profit: 0,
                commission: -1.25,
                swap: 0,
                magic: 100,
                comment: 'EA_Gold_v1',
                time: '2026-03-01T08:00:00',
              },
              {
                ticket: 1005,
                order: 2003,
                symbol: 'EURUSD',
                type: 'SELL',
                entry: 'OUT',
                volume: 0.5,
                price: 1.079,
                profit: 300,
                commission: -1.25,
                swap: -2.5,
                magic: 100,
                comment: 'EA_Gold_v1',
                time: '2026-03-10T16:45:00',
              },
              {
                ticket: 1006,
                order: 2004,
                symbol: 'GBPUSD',
                type: 'BUY',
                entry: 'OUT',
                volume: 0.2,
                price: 1.27,
                profit: -85,
                commission: -0.5,
                swap: -0.8,
                magic: 100,
                comment: 'EA_Gold_v1',
                time: '2026-03-20T11:00:00',
              },
            ],
          },
          error: null,
        };
      }

      const response = await apiClient<TradesHistoryResponse>('/api/v1/trades');

      return {
        success: true,
        data: response,
        error: null,
      };
    } catch (e: unknown) {
      const errorData =
        e instanceof ApiError
          ? e.message
          : 'เกิดข้อผิดพลาดในการดึงข้อมูลประวัติการทำรายการ';
      return {
        success: false,
        data: null,
        error: errorData,
      };
    }
  },
};
