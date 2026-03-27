import { ApiError } from './api-error';

/**
 * apiClient (Client-side)
 * ใช้สำหรับการดึงข้อมูลฝั่ง Client โดยจะวิ่งผ่าน Next.js Gateway Proxy (`/api/gateway/`)
 * เพื่อลดปัญหา CORS และซ่อน Backend URL จริง
 */
export const apiClient = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  // Use proxy path when running on client side (e.g. /api/gateway/trade-history)
  const url = `/api/gateway${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.NEXT_PUBLIC_API_KEY ?? '',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorMsg = await response.text().catch(() => response.statusText);
      throw new ApiError(`API fetch error on ${endpoint}: ${errorMsg}`, response.status);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error instanceof Error ? error.message : 'Unknown Network Error', 500);
  }
};
