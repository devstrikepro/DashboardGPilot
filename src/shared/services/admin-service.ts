import { apiClient } from "@/shared/api/client";
import { ApiError } from "@/shared/api/api-error";
import { SUB_ENDPOINTS, API_GATEWAY_SUB } from "@/shared/api/endpoint";
import { createLogger } from "@/shared/utils/logger";
import type { ServiceResponse } from "@/shared/types/api";

const logger = createLogger("AdminService");

// TODO: Replace with proper interface once backend schema is confirmed
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AdminWithdrawal = Record<string, any>;

export const AdminService = {
  getWithdrawals: async (status?: string): Promise<ServiceResponse<AdminWithdrawal[]>> => {
    try {
      const response = await apiClient<ServiceResponse<AdminWithdrawal[]>>(
        SUB_ENDPOINTS.ADMIN_WITHDRAWALS,
        undefined,
        status ? { status } : undefined,
        API_GATEWAY_SUB
      );

      if (!response.success) {
        return {
          success: false,
          data: null,
          error_code: response.error_code || "FETCH_ERROR",
          message: response.message || "ไม่สามารถดึงข้อมูล Withdrawals ได้",
        };
      }

      return response;
    } catch (e) {
      const errorMsg = e instanceof ApiError ? e.message : "ไม่สามารถดึงข้อมูล Withdrawals ได้";
      logger.error("Failed to fetch admin withdrawals", e instanceof Error ? e : String(e));
      return {
        success: false,
        data: null,
        error_code: "FETCH_ERROR",
        message: errorMsg,
      };
    }
  },
};
