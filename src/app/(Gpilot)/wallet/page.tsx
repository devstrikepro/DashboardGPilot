import { Metadata } from "next";
import { WalletPage } from "@/features/wallet/WalletPage";

export const metadata: Metadata = {
  title: "Wallet | GPilot Product",
  description: "Manage your funds, claim profit sharing rewards, and track transactions.",
};

export default function Page() {
  return <WalletPage />;
}
