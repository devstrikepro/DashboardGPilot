import { Card, CardContent, Box, Typography, Paper } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

import type { DashboardRecentTransaction } from "@/shared/types/api";

interface ExecutionLogProps {
  readonly recent?: readonly DashboardRecentTransaction[];
  readonly loading?: boolean;
}

type UnifiedTransaction = {
  id: string | number;
  type: string;
  label: string;
  subLabel: string;
  amount: number;
  time: Date;
  status?: string;
};

export function ExecutionLog({ recent: propRecent, loading }: Readonly<ExecutionLogProps>) {
  const unifiedData: UnifiedTransaction[] = useMemo(() => {
    return (Array.isArray(propRecent) ? propRecent : [])
      .map((item, idx) => {
        let label = item.type;
        let subLabel = item.type;
        let status = 'NONE';
        
        if (item.type.startsWith('Trade')) {
          label = item.symbol || 'Trade';
          status = item.type.includes('BUY') ? 'BUY' : 'SELL';
          subLabel = `${status} ` + (item.amount > 0 ? "Profit" : "Loss");
        } else if (item.type === 'Deposit') {
          label = 'ฝากเงิน';
          subLabel = 'Deposit';
        } else if (item.type === 'Withdrawal') {
          label = 'ถอนเงิน';
          subLabel = 'Withdrawal';
        } else if (item.type === 'ProfitSharing') {
          label = 'Profit Sharing';
          subLabel = 'PF Deduct';
        }

        return {
          id: `recent-${idx}`,
          type: item.type.startsWith('Trade') ? 'Trade' : item.type,
          label,
          subLabel,
          amount: item.amount,
          time: new Date(item.datetime),
          status
        };
      })
      .sort((a, b) => b.time.getTime() - a.time.getTime())
      .slice(0, 5);
  }, [propRecent]);

  const renderLogs = () => {
    if (loading) {
      return (
        <Typography variant="caption" sx={{ color: "text.secondary", textAlign: "center", py: 2 }}>
          Loading transactions...
        </Typography>
      );
    }

    if (unifiedData.length === 0) {
      return (
        <Typography variant="caption" sx={{ color: "text.secondary", textAlign: "center", py: 2 }}>
          No recent transactions
        </Typography>
      );
    }

    return unifiedData.map((item) => {
      let icon = <SwapHorizIcon sx={{ fontSize: 18, color: "text.secondary" }} />;
      let iconBg = "rgba(148, 163, 184, 0.2)";
      let amountColor = "text.primary";

      if (item.type === 'Trade') {
        icon = item.status === "BUY" ? (
          <TrendingUpIcon sx={{ fontSize: 18, color: "success.main" }} />
        ) : (
          <TrendingDownIcon sx={{ fontSize: 18, color: "error.main" }} />
        );
        iconBg = item.status === "BUY" ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)";
        amountColor = item.amount >= 0 ? "success.main" : "error.main";
      } else if (item.type === 'Deposit') {
        icon = <ArrowUpwardIcon sx={{ fontSize: 18, color: "success.main" }} />;
        iconBg = "rgba(16, 185, 129, 0.2)";
        amountColor = "success.main";
      } else if (item.type === 'Withdrawal') {
        icon = <ArrowDownwardIcon sx={{ fontSize: 18, color: "error.main" }} />;
        iconBg = "rgba(239, 68, 68, 0.2)";
        amountColor = "error.main";
      } else if (item.type === 'ProfitSharing') {
        icon = <AccountBalanceIcon sx={{ fontSize: 18, color: "primary.main" }} />;
        iconBg = "rgba(56, 189, 248, 0.2)";
        amountColor = "primary.main";
      }

      return (
        <Paper
          key={item.id}
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
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                bgcolor: iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {icon}
            </Box>
            <Box>
              <Typography
                sx={{
                  fontFamily: '"Inter", monospace',
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "text.primary",
                }}
              >
                {item.label}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", fontSize: '0.7rem' }}>
                {item.subLabel}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography
              sx={{
                fontFamily: '"Inter", monospace',
                fontSize: "0.875rem",
                fontWeight: 700,
                color: amountColor,
              }}
            >
              {item.amount > 0 ? "+" : ""}${Math.abs(item.amount).toFixed(2)}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontFamily: '"Inter", monospace',
                color: "text.secondary",
                fontSize: '0.65rem'
              }}
            >
              {item.time.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </Box>
        </Paper>
      );
    });
  };

  return (
    <Card>
      <CardContent sx={{ p: { xs: 2, lg: 3 } }}>
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, color: "text.primary" }}
          >
            Recent Transactions
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Latest account activities & trades
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {renderLogs()}
        </Box>
      </CardContent>
    </Card>
  );
}

import { useMemo } from "react";
