import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AnalyticsService } from '../analytics-service';
import { apiClient } from '@/shared/api/client';
import { ENDPOINTS } from '@/shared/api/endpoint';

// Mock the apiClient
vi.mock('@/shared/api/client', () => ({
  apiClient: vi.fn(),
}));

describe('AnalyticsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getGroupedTrades', () => {

    it('getGroupedTrades_Successful_ReturnsData', async () => {
      const mockData = { list: [] } as any;
      vi.mocked(apiClient).mockResolvedValue({ success: true, data: mockData, error: null });

      const result = await AnalyticsService.getGroupedTrades();

      expect(apiClient).toHaveBeenCalledWith(ENDPOINTS.TRADES_GROUPED, undefined, undefined);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
    });
  });

  describe('getProductDetailSummary', () => {
    it('getProductDetailSummary_Successful_ReturnsData', async () => {
      const mockData = { timeline: [] } as any;
      vi.mocked(apiClient).mockResolvedValue({ success: true, data: mockData, error: null });

      const result = await AnalyticsService.getProductDetailSummary();

      expect(apiClient).toHaveBeenCalledWith(ENDPOINTS.PRODUCT_DETAIL_SUMMARY, undefined, undefined);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
    });
  });
});
