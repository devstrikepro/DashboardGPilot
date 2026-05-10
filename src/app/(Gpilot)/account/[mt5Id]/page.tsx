import { AccountPage, type AccountInitialData } from "@/features/account";
import type { Metadata } from "next";
import { apiServer, isRedirectError } from "@/shared/api/api-server";
import { SUB_ENDPOINTS, API_GATEWAY_SUB } from "@/shared/api/endpoint";
import type { ServiceResponse, AccountProfile, AccountFinance, GroupedTradesResponse } from "@/shared/types/api";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Account Detail | GPilot Product",
    description: "View details of your trading account.",
};

interface DetailPageProps {
    params: Promise<{ mt5Id: string }>;
}

export default async function Page({ params }: DetailPageProps) {
    const { mt5Id } = await params;
    const mt5IdNum = parseInt(mt5Id, 10);

    // ป้องกันกรณี mt5Id ไม่เป็นตัวเลข (NaN) ซึ่งจะทำให้ API return 422
    if (isNaN(mt5IdNum)) {
        console.error(`Invalid mt5Id: ${mt5Id}`);
        return redirect("/account");
    }

    let initialData: AccountInitialData = {};

    try {
        // ดึงข้อมูลเจาะจงรายพอร์ตตั้งแต่บน Server
        // ใช้ mt5_id (snake_case) เพื่อความแน่นอนตามมาตรฐาน Backend-Sub
        const [profileRes, financeRes, tradesRes] = await Promise.all([
            apiServer<ServiceResponse<AccountProfile>>(
                SUB_ENDPOINTS.ACCOUNT_PROFILE,
                { cache: "no-store" },
                { mt5_id: mt5IdNum },
                API_GATEWAY_SUB
            ),
            apiServer<ServiceResponse<AccountFinance>>(
                SUB_ENDPOINTS.ACCOUNT_FINANCE,
                { cache: "no-store" },
                { mt5_id: mt5IdNum },
                API_GATEWAY_SUB
            ),
            apiServer<ServiceResponse<GroupedTradesResponse>>(
                SUB_ENDPOINTS.ACCOUNT_TRADES,
                { cache: "no-store" },
                { mt5_id: mt5IdNum, page: 1, limit: 10 },
                API_GATEWAY_SUB
            ),
        ]);

        initialData = {
            profile: profileRes.success ? profileRes.data : null,
            finance: financeRes.success ? financeRes.data : null,
            tradesData: tradesRes.success ? tradesRes.data : null,
        };
    } catch (error) {
        if (isRedirectError(error)) throw error;
        console.error(`Failed to fetch account detail (${mt5IdNum}) on server:`, error);
    }

    return <AccountPage initialData={initialData} mt5Id={mt5IdNum} />;
}
