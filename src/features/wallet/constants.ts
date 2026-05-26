import type { ProfitSharingTransaction } from "@/shared/types/api";

export const FEE_RATE = 0.015;

export const MOCK_PROFIT_SHARING_TRANSACTIONS: ProfitSharingTransaction[] = [
  { id: "tx-001", user_id: "u-01", product_name: "Alpha Fund", product_port: 1001, amount: 1_250.0, status: "credit", note: "Profit Sharing Reward", requested_at: "2026-05-01T10:00:00Z", reviewed_at: "2026-05-01T12:00:00Z", reviewed_by: "admin" },
  { id: "tx-002", user_id: "u-01", product_name: "Alpha Fund", product_port: 1001, amount: 5_000.0, status: "deposit", note: "Deposit from Bank", requested_at: "2026-04-28T09:30:00Z", reviewed_at: "2026-04-28T11:00:00Z", reviewed_by: "admin" },
  { id: "tx-003", user_id: "u-01", product_name: "Alpha Fund", product_port: 1001, amount: -2_000.0, status: "withdraw", note: "Withdrawal to Strikepro", requested_at: "2026-04-25T14:00:00Z", reviewed_at: "2026-04-25T16:30:00Z", reviewed_by: "admin" },
  { id: "tx-004", user_id: "u-01", product_name: "Beta Fund", product_port: 1002, amount: 980.0, status: "credit", note: "Profit Sharing Reward", requested_at: "2026-04-20T08:00:00Z", reviewed_at: "2026-04-20T10:00:00Z", reviewed_by: "admin" },
  { id: "tx-005", user_id: "u-01", product_name: "Beta Fund", product_port: 1002, amount: 3_000.0, status: "deposit", note: "Deposit from Bank", requested_at: "2026-04-15T11:00:00Z", reviewed_at: "2026-04-15T13:00:00Z", reviewed_by: "admin" },
  { id: "tx-006", user_id: "u-01", product_name: "Alpha Fund", product_port: 1001, amount: -1_500.0, status: "withdraw", note: "Withdrawal to Strikepro", requested_at: "2026-04-10T09:00:00Z", reviewed_at: "2026-04-10T11:00:00Z", reviewed_by: "admin" },
  { id: "tx-007", user_id: "u-01", product_name: "Alpha Fund", product_port: 1001, amount: -500.0, status: "rejected", note: "Withdrawal Rejected", requested_at: "2026-04-05T15:00:00Z", reviewed_at: "2026-04-06T09:00:00Z", reviewed_by: "admin" },
  { id: "tx-008", user_id: "u-01", product_name: "Beta Fund", product_port: 1002, amount: 640.5, status: "credit", note: "Profit Sharing Reward", requested_at: "2026-03-31T08:00:00Z", reviewed_at: "2026-03-31T10:00:00Z", reviewed_by: "admin" },
  { id: "tx-009", user_id: "u-01", product_name: "Alpha Fund", product_port: 1001, amount: -750.0, status: "pending", note: "Withdrawal Pending Review", requested_at: "2026-05-24T08:00:00Z", reviewed_at: null, reviewed_by: null },
  { id: "tx-010", user_id: "u-01", product_name: "Beta Fund", product_port: 1002, amount: -1_200.0, status: "approved", note: "Withdrawal Approved", requested_at: "2026-05-20T10:00:00Z", reviewed_at: "2026-05-21T09:00:00Z", reviewed_by: "admin" },
];

export const TRANSACTIONS: {
  id: number;
  type: "credit" | "deposit" | "withdraw";
  label: string;
  amount: number;
  date: string;
}[] = [
  { id: 1, type: "credit", label: "Profit Sharing Reward", amount: 1_250.0, date: "Apr 15, 2026" },
  { id: 2, type: "deposit", label: "Deposit from Bank", amount: 5_000.0, date: "Apr 12, 2026" },
  { id: 3, type: "withdraw", label: "Withdrawal to Strikepro", amount: -2_000.0, date: "Apr 10, 2026" },
  { id: 4, type: "credit", label: "Profit Sharing Reward", amount: 980.0, date: "Apr 05, 2026" },
  { id: 5, type: "deposit", label: "Deposit from Bank", amount: 3_000.0, date: "Apr 01, 2026" },
  { id: 6, type: "withdraw", label: "Withdrawal to Strikepro", amount: -1_500.0, date: "Mar 28, 2026" },
  { id: 7, type: "credit", label: "Profit Sharing Reward", amount: 640.5, date: "Mar 20, 2026" },
  { id: 8, type: "deposit", label: "Deposit from Bank", amount: 2_000.0, date: "Mar 15, 2026" },
];

export const fmt = (val: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Math.abs(val));

export const TX_META: Record<string, { bg: string; color: string; label: string }> = {
  credit: { bg: "rgba(34,211,238,0.15)", color: "#22D3EE", label: "Reward" },
  deposit: { bg: "rgba(16,185,129,0.15)", color: "#10B981", label: "Deposit" },
  withdraw: { bg: "rgba(239,68,68,0.15)", color: "#EF4444", label: "Withdraw" },
  rejected: { bg: "rgba(249,115,22,0.15)", color: "#F97316", label: "Rejected" },
  pending: { bg: "rgba(245,158,11,0.15)", color: "#F59E0B", label: "Pending" },
  approved: { bg: "rgba(139,92,246,0.15)", color: "#8B5CF6", label: "Approved" },
};

export const CARD_SX = {
  bgcolor: (t: { palette: { mode: string } }) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.8)"),
  backdropFilter: "blur(12px)",
  border: (t: { palette: { mode: string } }) => `1px solid ${t.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"}`,
  borderRadius: 3,
};
