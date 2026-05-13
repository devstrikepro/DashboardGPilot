import { apiClient } from "@/shared/api/client";
import { ROR_ENDPOINTS, SERVICE_BASE_ROR, ROR, SERVICE_BASE_ROR_INTERNAL } from "@/shared/api/endpoint";
import { FingerprintUtils } from "@/shared/utils/fingerprint";
// import { createLogger } from '@/shared/utils/logger';
import { ApiError } from "@/shared/api/api-error";
import type { ServiceResponse } from "@/shared/types/api";
import type { LoginResponse } from "@/shared/types/auth";

// const logger = createLogger('RorService');

/**
 * Helper: ยิง request ที่ต้องใช้ BE Token พร้อม Auto-Refresh อัตโนมัติเมื่อ token หมดอายุ (401)
 */
const withBeAuth = async <T>(fn: (token: string) => Promise<T>): Promise<T> => {
  const getBeToken = () => (typeof window !== "undefined" ? (localStorage.getItem("ror_be_access_token") ?? "") : "");

  try {
    return await fn(getBeToken());
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 401) {
      const refreshToken = typeof window !== "undefined" ? localStorage.getItem("ror_be_refresh_token") : null;
      if (!refreshToken) throw error;

      const refreshResult = await apiClient<RorBeLoginResponse>(
        ROR.REFRESH_TOKEN_BE,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refreshToken }),
        },
        undefined,
        SERVICE_BASE_ROR_INTERNAL
      );

      localStorage.setItem("ror_be_access_token", refreshResult.access_token);
      if (refreshResult.refresh_token) {
        localStorage.setItem("ror_be_refresh_token", refreshResult.refresh_token);
      }

      return fn(refreshResult.access_token);
    }
    throw error;
  }
};

export interface RorTokenRefreshResponse {
  code: number;
  data: {
    accessToken: { token: string; createdAt: string; expiresAt: string };
    refreshToken: { token: string; createdAt: string; expiresAt: string } | null;
  };
  done: boolean;
  uuid: string;
  workflow: string;
}

/**
 * Helper: ยิง request ที่ต้องใช้ ROR External Token (B2Broker) พร้อม Auto-Refresh เมื่อ 401
 */
const withRorAuth = async <T>(fn: (token: string) => Promise<T>): Promise<T> => {
  const getRorToken = () => (typeof window !== "undefined" ? (localStorage.getItem("ror_auth_token") ?? "") : "");

  try {
    return await fn(getRorToken());
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 401) {
      const refreshToken = typeof window !== "undefined" ? localStorage.getItem("ror_refresh_token") : null;
      if (!refreshToken) throw error;

      const stored = typeof window !== "undefined" ? localStorage.getItem("ror_device_fingerprint") : null;
      const deviceFingerprint = stored ?? (await FingerprintUtils.signPayload(FingerprintUtils.collect()));
      if (!stored && typeof window !== "undefined") {
        localStorage.setItem("ror_device_fingerprint", deviceFingerprint);
      }

      let refreshResult: RorTokenRefreshResponse;
      try {
        refreshResult = await apiClient<RorTokenRefreshResponse>(
          ROR_ENDPOINTS.AUTH_REFRESH,
          {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ refreshToken, deviceFingerprint }),
          },
          undefined,
          SERVICE_BASE_ROR
        );
      } catch (refreshError) {
        if (typeof window !== "undefined") {
          ["ror_auth_token", "ror_refresh_token", "ror_device_fingerprint"].forEach((k) => localStorage.removeItem(k));
        }
        const msg = refreshError instanceof ApiError ? refreshError.message : "Session expired. Please login again.";
        console.error("[ROR] Token refresh failed:", msg, refreshError);
        throw new ApiError(msg, 401);
      }

      const newAccessToken = refreshResult.data.accessToken.token;
      localStorage.setItem("ror_auth_token", newAccessToken);
      if (refreshResult.data.refreshToken) {
        localStorage.setItem("ror_refresh_token", refreshResult.data.refreshToken.token);
      }

      return fn(newAccessToken);
    }
    throw error;
  }
};

export interface WizardResponse {
  code: number;
  data: any;
  done: boolean;
  uuid: string;
  workflow: string;
}

export interface Ror2faRequest {
  code: string;
  uuid: string;
}

export interface RorAuthResponse {
  code: number;
  data: {
    accessToken: {
      token: string;
      createdAt: string;
      expiresAt: string;
    } | null;
    refreshToken: {
      token: string;
      createdAt: string;
      expiresAt: string;
    } | null;
    tfaProviders: any[];
  } | null;
  done: boolean;
  uuid: string;
  workflow: string;
}

/**
 * RorService สำหรับจัดการข้อมูล Record of Ragnarok โดยเฉพาะ
 * ใช้ API_URL_STKPRO (Strikepro/B2Broker)
 */
