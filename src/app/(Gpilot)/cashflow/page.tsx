import { Metadata } from "next";
import CashflowPage from "@/features/cashflow/CashflowPage";

export const metadata: Metadata = {
  title: "Cashflow | Gpilot",
  description: "Track deposits, withdrawals, and account history.",
};

export default function Page() {
  return <CashflowPage />;
}
