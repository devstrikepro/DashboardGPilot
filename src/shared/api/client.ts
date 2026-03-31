import { ApiError } from './api-error';
import { API_GATEWAY_MAIN } from './endpoint';

/**
 * apiClient (Client-side)
 * ใช้สำหรับการดึงข้อมูลจาก Backend โดยตรง
 */
export const apiClient = async <T>(
  endpoint: string, 
  options?: RequestInit,
  params?: Record<string, string | number | boolean | null | undefined>
): Promise<T> => {
  // ตรวจสอบว่า endpoint ขึ้นต้นด้วย / หรือไม่ ถ้าไม่ให้เติมนำหน้า
  const safeEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // ถ้า endpoint ไม่ได้ระบุ gateway มาให้ (ขึ้นต้นด้วย /api/gateway) ให้ default ไปที่ Main Gateway
  const finalEndpoint = safeEndpoint.startsWith('/api/gateway') 
    ? safeEndpoint 
    : `${API_GATEWAY_MAIN}${safeEndpoint}`;

  // สร้าง Query String จาก params
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
  }
  const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';

  const url = `${finalEndpoint}${queryString}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error || errorData.detail || response.statusText;
      
      // ดักจับรูปแบบ Error พิเศษ (422, 503)
      throw new ApiError(
        typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg), 
        response.status,
        errorData
      );
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error instanceof Error ? error.message : 'Unknown Network Error', 500);
  }
};
