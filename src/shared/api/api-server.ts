import { cookies } from "next/headers";
import { ApiError } from "./api-error";
import { API_GATEWAY_MAIN, API_GATEWAY_SUB } from "./endpoint";

// แผนผังการแมป Gateway Path ไปยัง Backend URL จริง (เพื่อใช้เรียกฝั่ง Server)
const SERVER_GATEWAY_MAP: Record<string, string> = {
  "/api/gateway/gpilot": "http://103.91.191.171:8000",
  "/api/gateway/safegrow": "http://103.91.191.171:8000",
  "/api/gateway/hqultimate": "http://103.91.191.171:8000",
  "/api/gateway/ppvp": "http://103.91.191.171:8000",
  "/api/gateway/goldenboy": "http://103.91.191.171:8000",
  "/api/gateway/sub": "http://103.91.191.172:8000",
  "/api/gateway/ror": "https://api.strikeprofx.com",
  "/api/gateway/ror-internal": "http://103.91.191.171:8002",
};

/**
 * apiServer
 * ใช้สำหรับการดึงข้อมูลใน Server Components
 * รองรับการดึง Token จาก Cookies อัตโนมัติ
 */
export async function apiServer<T>(
  endpoint: string,
  options?: RequestInit,
  params?: Record<string, string | number | boolean | null | undefined>,
  serviceBase?: string
): Promise<T> {
  const base = serviceBase || API_GATEWAY_MAIN;
  const urlBase = SERVER_GATEWAY_MAP[base] || "http://103.91.191.171:8000";
  
  const isSubService = base.includes('/api/gateway/sub');
  const isRorService = base.includes('/api/gateway/ror');
  
  // Logic การสร้าง Path เหมือนกับ apiClient
  const getAccountId = (b: string) => {
    if (b.includes('/api/gateway/')) {
      const parts = b.split('/api/gateway/');
      return parts[1] || 'gpilot';
    }
    return 'gpilot';
  };
  const accountId = getAccountId(base);

  const safeEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  let apiPath = '';
  if (isSubService) {
    apiPath = `/api/v1${safeEndpoint}`;
  } else if (isRorService) {
    apiPath = safeEndpoint;
  } else {
    apiPath = `/api/v1/${accountId}${safeEndpoint}`;
  }

  // สร้าง Query String
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
  }
  const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';

  const url = `${urlBase}${apiPath}${queryString}`;
  
  // ดึง Token จาก Cookie (ฝั่ง Server)
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
      // Next.js caching options สามารถส่งผ่าน options.next ได้
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error || errorData.detail || response.statusText;
      throw new ApiError(
        typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg),
        response.status,
        errorData
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(error instanceof Error ? error.message : "Network error", 500);
  }
}
