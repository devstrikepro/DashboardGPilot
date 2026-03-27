import { Metadata } from "next";
import AnalyticsPage from "@/features/analytics/AnalyticsPage";

export const metadata: Metadata = {
  title: "Analytics | Gpilot",
  description: "Advanced risk metrics and portfolio analysis.",
};

export default async function Page() {
  return <AnalyticsPage />;
}
