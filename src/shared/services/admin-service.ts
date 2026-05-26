import { apiClient } from "@/shared/api/client";
import { ApiError } from "@/shared/api/api-error";
import { SUB_ENDPOINTS, API_GATEWAY_SUB } from "@/shared/api/endpoint";
import { createLogger } from "@/shared/utils/logger";
import type { ServiceResponse } from "@/shared/types/api";

const logger = createLogger("AdminService");

export interface AdminWithdrawal {
  id: string;
  user_id: string;
  user_port: number;
  user_email: string;
  product_name: string;
  product_port: number;
  amount: number;
  status: "pending" | "approved" | "rejected";
  note: string;
  requested_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

export const AdminService = {
  approveWithdrawal: async (id: string): Promise<ServiceResponse<null>> => {
    try {
      const response = await apiClient<ServiceResponse<null>>(
        `/admin/withdrawals/${id}/approve`,
        { method: "PATCH" },
        undefined,
        API_GATEWAY_SUB
      );
      if (!response.success) {
        return { success: false, data: null, error_code: response.error_code || "APPROVE_ERROR", message: response.message || "Approve failed" };
      }
      return response;
    } catch (e) {
      const errorMsg = e instanceof ApiError ? e.message : "Approve failed";
      logger.error("Failed to approve withdrawal", e instanceof Error ? e : String(e));
      return { success: false, data: null, error_code: "APPROVE_ERROR", message: errorMsg };
    }
  },

  rejectWithdrawal: async (id: string): Promise<ServiceResponse<null>> => {
    try {
      const response = await apiClient<ServiceResponse<null>>(
        `/admin/withdrawals/${id}/reject`,
        { method: "PATCH" },
        undefined,
        API_GATEWAY_SUB
      );
      if (!response.success) {
        return { success: false, data: null, error_code: response.error_code || "REJECT_ERROR", message: response.message || "Reject failed" };
      }
      return response;
    } catch (e) {
      const errorMsg = e instanceof ApiError ? e.message : "Reject failed";
      logger.error("Failed to reject withdrawal", e instanceof Error ? e : String(e));
      return { success: false, data: null, error_code: "REJECT_ERROR", message: errorMsg };
    }
  },

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
