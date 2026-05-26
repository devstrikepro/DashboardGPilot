import { TransactionsPage } from "@/features/transactions/TransactionsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transactions | GPilot Product",
  description: "View and manage your deposit and withdrawal transactions.",
};

export default function Page() {
  return <TransactionsPage />;
}
