"use client";

import {
  Box, Typography, Grid, Card, CardContent, Button,
  TextField, InputAdornment, Divider, Chip, Stack, Paper,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import SavingsIcon from "@mui/icons-material/Savings";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HealthService } from "@/shared/services/health-service";
import { API_GATEWAY_SUB } from "@/shared/api/endpoint";
import { createLogger } from "@/shared/utils/logger";

const logger = createLogger("WalletPage");

// ─── Mock Data ────────────────────────────────────────────────────────────────
const PROFIT_SHARING_BALANCE = 4_250.75;

const TRANSACTIONS: {
  id: number;
  type: "credit" | "deposit" | "withdraw";
  label: string;
  amount: number;
  date: string;
}[] = [
  { id: 1, type: "credit",   label: "Profit Sharing Reward",    amount:  1_250.00, date: "Apr 15, 2026" },
  { id: 2, type: "deposit",  label: "Deposit from Bank",         amount:  5_000.00, date: "Apr 12, 2026" },
  { id: 3, type: "withdraw", label: "Withdrawal to Strikepro",   amount: -2_000.00, date: "Apr 10, 2026" },
  { id: 4, type: "credit",   label: "Profit Sharing Reward",    amount:    980.00, date: "Apr 05, 2026" },
  { id: 5, type: "deposit",  label: "Deposit from Bank",         amount:  3_000.00, date: "Apr 01, 2026" },
  { id: 6, type: "withdraw", label: "Withdrawal to Strikepro",   amount: -1_500.00, date: "Mar 28, 2026" },
  { id: 7, type: "credit",   label: "Profit Sharing Reward",    amount:    640.50, date: "Mar 20, 2026" },
  { id: 8, type: "deposit",  label: "Deposit from Bank",         amount:  2_000.00, date: "Mar 15, 2026" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (val: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Math.abs(val));

const TX_META: Record<string, { icon: React.ReactNode; bg: string; color: string; label: string }> = {
  credit:  { icon: <EmojiEventsIcon  sx={{ fontSize: 18 }} />, bg: "rgba(34,211,238,0.15)",   color: "#22D3EE", label: "Reward"   },
  deposit: { icon: <ArrowDownwardIcon sx={{ fontSize: 18 }} />, bg: "rgba(16,185,129,0.15)",   color: "#10B981", label: "Deposit"  },
  withdraw:{ icon: <ArrowUpwardIcon  sx={{ fontSize: 18 }} />, bg: "rgba(239,68,68,0.15)",    color: "#EF4444", label: "Withdraw" },
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export function WalletPage() {
  const router = useRouter();
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const FEE_RATE = 0.015;
  const parsed   = parseFloat(withdrawAmount) || 0;
  const fee      = parsed * FEE_RATE;
  const net      = parsed - fee;

  return (
    <Box sx={{ p: { xs: 2, lg: 3 }, flex: 1 }}>

      {/* ── Page Header ─────────────────────────────────────── */}
      <Box sx={{ mb: { xs: 2.5, lg: 3 } }}>
        <Typography
          variant="h5"
          sx={{ fontFamily: '"Manrope", sans-serif', fontWeight: 700, color: "text.primary", fontSize: { xs: "1.25rem", lg: "1.5rem" } }}
        >
          Wallet
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
          Claim your rewards and manage withdrawals
        </Typography>
      </Box>

      {/* ── HERO: Profit Sharing ─────────────────────────────── */}
      <Paper
        elevation={0}
        sx={{
          mb: { xs: 2.5, lg: 3 },
          p: { xs: 3, lg: 4 },
          borderRadius: 4,
          position: "relative",
          overflow: "hidden",
          background: (t) =>
            t.palette.mode === "dark"
              ? "linear-gradient(135deg, rgba(8,145,178,0.25) 0%, rgba(34,211,238,0.08) 100%)"
              : "linear-gradient(135deg, rgba(8,145,178,0.12) 0%, rgba(34,211,238,0.04) 100%)",
          border: (t) =>
            `1px solid ${t.palette.mode === "dark" ? "rgba(34,211,238,0.25)" : "rgba(8,145,178,0.2)"}`,
        }}
      >
        {/* decorative blur blobs */}
        <Box sx={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", bgcolor: "rgba(34,211,238,0.07)", filter: "blur(40px)", pointerEvents: "none" }} />
        <Box sx={{ position: "absolute", bottom: -60, left: 60, width: 180, height: 180, borderRadius: "50%", bgcolor: "rgba(8,145,178,0.06)", filter: "blur(40px)", pointerEvents: "none" }} />

        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: { md: "center" }, gap: 3, position: "relative" }}>
          {/* Left: balance */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: "rgba(34,211,238,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <EmojiEventsIcon sx={{ color: "#22D3EE", fontSize: 18 }} />
              </Box>
              <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600, letterSpacing: 0.5 }}>
                PROFIT SHARING BALANCE
              </Typography>
            </Box>
            <Typography
              variant="h2"
              sx={{
                fontFamily: '"Manrope", sans-serif',
                fontWeight: 800,
                fontSize: { xs: "2.2rem", lg: "3rem" },
                background: "linear-gradient(135deg, #22D3EE 0%, #0891B2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.03em",
                lineHeight: 1,
                mb: 0.5,
              }}
            >
              {fmt(PROFIT_SHARING_BALANCE)}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.disabled" }}>
              Last updated: Today, 17:30
            </Typography>
          </Box>

        </Box>
      </Paper>

      {/* ── LOWER SECTION: Withdrawal | Transactions ─────────── */}
      <Grid container spacing={{ xs: 2, lg: 3 }} alignItems="flex-start">

        {/* Withdrawal Form */}
        <Grid size={{ xs: 12, md: 5, lg: 4 }}>
          <Card
            sx={{
              bgcolor: (t) =>
                t.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.8)",
              backdropFilter: "blur(12px)",
              border: (t) =>
                `1px solid ${t.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"}`,
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, lg: 3 }, "&:last-child": { pb: { xs: 2.5, lg: 3 } } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
                <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: "rgba(239,68,68,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ArrowUpwardIcon sx={{ color: "#EF4444", fontSize: 18 }} />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Withdrawal
                </Typography>
              </Box>

              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Destination"
                  value="Strikepro"
                  disabled
                  size="small"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
                <TextField
                  fullWidth
                  label="Amount (USD)"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                  size="small"
                  InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />

                {/* Fee breakdown */}
                {parsed > 0 && (
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: (t) => t.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
                      border: (t) => `1px solid ${t.palette.divider}`,
                    }}
                  >
                    {[
                      { label: "Amount",     value: `+${fmt(parsed)}`, color: "text.primary" },
                      { label: "Fee (1.5%)", value: `-${fmt(fee)}`,    color: "error.main"   },
                    ].map(({ label, value, color }) => (
                      <Box key={label} sx={{ display: "flex", justifyContent: "space-between", mb: 0.25 }}>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>{label}</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600, color }}>{value}</Typography>
                      </Box>
                    ))}
                    <Divider sx={{ my: 0.75 }} />
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>You receive</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: "success.main" }}>{fmt(net)}</Typography>
                    </Box>
                  </Box>
                )}

                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  disabled={parsed <= 0}
                  startIcon={<AccountBalanceWalletIcon sx={{ fontSize: 18 }} />}
                  sx={{ borderRadius: 2, py: 1.2, fontWeight: 700, textTransform: "none" }}
                >
                  Withdraw to Strikepro
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Client List Button */}
          <Button
            fullWidth
            variant="outlined"
            onClick={() => router.push("/clients")}
            startIcon={<PeopleAltIcon />}
            sx={{
              mt: 2,
              borderRadius: 3,
              py: 1.5,
              fontWeight: 700,
              textTransform: "none",
              color: "text.primary",
              borderColor: (t) => t.palette.mode === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)",
              bgcolor: (t) => t.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
              "&:hover": {
                bgcolor: (t) => t.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                borderColor: (t) => t.palette.mode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
              }
            }}
          >
            My Client List
          </Button>
        </Grid>

        {/* Transaction History */}
        <Grid size={{ xs: 12, md: 7, lg: 8 }}>
          <Card
            sx={{
              bgcolor: (t) =>
                t.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.8)",
              backdropFilter: "blur(12px)",
              border: (t) =>
                `1px solid ${t.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"}`,
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, lg: 3 }, "&:last-child": { pb: { xs: 2.5, lg: 3 } } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
                <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: "rgba(245,158,11,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <SwapHorizIcon sx={{ color: "#F59E0B", fontSize: 18 }} />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Transaction History
                </Typography>
              </Box>

              <Stack spacing={1}>
                {TRANSACTIONS.map((tx) => {
                  const meta = TX_META[tx.type];
                  return (
                    <Box
                      key={tx.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        px: 1.5,
                        py: 1.25,
                        borderRadius: 2,
                        transition: "background 0.15s",
                        "&:hover": {
                          bgcolor: (t) => t.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
                        },
                      }}
                    >
                      {/* Icon */}
                      <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: meta.bg, color: meta.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {meta.icon}
                      </Box>

                      {/* Label + Date */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {tx.label}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.disabled" }}>
                          {tx.date}
                        </Typography>
                      </Box>

                      {/* Amount + Badge */}
                      <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: '"Inter", monospace', color: tx.amount > 0 ? "success.main" : "error.main" }}>
                          {tx.amount > 0 ? "+" : "-"}{fmt(tx.amount)}
                        </Typography>
                        <Chip
                          label={meta.label}
                          size="small"
                          sx={{ height: 16, fontSize: "0.58rem", fontWeight: 700, mt: 0.25, bgcolor: meta.bg, color: meta.color, "& .MuiChip-label": { px: 1 } }}
                        />
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
}
