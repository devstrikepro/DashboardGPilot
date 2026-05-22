import { apiClient } from '@/shared/api/client';
import { ApiError } from '@/shared/api/api-error';
import { SUB_ENDPOINTS, API_GATEWAY_SUB } from '@/shared/api/endpoint';
import { createLogger } from '@/shared/utils/logger';
import type { ServiceResponse, ProfitSharingProduct, ProfitSharingWithdrawalRequest, ProfitSharingTransaction } from '@/shared/types/api';

const logger = createLogger('ProfitSharingService');

export const ProfitSharingService = {
  getProducts: async (): Promise<ServiceResponse<ProfitSharingProduct[]>> => {
    try {
      const response = await apiClient<ServiceResponse<ProfitSharingProduct[]>>(
        SUB_ENDPOINTS.PROFIT_SHARING_PRODUCTS,
        undefined,
        undefined,
        API_GATEWAY_SUB
      );

      if (!response.success) {
        return {
          success: false,
          data: null,
          error_code: response.error_code || 'FETCH_ERROR',
          message: response.message || 'ไม่สามารถดึงข้อมูล Profit Sharing Products ได้',
        };
      }

      return response;
    } catch (e) {
      const errorMsg = e instanceof ApiError ? e.message : 'ไม่สามารถดึงข้อมูล Profit Sharing Products ได้';
      logger.error('Failed to fetch profit sharing products', e instanceof Error ? e : String(e));
      return {
        success: false,
        data: null,
        error_code: 'FETCH_ERROR',
        message: errorMsg,
      };
    }
  },

  getTransactionHistory: async (): Promise<ServiceResponse<ProfitSharingTransaction[]>> => {
    try {
      const response = await apiClient<ServiceResponse<ProfitSharingTransaction[]>>(
        SUB_ENDPOINTS.PROFIT_SHARING_TRANSACTION_HISTORY,
        undefined,
        undefined,
        API_GATEWAY_SUB
      );

      if (!response.success) {
        return {
          success: false,
          data: null,
          error_code: response.error_code || 'FETCH_ERROR',
          message: response.message || 'ไม่สามารถดึงข้อมูล Transaction History ได้',
        };
      }

      return response;
    } catch (e) {
      const errorMsg = e instanceof ApiError ? e.message : 'ไม่สามารถดึงข้อมูล Transaction History ได้';
      logger.error('Failed to fetch transaction history', e instanceof Error ? e : String(e));
      return {
        success: false,
        data: null,
        error_code: 'FETCH_ERROR',
        message: errorMsg,
      };
    }
  },

  withdrawal: async (body: ProfitSharingWithdrawalRequest): Promise<ServiceResponse<null>> => {
    try {
      const response = await apiClient<ServiceResponse<null>>(
        SUB_ENDPOINTS.PROFIT_SHARING_WITHDRAWAL,
        { method: 'POST', body: JSON.stringify(body) },
        undefined,
        API_GATEWAY_SUB
      );

      if (!response.success) {
        return {
          success: false,
          data: null,
          error_code: response.error_code || 'WITHDRAWAL_ERROR',
          message: response.message || 'ไม่สามารถทำรายการถอนได้',
        };
      }

      return response;
    } catch (e) {
      const errorMsg = e instanceof ApiError ? e.message : 'ไม่สามารถทำรายการถอนได้';
      logger.error('Failed to withdraw profit sharing', e instanceof Error ? e : String(e));
      return {
        success: false,
        data: null,
        error_code: 'WITHDRAWAL_ERROR',
        message: errorMsg,
      };
    }
  },
};
