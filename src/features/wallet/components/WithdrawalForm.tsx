"use client";

import { useState } from "react";
import { Alert, Box, Button, Card, CardContent, CircularProgress, Divider, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { useRouter } from "next/navigation";
import { CARD_SX, FEE_RATE, fmt } from "../constants";
import { SectionIconBox } from "./SectionIconBox";
import { ProfitSharingService } from "@/shared/services/profit-sharing-service";
import type { ProfitSharingProduct } from "@/shared/types/api";
import crypto from "crypto";

interface WithdrawalFormProps {
  activeProduct: ProfitSharingProduct | null;
}

export function WithdrawalForm({ activeProduct }: WithdrawalFormProps) {
  const router = useRouter();
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const parsed = parseFloat(withdrawAmount) || 0;
  const fee = parsed * FEE_RATE;
  const net = parsed - fee;

  const handleWithdraw = async () => {
    if (!activeProduct || parsed <= 0) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    const res = await ProfitSharingService.withdrawal({
      product_name: activeProduct.product_name,
      product_port: activeProduct.product_port,
      amount: parsed,
    });

    setLoading(false);
    if (res.success) {
      setSuccess(true);
      setWithdrawAmount("");
    } else {
      setError(res.message || "ไม่สามารถทำรายการถอนได้");
    }
  };

  function encrypt(port?: number) {
    if (port == null) return "";
    const keySource = process.env.NEXT_PUBLIC_ENCRYPT_KEY ?? "gpilot-secret-key";
    const key = Buffer.alloc(32);
    Buffer.from(keySource, "utf8").copy(key);

    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

    let encrypted = cipher.update(port.toString(), "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag().toString("hex");

    return `${iv.toString("hex")}:${encrypted}:${authTag}`;
  }

  return (
    <>
      <Card sx={CARD_SX}>
        <CardContent sx={{ p: { xs: 2.5, lg: 3 }, "&:last-child": { pb: { xs: 2.5, lg: 3 } } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
            <SectionIconBox bg="rgba(239,68,68,0.15)" color="#EF4444">
              <ArrowUpwardIcon sx={{ fontSize: 18 }} />
            </SectionIconBox>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Withdrawal
            </Typography>
          </Box>

          <Stack spacing={2}>
            <TextField fullWidth label="Destination" value="Strikepro" disabled size="small" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
            <TextField
              fullWidth
              label="Amount (USD)"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value.replace(/[^0-9.]/g, ""))}
              size="small"
              slotProps={{ input: { startAdornment: <InputAdornment position="start">$</InputAdornment> } }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />

            {parsed > 0 && (
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)"),
                  border: (t) => `1px solid ${t.palette.divider}`,
                }}
              >
                {[
                  { label: "Amount", value: `+${fmt(parsed)}`, color: "text.primary" },
                  { label: "Fee (1.5%)", value: `-${fmt(fee)}`, color: "error.main" },
                ].map(({ label, value, color }) => (
                  <Box key={label} sx={{ display: "flex", justifyContent: "space-between", mb: 0.25 }}>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      {label}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600, color }}>
                      {value}
                    </Typography>
                  </Box>
                ))}
                <Divider sx={{ my: 0.75 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    You receive
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: "success.main" }}>
                    {fmt(net)}
                  </Typography>
                </Box>
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ borderRadius: 2 }}>
                Withdrawal submitted successfully
              </Alert>
            )}

            <Button
              fullWidth
              variant="contained"
              color="error"
              disabled={parsed <= 0 || !activeProduct || loading}
              onClick={handleWithdraw}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <AccountBalanceWalletIcon sx={{ fontSize: 18 }} />}
              sx={{ borderRadius: 2, py: 1.2, fontWeight: 700, textTransform: "none" }}
            >
              {loading ? "Processing..." : "Withdraw to Strikepro"}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Button
        fullWidth
        variant="outlined"
        onClick={() => router.push("/clients?p=" + encrypt(activeProduct?.product_port))}
        startIcon={<PeopleAltIcon />}
        sx={{
          mt: 2,
          borderRadius: 3,
          py: 1.5,
          fontWeight: 700,
          textTransform: "none",
          color: "text.primary",
          borderColor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"),
          bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)"),
          "&:hover": {
            bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"),
            borderColor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"),
          },
        }}
      >
        My Client List
      </Button>
    </>
  );
}
