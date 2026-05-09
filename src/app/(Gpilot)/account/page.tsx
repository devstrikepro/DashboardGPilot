import { AccountPage, type AccountInitialData } from "@/features/account";
import type { Metadata } from "next";
import { apiServer, isRedirectError } from "@/shared/api/api-server";
import { SUB_ENDPOINTS, API_GATEWAY_SUB } from "@/shared/api/endpoint";
import type { ServiceResponse, AccountInfo } from "@/shared/types/api";

export const metadata: Metadata = {
  title: "Account | GPilot Product",
  description: "Manage your GPilot trading account.",
};

export default async function Page() {
  let initialData: AccountInitialData = {};

  try {
    // ดึงข้อมูลพื้นฐานเฉพาะที่จำเป็นในหน้า Listing
    const infoRes = await apiServer<ServiceResponse<AccountInfo[]>>(
      SUB_ENDPOINTS.ACCOUNT_INFO,
      { cache: 'no-store' },
      undefined,
      API_GATEWAY_SUB
    );

    if (infoRes.success) {
      initialData = {
        info: infoRes.data
      };
    }
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("Failed to fetch account info on server:", error);
  }

  return <AccountPage initialData={initialData} />;
}
