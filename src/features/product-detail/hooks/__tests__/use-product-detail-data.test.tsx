import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useProductDetailData } from "../use-product-detail-data";
import { AnalyticsService } from "@/shared/services/analytics-service";
import { HealthService } from "@/shared/services/health-service";
import { createWrapper } from "@/shared/utils/__tests__/test-utils";
import { useApiHealth } from "@/shared/providers/api-health-provider";

// Mock services
vi.mock("@/shared/services/analytics-service", () => ({
  AnalyticsService: {
    getProductDetail: vi.fn(),
  },
}));

vi.mock("@/shared/services/health-service", () => ({
  HealthService: {
    checkHealth: vi.fn(),
  },
}));

vi.mock("@/shared/providers/api-health-provider", () => ({
  useApiHealth: vi.fn(() => ({ isHealthy: true })),
}));

describe("useProductDetailData Hook (TanStack Query)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockProductDetail = {
    balance: 5000,
    equity_curve: [{ time: "2024-03-25T10:00:00Z", equity: 5000 }],
    symbol_statistics: { list: [], total_trades: 5 },
    win_rate: 65,
    recovery_factor: 1.5,
    max_drawdown: 10,
    profit_factor: 2.1,
    profit_today: 100,
    avg_profit_week: 500,
    avg_profit_month: 2000,
  } as any;

  it("useProductDetailData_SuccessfulFetch_ReturnsFormattedData", async () => {
    vi.mocked(AnalyticsService.getProductDetail).mockResolvedValue({
      success: true,
      data: mockProductDetail,
      error: null
    });
    vi.mocked(HealthService.checkHealth).mockResolvedValue({
      success: true,
      data: { status: "ok" },
      error: null
    });

    const { result } = renderHook(() => useProductDetailData("gpilot"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.account.balance).toBe(5000);
    expect(result.current.performance.winRate).toBe(65);
    expect(result.current.equityData).toHaveLength(1);
    expect(result.current.error).toBeNull();
  });

  it("useProductDetailData_ApiError_ReturnsErrorMessage", async () => {
    vi.mocked(AnalyticsService.getProductDetail).mockResolvedValue({
      success: false,
      error: { code: "SERVER_ERROR", message: "Internal Server Error" },
      data: {} as any
    });
    vi.mocked(HealthService.checkHealth).mockResolvedValue({
      success: true,
      data: { status: "ok" },
      error: null
    });

    const { result } = renderHook(() => useProductDetailData(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("Internal Server Error");
    expect(result.current.account.balance).toBe(0);
  });
});
