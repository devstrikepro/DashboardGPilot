"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, Box, Typography, Stack, Chip, Tab, Tabs, Skeleton } from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { AdminService, type AdminWithdrawal } from "@/shared/services/admin-service";
import { CARD_SX } from "../wallet/constants";
import { SectionIconBox } from "../wallet/components/SectionIconBox";

const STATUS_META: Record<string, { bg: string; color: string; label: string; icon: React.ReactNode }> = {
  pending: {
    bg: "rgba(245,158,11,0.15)",
    color: "#F59E0B",
    label: "Pending",
    icon: <HourglassEmptyIcon sx={{ fontSize: 18 }} />,
  },
  approved: {
    bg: "rgba(16,185,129,0.15)",
    color: "#10B981",
    label: "Approved",
    icon: <CheckCircleOutlineIcon sx={{ fontSize: 18 }} />,
  },
  rejected: {
    bg: "rgba(239,68,68,0.15)",
    color: "#EF4444",
    label: "Rejected",
    icon: <CancelOutlinedIcon sx={{ fontSize: 18 }} />,
  },
};

const fmt = (val: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Math.abs(val));

const formatDate = (dateStr: string) => {
  try {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
};

const transactionsTab = ["Pending", "Approved", "Rejected"].map((e) => ({ key: e.toLowerCase(), label: e }));

function WithdrawalSkeleton() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 1.5, py: 1.25 }}>
      <Skeleton variant="rounded" width={36} height={36} sx={{ borderRadius: 2, flexShrink: 0 }} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Skeleton variant="text" width="55%" height={20} />
        <Skeleton variant="text" width="35%" height={16} />
      </Box>
      <Box sx={{ textAlign: "right", flexShrink: 0 }}>
        <Skeleton variant="text" width={80} height={20} />
        <Skeleton variant="rounded" width={60} height={16} sx={{ mt: 0.25 }} />
      </Box>
    </Box>
  );
}

export function TransactionsPage() {
  const [activeTab, setActiveTab] = useState<string>("pending");
  const [adminWithdrawals, setAdminWithdrawals] = useState<AdminWithdrawal[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    AdminService.getWithdrawals(activeTab).then((res) => {
      if (res.success && res.data) {
        setAdminWithdrawals(res.data);
      } else {
        setAdminWithdrawals([]);
      }
      setIsLoading(false);
    });
  }, [activeTab]);

  return (
    <Box sx={{ p: { xs: 2, lg: 3 }, flex: 1 }}>
      <Card sx={CARD_SX}>
        <CardContent sx={{ p: { xs: 2.5, lg: 3 }, "&:last-child": { pb: { xs: 2.5, lg: 3 } } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
            <SectionIconBox bg="rgba(245,158,11,0.15)" color="#F59E0B">
              <SwapHorizIcon sx={{ fontSize: 18 }} />
            </SectionIconBox>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Transaction History
            </Typography>
          </Box>

          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs
              value={activeTab ?? false}
              onChange={(_, v) => setActiveTab(v)}
              sx={{
                "& .MuiTab-root": { textTransform: "none", fontWeight: 500, fontSize: "0.875rem", minHeight: 44, gap: 0.5 },
                "& .Mui-selected": { fontWeight: 700 },
              }}
            >
              {transactionsTab?.map((tab) => (
                <Tab key={tab.key} value={tab.key} id={`${tab.key}`} aria-controls={"tabpanel-" + tab.key} iconPosition="start" label={tab.label} />
              ))}
            </Tabs>
          </Box>

          <Stack spacing={0.5}>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <WithdrawalSkeleton key={i} />)
            ) : adminWithdrawals.length === 0 ? (
              <Box sx={{ py: 6, textAlign: "center" }}>
                <Typography variant="body2" sx={{ color: "text.disabled" }}>
                  No {activeTab} withdrawals
                </Typography>
              </Box>
            ) : (
              adminWithdrawals.map((tx) => {
                const status = (tx.status ?? activeTab) as string;
                const meta = STATUS_META[status] ?? STATUS_META.pending;
                const label = tx.product_name ?? `Withdrawal #${tx.id}`;
                const subLabel = tx.user_id ?? tx.note ?? "";
                const date = tx.requested_at ? formatDate(tx.requested_at) : tx.reviewed_at ? formatDate(tx.reviewed_at) : "";

                return (
                  <Box
                    key={tx.id ?? Math.random()}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      px: 1.5,
                      py: 1.25,
                      borderRadius: 2,
                      transition: "background 0.15s",
                      "&:hover": {
                        bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)"),
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        bgcolor: meta.bg,
                        color: meta.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {meta.icon}
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "text.primary", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                      >
                        {label}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "text.disabled" }}>
                        {subLabel ? `${subLabel} · ${date}` : date}
                      </Typography>
                    </Box>

                    <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: '"Inter", monospace', color: "error.main" }}>
                        {fmt(tx.amount)}
                      </Typography>
                      <Chip
                        label={meta.label}
                        size="small"
                        sx={{
                          height: 16,
                          fontSize: "0.58rem",
                          fontWeight: 700,
                          mt: 0.25,
                          bgcolor: meta.bg,
                          color: meta.color,
                          "& .MuiChip-label": { px: 1 },
                        }}
                      />
                    </Box>
                  </Box>
                );
              })
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
