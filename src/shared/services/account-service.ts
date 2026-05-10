import { apiClient } from '@/shared/api/client';
import { SUB_ENDPOINTS, API_GATEWAY_SUB } from '@/shared/api/endpoint';
import { createLogger } from '@/shared/utils/logger';
import type { 
  ServiceResponse, 
  AccountProfile, 
  AccountFinance,
  AccountInfo,
  SyncResult
} from '@/shared/types/api';

const logger = createLogger('AccountService');

/**
 * Service สำหรับจัดการข้อมูลบัญชีและสถิติจาก Backend-Sub
 */
export const AccountService = {
  /**
   * ดึงข้อมูลสรุปรายพอร์ตทั้งหมดที่ผู้ใช้ถือครอง
   */
  getProfile: async (mt5Id?: number): Promise<ServiceResponse<AccountProfile | AccountProfile[]>> => {
    try {
      logger.info('Fetching account profile(s) from Backend-Sub', { mt5Id });
      
      const response = await apiClient<ServiceResponse<AccountProfile | AccountProfile[]>>(
        SUB_ENDPOINTS.ACCOUNT_PROFILE,
        undefined,
        mt5Id ? { mt5_id: mt5Id } : undefined,
        API_GATEWAY_SUB
      );

      if (!response.success) {
        return {
          success: false,
          data: null,
          error_code: response.error_code || 'FETCH_ERROR',
          message: response.message || 'ไม่สามารถดึงข้อมูลโปรไฟล์บัญชีได้'
        };
      }

      return response;
    } catch (e) {
      logger.error('Failed to fetch account profile', e instanceof Error ? e : String(e));
      return {
        success: false,
        data: null,
        error_code: 'FETCH_ERROR',
        message: 'ไม่สามารถดึงข้อมูลโปรไฟล์บัญชีได้'
      };
    }
  },

  /**
   * ดึงข้อมูลการเงินและสถิติภาพรวม (Finance, Equity Curve)
   */
  getFinance: async (mt5Id?: number): Promise<ServiceResponse<AccountFinance | AccountFinance[]>> => {
    try {
      logger.info('Fetching account finance from Backend-Sub', { mt5Id });
      
      const response = await apiClient<ServiceResponse<AccountFinance | AccountFinance[]>>(
        SUB_ENDPOINTS.ACCOUNT_FINANCE,
        undefined,
        mt5Id ? { mt5_id: mt5Id } : undefined,
        API_GATEWAY_SUB
      );

      if (!response.success) {
        return {
          success: false,
          data: null,
          error_code: response.error_code || 'FETCH_ERROR',
          message: response.message || 'ไม่สามารถดึงข้อมูลสถิติการเงินได้'
        };
      }

      return response;
    } catch (e) {
      logger.error('Failed to fetch account finance', e instanceof Error ? e : String(e));
      return {
        success: false,
        data: null,
        error_code: 'FETCH_ERROR',
        message: 'ไม่สามารถดึงข้อมูลสถิติการเงินได้'
      };
    }
  },

  /**
   * ดึงข้อมูลบัญชี MT5 เบื้องต้น (Listing page)
   */
  getInfo: async (): Promise<ServiceResponse<AccountInfo[]>> => {
    try {
      logger.info('Fetching account info list from Backend-Sub');
      
      const response = await apiClient<ServiceResponse<AccountInfo[]>>(
        SUB_ENDPOINTS.ACCOUNT_INFO,
        undefined,
        undefined,
        API_GATEWAY_SUB
      );

      if (!response.success) {
        return {
          success: false,
          data: null,
          error_code: response.error_code || 'FETCH_ERROR',
          message: response.message || 'ไม่สามารถดึงข้อมูลรายการบัญชีได้'
        };
      }

      return response;
    } catch (e) {
      logger.error('Failed to fetch account info', e instanceof Error ? e : String(e));
      return {
        success: false,
        data: null,
        error_code: 'FETCH_ERROR',
        message: 'ไม่สามารถดึงข้อมูลรายการบัญชีได้'
      };
    }
  },

  /**
   * สั่งซิงค์ข้อมูลการเทรดด้วยตัวเอง (Manual Sync)
   */
  syncAccount: async (): Promise<ServiceResponse<SyncResult[]>> => {
    try {
      logger.info('Requesting manual account sync');
      
      const response = await apiClient<ServiceResponse<SyncResult[]>>(
        SUB_ENDPOINTS.ACCOUNT_SYNC,
        { method: 'POST' },
        undefined,
        API_GATEWAY_SUB
      );

      if (!response.success) {
        return {
          success: false,
          data: null,
          error_code: response.error_code || 'SYNC_ERROR',
          message: response.message || 'การซิงค์ข้อมูลล้มเหลว'
        };
      }

      return response;
    } catch (e) {
      logger.error('Manual sync failed', e instanceof Error ? e : String(e));
      return {
        success: false,
        data: null,
        error_code: 'SYNC_ERROR',
        message: 'การซิงค์ข้อมูลล้มเหลว'
      };
    }
  }
};
