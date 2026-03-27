import { Metadata } from "next";
import HistoryPage from "@/features/history/HistoryPage";

export const metadata: Metadata = {
  title: "Trade History | Gpilot",
  description: "Complete trading record with filtering and totals.",
};

export default function Page() {
  return <HistoryPage />;
}
