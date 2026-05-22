export const FEE_RATE = 0.015;

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

export const fmt = (val: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Math.abs(val));

export const TX_META: Record<string, { bg: string; color: string; label: string }> = {
  credit: { bg: "rgba(34,211,238,0.15)", color: "#22D3EE", label: "Reward" },
  deposit: { bg: "rgba(16,185,129,0.15)", color: "#10B981", label: "Deposit" },
  withdraw: { bg: "rgba(239,68,68,0.15)", color: "#EF4444", label: "Withdraw" },
};

export const CARD_SX = {
  bgcolor: (t: { palette: { mode: string } }) =>
    t.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.8)",
  backdropFilter: "blur(12px)",
  border: (t: { palette: { mode: string } }) =>
    `1px solid ${t.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"}`,
  borderRadius: 3,
};