export const RorService = {
  /**
   * ดึง Wizard UUID สำหรับใช้ในการ Login
   */
  getWizard: async (): Promise<ServiceResponse<WizardResponse>> => {
    try {
      // logger.info('Fetching ROR Wizard UUID');
      const result = await apiClient<WizardResponse>(
        ROR_ENDPOINTS.WIZARD,
        {
          method: "GET",
        },
        undefined,
        SERVICE_BASE_ROR
      );

      return { success: true, data: result, error: null };
    } catch (error) {
      // logger.error('Failed to fetch Wizard UUID', error instanceof Error ? error : String(error));
      return {
        success: false,
        data: null,
        error: { code: "WIZARD_ERROR", message: "ไม่สามารถดึงรหัสเซสชันได้" },
      };
    }
  },

  /**
   * เข้าสู่ระบบสำหรับหน้า ROR (B2Broker Login Flow)
   */
  login: async (data: { email: string; password: string; uuid: string; device_fingerprint: string }): Promise<ServiceResponse<RorAuthResponse>> => {
    try {
      // logger.info('Attempting ROR B2Broker login', { email: data.email });

      const result = await apiClient<RorAuthResponse>(
        ROR_ENDPOINTS.AUTH_LOGIN,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
            uuid: data.uuid,
            device_fingerprint: data.device_fingerprint,
          }),
        },
        undefined,
        SERVICE_BASE_ROR
      );

      // logger.info('ROR login successful', { email: data.email, workflow: result.workflow });
      return {
        success: true,
        data: result,
        error: null,
      };
    } catch (error) {
      let errorMsg = "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";

      if (error instanceof ApiError) {
        const details = error.details;
        // พยายามดึง message จาก error.details.details[0].issue หรือ error.message
        if (details?.error?.details?.[0]?.issue) {
          errorMsg = details.error.details[0].issue;
        } else if (details?.error?.message) {
          errorMsg = details.error.message;
        } else {
          errorMsg = error.message;
        }
      }

      // logger.error('ROR login failed', error instanceof Error ? error : String(error));

      return {
        success: false,
        data: null,
        error: { code: "ROR_LOGIN_ERROR", message: errorMsg },
      };
    }
  },

  /**
   * ยืนยันรหัส 2FA Google สำหรับ ROR
   */
  verify2faGoogle: async (data: { code: string; uuid: string }): Promise<ServiceResponse<RorAuthResponse>> => {
    try {
      // logger.info('Verifying ROR 2FA Google code', { uuid: data.uuid });

      const result = await apiClient<RorAuthResponse>(
        ROR_ENDPOINTS.AUTH_2FA_GOOGLE,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            code: data.code,
            uuid: data.uuid,
          }),
        },
        undefined,
        SERVICE_BASE_ROR
      );

      return { success: true, data: result, error: null };
    } catch (error) {
      const errorMsg = error instanceof ApiError ? error.message : "รหัส 2FA Google ไม่ถูกต้อง";
      // logger.error('ROR 2FA Google verification failed', error instanceof Error ? error : String(error));

      return {
        success: false,
        data: null,
        error: { code: "ROR_2FA_ERROR", message: errorMsg },
      };
    }
  },

  /**
   * ยืนยันรหัส 2FA SMS สำหรับ ROR
   */
  verify2faSms: async (data: { code: string; uuid: string }): Promise<ServiceResponse<RorAuthResponse>> => {
    try {
      // logger.info('Verifying ROR 2FA SMS code', { uuid: data.uuid });

      const result = await apiClient<RorAuthResponse>(
        ROR_ENDPOINTS.AUTH_2FA_SMS,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            code: data.code,
            uuid: data.uuid,
          }),
        },
        undefined,
        SERVICE_BASE_ROR
      );

      return { success: true, data: result, error: null };
    } catch (error) {
      const errorMsg = error instanceof ApiError ? error.message : "รหัส 2FA SMS ไม่ถูกต้อง";
      // logger.error('ROR 2FA SMS verification failed', error instanceof Error ? error : String(error));

      return {
        success: false,
        data: null,
        error: { code: "ROR_2FA_SMS_ERROR", message: errorMsg },
      };
    }
  },

  /**
   * ดึงรายการบัญชีเทรดจาก Strikepro (External API)
   * GET https://api.strikeprofx.com/api/v2/my/accounts?limit=1000
   */
  getAccounts: async (): Promise<ServiceResponse<RorAccountsResponse>> => {
    try {
      const result = await withRorAuth((token) =>
        apiClient<RorAccountsResponse>(
          ROR_ENDPOINTS.ACCOUNTS,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
              "accept-language": "th",
            },
          },
          { limit: 1000 },
          SERVICE_BASE_ROR
        )
      );

      return { success: true, data: result, error: null };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: { code: "ROR_ACCOUNTS_ERROR", message: "ไม่สามารถดึงข้อมูลบัญชีได้" },
      };
    }
  },

  /**
   * ดึงสถิติรายพอร์ต (Winrate, Profit, Balance) (Internal API) — ใช้ BE Token พร้อม Auto-Refresh
   */
  getPortGods: async (): Promise<ServiceResponse<any>> => {
    try {
      const result = await apiClient<any>(ROR.PORT_GODS, { method: "GET" }, undefined, SERVICE_BASE_ROR_INTERNAL);

      return { success: true, data: result, error: null };
    } catch (error) {
      return { success: false, data: null, error: { code: "PORT_GODS_ERROR", message: "ไม่สามารถดึงข้อมูลสถิติพอร์ตได้" } };
    }
  },

  /**
   * บันทึกข้อมูล Support ใหม่ (Internal API) — ใช้ BE Token พร้อม Auto-Refresh
   */
  addSupport: async (data: { slave_port: number; main_port: number }): Promise<ServiceResponse<any>> => {
    try {
      const result = await withBeAuth((token) =>
        apiClient<any>(
          ROR.SUPPORT_ADD,
          {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(data),
          },
          undefined,
          SERVICE_BASE_ROR_INTERNAL
        )
      );

      return { success: true, data: result, error: null };
    } catch (error) {
      return { success: false, data: null, error: { code: "SUPPORT_ADD_ERROR", message: "ไม่สามารถบันทึกข้อมูลการ Support ได้" } };
    }
  },

  /**
   * เข้าสู่ระบบ ROR Internal Backend (Internal API)
   */
  loginBe: async (data: RorBeLoginRequest): Promise<ServiceResponse<RorBeLoginResponse>> => {
    try {
      const result = await apiClient<RorBeLoginResponse>(
        ROR.LOGIN_BE,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email }),
        },
        undefined,
        SERVICE_BASE_ROR_INTERNAL
      );

      if (typeof window !== "undefined") {
        localStorage.setItem("ror_be_access_token", result.access_token);
        localStorage.setItem("ror_be_refresh_token", result.refresh_token);
      }

      return { success: true, data: result, error: null };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: { code: "ROR_BE_LOGIN_ERROR", message: "ไม่สามารถเข้าสู่ระบบ ROR Internal ได้" },
      };
    }
  },

  /**
   * ต่ออายุ Access Token ของ ROR Internal Backend (Internal API)
   */
  refreshTokenBe: async (): Promise<ServiceResponse<RorBeLoginResponse>> => {
    try {
      if (typeof window === "undefined") {
        return { success: false, data: null, error: { code: "CLIENT_ONLY", message: "Refresh token must be run on client side" } };
      }

      const refreshToken = localStorage.getItem("ror_be_refresh_token");
      if (!refreshToken) {
        return { success: false, data: null, error: { code: "MISSING_REFRESH_TOKEN", message: "ไม่พบ Refresh Token" } };
      }

      const result = await apiClient<RorBeLoginResponse>(
        ROR.REFRESH_TOKEN_BE,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refreshToken }),
        },
        undefined,
        SERVICE_BASE_ROR_INTERNAL
      );

      localStorage.setItem("ror_be_access_token", result.access_token);
      if (result.refresh_token) {
        localStorage.setItem("ror_be_refresh_token", result.refresh_token);
      }

      return { success: true, data: result, error: null };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: { code: "ROR_BE_REFRESH_ERROR", message: "ไม่สามารถต่ออายุ Token ได้" },
      };
    }
  },

  /**
   * ดึงข้อมูล Support Info รายพอร์ต (Internal API) — ใช้ BE Token พร้อม Auto-Refresh
   */
  getSupportInfo: async (data: SupportInfoRequest): Promise<ServiceResponse<SupportInfoResponse>> => {
    try {
      const result = await withBeAuth((token) =>
        apiClient<{ data: SupportInfoResponse }>(
          ROR.SUPPORT_INFO,
          {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ ports: data.ports }),
          },
          undefined,
          SERVICE_BASE_ROR_INTERNAL
        )
      );

      return { success: true, data: result.data, error: null };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: { code: "SUPPORT_INFO_ERROR", message: "ไม่สามารถดึงข้อมูล Support Info ได้" },
      };
    }
  },
};

