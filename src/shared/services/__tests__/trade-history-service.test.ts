import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TradeHistoryService } from '../trade-history-service';
import { apiClient } from '@/shared/api/client';

// Mock the apiClient
vi.mock('@/shared/api/client', () => ({
  apiClient: vi.fn(),
}));

describe('TradeHistoryService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset environment variables if needed
    process.env.NEXT_PUBLIC_IS_MOCK_MODE = 'false';
  });

  it('should return mock data when IS_MOCK_MODE is true', async () => {
    process.env.NEXT_PUBLIC_IS_MOCK_MODE = 'true';
    
    // We need to re-import or handle the logic inside the service
    // In trade-history-service.ts, IS_MOCK_MODE is evaluated at the top level
    // so we might need to use vi.stubEnv or similar if it's dynamic
    
    const result = await TradeHistoryService.getHistory();
    
    expect(result.success).toBe(true);
    expect(result.data?.total).toBeGreaterThan(0);
    expect(apiClient).not.toHaveBeenCalled();
  });

  it('should call apiClient when IS_MOCK_MODE is false', async () => {
    process.env.NEXT_PUBLIC_IS_MOCK_MODE = 'false';
    const mockData = { total: 1, data: [] };
    vi.mocked(apiClient).mockResolvedValue(mockData);

    const result = await TradeHistoryService.getHistory();

    expect(apiClient).toHaveBeenCalledWith('/api/v1/trades');
    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockData);
  });

  it('should handle API errors correctly', async () => {
    process.env.NEXT_PUBLIC_IS_MOCK_MODE = 'false';
    vi.mocked(apiClient).mockRejectedValue(new Error('Network Error'));

    const result = await TradeHistoryService.getHistory();

    expect(result.success).toBe(false);
    expect(result.error).toBe('เกิดข้อผิดพลาดในการดึงข้อมูลประวัติการทำรายการ');
  });
});
