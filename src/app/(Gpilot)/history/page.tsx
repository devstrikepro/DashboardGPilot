import { Metadata } from "next";
import HistoryPage from "@/features/history/HistoryPage";
import { apiServer } from "@/shared/api/api-server";
import { SUB_ENDPOINTS, API_GATEWAY_SUB } from "@/shared/api/endpoint";
import type { ServiceResponse, GroupedTradesResponse } from "@/shared/types/api";

export const metadata: Metadata = {
  title: "Trade History | Gpilot",
  description: "Complete trading record with filtering and totals.",
};

export default async function Page() {
  let initialData: GroupedTradesResponse | null = null;

  try {
    // ดึงข้อมูลประวัติการเทรดชุดแรกตั้งแต่บน Server
    const response = await apiServer<ServiceResponse<GroupedTradesResponse>>(
      SUB_ENDPOINTS.ACCOUNT_TRADES,
      { cache: 'no-store' },
      { page: 1, limit: 10 },
      API_GATEWAY_SUB
    );

    if (response.success && response.data) {
      initialData = Array.isArray(response.data) ? response.data[0] : response.data;
    }
  } catch (error) {
    console.error("Failed to fetch history initial data on server:", error);
  }

  return <HistoryPage initialData={initialData} />;
}