export interface RorBeLoginRequest {
  email: string;
}

export interface RorBeLoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface RorBeRefreshTokenRequest {
  refresh_token: string;
}

export interface SupportInfoRequest {
  ports: string[];
}

export interface SupportInfoResponse {
  subscribe_list: Record<string, string[]>[];
  main_port: number;
  slave_port: number;
}

export interface RorAccountsResponse {
  total: number;
  data: RorAccount[];
}

export interface RorAccount {
  accountId: number;
  accountNumber: string;
  archive: boolean;
  caption: string;
  currency: {
    alphabeticCode: string;
    name: string;
    numericCode: number;
    minorUnit: number;
    hasDestinationTagOrMemo: boolean;
  };
  favourite: boolean;
  group: {
    id: number;
    name: string;
    priority: number;
    type: string;
  };
  platform: {
    id: number;
    name: string;
    caption: string;
    type: string;
    isDemo: boolean;
    terminalUrl: string;
  };
  priority: number;
  statement: {
    availableBalance: string;
    currentBalance: string;
    credit: string;
    equity: string;
    freeMargin: string;
    hold: string;
    margin: string;
    marginLevel: string;
    pnl: string;
    updateTime: string;
  };
  type: string;
  createTime: string;
  permissions: string[];
  productId: number;
  rights: number;
  leverage: number;
  productCurrency: any; // Simplified for now
}
