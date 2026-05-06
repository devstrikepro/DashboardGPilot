import { Metadata } from "next";
import { DashboardPage } from "@/features/dashboard";
import { apiServer } from "@/shared/api/api-server";
import { SUB_ENDPOINTS, API_GATEWAY_SUB } from "@/shared/api/endpoint";
import type { LoginResponse } from "@/shared/types/auth";
import type { ServiceResponse } from "@/shared/types/api";

export const metadata: Metadata = {
  title: "Dashboard | GPilot Product",
  description: "Products overview and performance dashboard.",
};

export default async function Page() {
  // หมายเหตุ: ปัจจุบัน SUB_ENDPOINTS.ACCOUNT_PROFILE คืนค่าเป็น Array ของบัญชี MT5
  // ซึ่งไม่มีข้อมูล menu/role สำหรับหน้า Dashboard ดังนั้นเราจะให้ Client-side Auth จัดการแทนไปก่อน
  const initialUser = null;

  return <DashboardPage initialUser={initialUser} />;
}
