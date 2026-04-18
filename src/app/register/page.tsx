import { RegisterPage } from "@/features/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | GPilot Product",
  description: "Create your GPilot account and join the community.",
};

export default function Page() {
  return <RegisterPage />;
}
