import { Metadata } from "next";
import DashboardPage from "@/features/dashboard/DashboardPage";

export const metadata: Metadata = {
  title: "Trading Dashboard | Gpilot",
  description: "Real-time trading performance and metrics dashboard.",
};

export default function Page() {
  return <DashboardPage />;
}
