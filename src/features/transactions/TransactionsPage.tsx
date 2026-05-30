"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, Box, Typography, Stack, Tab, Tabs, Skeleton, Avatar, IconButton, Tooltip, Snackbar, Alert } from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { AdminService, type AdminWithdrawal } from "@/shared/services/admin-service";
import { MOCK_WITHDRAWALS } from "./mock-data";
import { WithdrawalActionDialog } from "./WithdrawalActionDialog";
import { CARD_SX } from "../wallet/constants";
import { SectionIconBox } from "../wallet/components/SectionIconBox";

const fmt = (val: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Math.abs(val));

const formatDate = (dateStr: string) => {
  try {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
};

const getInitials = (name: string) => {
  const parts = name?.trim()?.split(/\s+/) || [];
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

const transactionsTab = ["Pending", "Approved", "Rejected"].map((e) => ({ key: e.toLowerCase(), label: e }));

function WithdrawalSkeleton() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 1.5, py: 1.25 }}>
      <Skeleton variant="circular" width={40} height={40} sx={{ flexShrink: 0 }} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Skeleton variant="text" width="40%" height={20} />
        <Skeleton variant="text" width="25%" height={16} />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Skeleton variant="text" width={80} height={20} />
        <Skeleton variant="circular" width={28} height={28} />
        <Skeleton variant="circular" width={28} height={28} />
      </Box>
    </Box>
  );
}

type DialogState = { action: "approve" | "reject"; tx: AdminWithdrawal } | null;

export function TransactionsPage() {
  const [activeTab, setActiveTab] = useState<string>("pending");
  const [adminWithdrawals, setAdminWithdrawals] = useState<AdminWithdrawal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // MOCK: เปิดบรรทัดนี้แทน API จริง (ข้อมูลจะเปลี่ยนตาม tab อัตโนมัติ)
  // useEffect(() => {
  //   setAdminWithdrawals(MOCK_WITHDRAWALS[activeTab] ?? []);
  // }, [activeTab]);

  // REAL API: uncomment บรรทัดนี้เมื่อพร้อมใช้งานจริง
  useEffect(() => {
    setIsLoading(true);
    AdminService.getWithdrawals(activeTab).then((res) => {
      if (res.success && res.data) setAdminWithdrawals(res.data);
      else setAdminWithdrawals([]);
      setIsLoading(false);
    });
  }, [activeTab]);

  const handleConfirm = async (reason?: string) => {
    if (!dialog) return;
    setIsSubmitting(true);
    const res = dialog.action === "approve" ? await AdminService.approveWithdrawal(dialog.tx.id) : await AdminService.rejectWithdrawal(dialog.tx.id, reason);
    setIsSubmitting(false);
    if (res.success) {
      setAdminWithdrawals((prev) => prev.filter((w) => w.id !== dialog.tx.id));
      setSuccessMsg(dialog.action === "approve" ? "Withdrawal approved successfully" : "Withdrawal rejected successfully");
      setDialog(null);
    } else {
      setErrorMsg(res.message ?? "Something went wrong");
    }
  };

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
                const status = tx.status ?? activeTab;
                const initials = getInitials(tx.name || tx.user_email?.split("@")?.[0]);
                const date = tx.requested_at ? formatDate(tx.requested_at) : tx.reviewed_at ? formatDate(tx.reviewed_at) : "";

                return (
                  <Box
                    key={tx.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      px: 1.5,
                      py: 1,
                      borderRadius: 2,
                      transition: "background 0.15s",
                      "&:hover": {
                        bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)"),
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: "primary.main",
                        color: "#fff",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {initials}
                    </Avatar>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "text.primary", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                        >
                          {tx.name}
                        </Typography>
                        {status === "pending" && (
                          <Tooltip title="Copy email" placement="top">
                            <IconButton
                              size="small"
                              onClick={() => navigator.clipboard.writeText(tx.user_email)}
                              sx={{ p: 0.25, color: "text.disabled", "&:hover": { color: "text.secondary" } }}
                            >
                              <ContentCopyIcon sx={{ fontSize: 13 }} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                      <Typography variant="caption" sx={{ color: "text.disabled" }}>
                        {date}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: '"Inter", monospace', color: "text.primary" }}>
                          {fmt(tx.amount)}
                        </Typography>
                        {status === "pending" && (
                          <Tooltip title="Copy amount" placement="top">
                            <IconButton
                              size="small"
                              onClick={() => navigator.clipboard.writeText(String(tx.amount))}
                              sx={{ p: 0.25, color: "text.disabled", "&:hover": { color: "text.secondary" } }}
                            >
                              <ContentCopyIcon sx={{ fontSize: 13 }} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>

                      {status === "pending" && (
                        <>
                          <Tooltip title="Approve" placement="top">
                            <IconButton
                              size="small"
                              onClick={() => setDialog({ action: "approve", tx })}
                              sx={{
                                bgcolor: "rgba(16,185,129,0.15)",
                                color: "#10B981",
                                "&:hover": { bgcolor: "rgba(16,185,129,0.28)" },
                                width: 30,
                                height: 30,
                              }}
                            >
                              <CheckIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reject" placement="top">
                            <IconButton
                              size="small"
                              onClick={() => setDialog({ action: "reject", tx })}
                              sx={{
                                bgcolor: "rgba(239,68,68,0.15)",
                                color: "#EF4444",
                                "&:hover": { bgcolor: "rgba(239,68,68,0.28)" },
                                width: 30,
                                height: 30,
                              }}
                            >
                              <CloseIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </Box>
                  </Box>
                );
              })
            )}
          </Stack>
        </CardContent>
      </Card>

      <WithdrawalActionDialog
        open={dialog !== null}
        action={dialog?.action ?? "approve"}
        withdrawal={dialog?.tx ?? null}
        isLoading={isSubmitting}
        onConfirm={handleConfirm}
        onClose={() => setDialog(null)}
      />

      <Snackbar open={errorMsg !== null} autoHideDuration={4000} onClose={() => setErrorMsg(null)} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert severity="error" onClose={() => setErrorMsg(null)} sx={{ width: "100%" }}>
          {errorMsg}
        </Alert>
      </Snackbar>

      <Snackbar open={successMsg !== null} autoHideDuration={3000} onClose={() => setSuccessMsg(null)} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert severity="success" onClose={() => setSuccessMsg(null)} sx={{ width: "100%" }}>
          {successMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
