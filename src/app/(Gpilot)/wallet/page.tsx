import { Metadata } from "next";
import { WalletPage, type WalletInitialData } from "@/features/wallet/WalletPage";
import { apiServer, isRedirectError } from "@/shared/api/api-server";
import { SUB_ENDPOINTS, API_GATEWAY_SUB } from "@/shared/api/endpoint";
import type { ServiceResponse, AccountFinance } from "@/shared/types/api";

export const metadata: Metadata = {
  title: "Wallet | GPilot Product",
  description: "Manage your funds, claim profit sharing rewards, and track transactions.",
};

export default async function Page() {
  let initialData: WalletInitialData = {};

  try {
    // พยายามดึงข้อมูลการเงินเพื่อดูยอด Profit Sharing (ถ้ามีใน API)
    const response = await apiServer<ServiceResponse<AccountFinance[]>>(
      SUB_ENDPOINTS.ACCOUNT_FINANCE,
      { cache: 'no-store' },
      undefined,
      API_GATEWAY_SUB
    );

    if (response.success && response.data && response.data.length > 0) {
      initialData = {
        profitSharingBalance: response.data[0].totalProfitSharing || 0
      };
    }
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("Failed to fetch wallet initial data on server:", error);
  }

  return <WalletPage initialData={initialData} />;
}
