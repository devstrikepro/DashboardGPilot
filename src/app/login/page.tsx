import { LoginPage } from "@/features/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | GPilot Product",
  description: "Access your GPilot trading account.",
};

export default function Page() {
  return <LoginPage />;
}
