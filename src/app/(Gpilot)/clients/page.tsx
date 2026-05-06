import { Metadata } from "next";
import { ClientsPage, type ClientsInitialData } from "@/features/clients/ClientsPage";

export const metadata: Metadata = {
  title: "My Clients | GPilot Product",
  description: "Manage your clients, view portfolios, and take quick trading actions.",
};

export default async function Page() {
  let initialData: ClientsInitialData = {};

  // NOTE: ปัจจุบันใช้ Mock Data ฝั่ง Client แต่โครงสร้างนี้เตรียมไว้สำหรับการดึงข้อมูลจริงจาก Server ในอนาคต
  // ตัวอย่าง: const response = await apiServer(...)

  return <ClientsPage initialData={initialData} />;
}
