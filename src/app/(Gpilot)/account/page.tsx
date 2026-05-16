import { AccountPage, type AccountInitialData } from "@/features/account";
import type { Metadata } from "next";
import { apiServer, isRedirectError } from "@/shared/api/api-server";
import { SUB_ENDPOINTS, API_GATEWAY_SUB } from "@/shared/api/endpoint";
import type { ServiceResponse, AccountInfoList } from "@/shared/types/api";

export const metadata: Metadata = {
  title: "Account | GPilot Product",
  description: "Manage your GPilot trading account.",
};

export default async function Page() {
  let initialData: AccountInitialData = {};

  try {
    // ดึงข้อมูลพื้นฐานเฉพาะที่จำเป็นในหน้า Listing
    // Backend-Sub ส่งข้อมูลแบบ wrapped: { list: AccountInfo[], last_update: string | null }
    const infoRes = await apiServer<ServiceResponse<AccountInfoList>>(
      SUB_ENDPOINTS.ACCOUNT_INFO,
      { cache: 'no-store' },
      undefined,
      API_GATEWAY_SUB
    );

    if (infoRes.success && infoRes.data) {
      initialData = {
        info: infoRes.data.list,
        lastUpdate: infoRes.data.last_update
      };
    }
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("Failed to fetch account info on server:", error);
  }

  return <AccountPage initialData={initialData} />;
}
