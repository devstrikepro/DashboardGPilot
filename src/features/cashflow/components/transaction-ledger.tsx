"use client";

import { Card, CardContent, Box, Typography, Paper, Chip, Skeleton } from "@mui/material";
import { 
  CallReceived as CallReceivedIcon, 
  CallMade as CallMadeIcon, 
  CheckCircle as CheckCircleIcon, 
  AccessTime as AccessTimeIcon, 
  Cancel as CancelIcon 
} from "@mui/icons-material";
import type { Transaction } from "../hooks/use-cashflow-data";

interface TransactionLedgerProps {
  readonly loading?: boolean;
  readonly transactions: readonly Transaction[];
}

const statusConfig = {
  completed: { icon: CheckCircleIcon, color: "#10B981", bgColor: "rgba(16, 185, 129, 0.2)" },
  pending: { icon: AccessTimeIcon, color: "#22D3EE", bgColor: "rgba(34, 211, 238, 0.2)" },
  failed: { icon: CancelIcon, color: "#EF4444", bgColor: "rgba(239, 68, 68, 0.2)" },
};

export function TransactionLedger({ loading, transactions }: Readonly<TransactionLedgerProps>) {
  if (loading) {
    return (
      <Card>
        <CardContent sx={{ p: { xs: 2, lg: 3 } }}>
          <Skeleton variant="text" width="30%" height={24} sx={{ mb: 2 }} />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rectangular" height={70} sx={{ mb: 1, borderRadius: 2 }} />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent sx={{ p: { xs: 2, lg: 3 } }}>
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, color: "text.primary" }}
          >
            Transaction Ledger
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Recent deposits and withdrawals
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {transactions.map((tx) => {
            const status = statusConfig[tx.status as keyof typeof statusConfig];
            const StatusIcon = status.icon;

            return (
              <Paper
                key={tx.id}
                sx={{
                  p: 1.5,
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(148, 163, 184, 0.05)"
                      : "rgba(15, 23, 42, 0.02)",
                  border: (theme) =>
                    theme.palette.mode === "dark"
                      ? "1px solid rgba(148, 163, 184, 0.08)"
                      : "1px solid rgba(15, 23, 42, 0.05)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: { xs: "wrap", sm: "nowrap" },
                  gap: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor:
                        tx.type === "deposit"
                          ? "rgba(16, 185, 129, 0.2)"
                          : "rgba(239, 68, 68, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {tx.type === "deposit" ? (
                      <CallReceivedIcon sx={{ fontSize: 20, color: "success.main" }} />
                    ) : (
                      <CallMadeIcon sx={{ fontSize: 20, color: "error.main" }} />
                    )}
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        color: "text.primary",
                        textTransform: "capitalize",
                        fontSize: "0.875rem",
                      }}
                    >
                      {tx.type}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      {tx.method}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", display: { xs: "none", sm: "block" } }}
                >
                  {tx.date}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Typography
                    sx={{
                      fontFamily: '"Inter", monospace',
                      fontWeight: 500,
                      color: tx.type === "deposit" ? "success.main" : "text.primary",
                    }}
                  >
                    {tx.type === "deposit" ? "+" : "-"}${tx.amount.toLocaleString()}
                  </Typography>
                  <Chip
                    icon={<StatusIcon sx={{ fontSize: 14, color: `${status.color} !important` }} />}
                    label={tx.status}
                    size="small"
                    sx={{
                      bgcolor: status.bgColor,
                      color: status.color,
                      fontWeight: 500,
                      fontSize: "0.7rem",
                      textTransform: "capitalize",
                      "& .MuiChip-icon": {
                        ml: 0.5,
                      },
                    }}
                  />
                </Box>
              </Paper>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
}
