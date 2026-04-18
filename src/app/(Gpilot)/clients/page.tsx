import { Metadata } from "next";
import { ClientsPage } from "@/features/clients/ClientsPage";

export const metadata: Metadata = {
  title: "My Clients | GPilot Product",
  description: "Manage your clients, view portfolios, and take quick trading actions.",
};

export default function Page() {
  return <ClientsPage />;
}
