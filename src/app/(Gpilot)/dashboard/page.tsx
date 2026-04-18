import { Metadata } from "next";
import { DashboardPage } from "@/features/dashboard";

export const metadata: Metadata = {
  title: "Dashboard | GPilot Product",
  description: "Products overview and performance dashboard.",
};

export default function Page() {
  return <DashboardPage />;
}
