import { apiClient } from '@/shared/api/client';
import { ApiError } from '@/shared/api/api-error';
import type { AccountInfo, ServiceResponse } from '@/shared/types/api';

/**
 * รองรับ IS_MOCK_MODE (Global Rules #10)
 */
const IS_MOCK_MODE = process.env.NEXT_PUBLIC_IS_MOCK_MODE === 'true';

export const AccountService = {
  /**
   * ดึงข้อมูลบัญชี (Account Information)
   * เรียกผ่าน apiClient → Next.js Gateway Proxy → Backend (URL ซ่อนอยู่ใน server-side env)
   */
  getAccountInfo: async (): Promise<ServiceResponse<AccountInfo>> => {
    try {
      if (IS_MOCK_MODE) {
        // [ Mock Data ] - จำลองตาม Response Structure ใน api_interface.md
        return {
          success: true,
          data: {
            login: 1003,
            server: 'Gpilot-Live',
            name: 'Demo Account',
            currency: 'USD',
            balance: 10000,
            equity: 10500.5,
            margin: 500,
            margin_free: 10000.5,
            margin_level: 2100.1,
            leverage: 100,
            profit: 500.5,
          },
          error: null,
        };
      }

      const response = await apiClient<AccountInfo>('/api/v1/account');

      return {
        success: true,
        data: response,
        error: null,
      };
    } catch (e: unknown) {
      const errorData =
        e instanceof ApiError ? e.message : 'เกิดข้อผิดพลาดในการดึงข้อมูลบัญชี';
      return {
        success: false,
        data: null,
        error: errorData,
      };
    }
  },
};
