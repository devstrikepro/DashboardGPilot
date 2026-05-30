"use client";

import { Box, Typography, Card, CardContent, Avatar, Skeleton, SxProps, Theme } from "@mui/material";
import { Work as WorkIcon } from "@mui/icons-material";

interface FinancialSummaryProps {
  readonly loading: boolean;
  readonly login: number;
  readonly supportGroup?: string;
  readonly realBalance: number;
  readonly totalDeposits: number;
  readonly totalWithdrawals: number;
  readonly netProfit: number;
  readonly growthPercent: number;
  readonly formatCurrency: (value: number) => string;
  readonly image?: string;
  readonly sx?: SxProps<Theme>;
}

export function FinancialSummary({
  loading,
  login,
  supportGroup,
  realBalance,
  totalDeposits,
  totalWithdrawals,
  netProfit,
  growthPercent,
  formatCurrency,
  image,
  sx,
}: Readonly<FinancialSummaryProps>) {
  return (
    <Card sx={{ borderRadius: 4, ...sx }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Avatar sx={{ width: 52, height: 52, bgcolor: "primary.main" }}>
            <img src={image} alt="" className="w-7 h-7 rounded-full" />
          </Avatar>
          <Box>
            {loading ? (
              <>
                <Skeleton width={120} height={28} />
                <Skeleton width={60} height={20} />
              </>
            ) : (
              <>
                <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  {login || "-"}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  {supportGroup || "-"}
                </Typography>
              </>
            )}
          </Box>
        </Box>

        {/* Balance */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(34, 50, 67, 1)" : "rgba(8, 145, 178, 0.08)",
            borderRadius: 1,
            px: 2,
            py: 1.5,
            mb: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500 }}>
            Balance
          </Typography>
          {loading ? (
            <Skeleton width={120} height={36} />
          ) : (
            <Typography variant="h5" sx={{ fontWeight: 700, color: "primary.main" }}>
              {formatCurrency(realBalance)}
            </Typography>
          )}
        </Box>

        {/* Deposit / Withdraw */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              px: 2,
              py: 1.5,
            }}
          >
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Deposit
            </Typography>
            {loading ? (
              <Skeleton width={90} height={28} />
            ) : (
              <Typography variant="body1" sx={{ fontWeight: 700, color: "primary.main" }} className="text-end">
                {formatCurrency(totalDeposits)}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              px: 2,
              py: 1.5,
            }}
          >
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Withdraw
            </Typography>
            {loading ? (
              <Skeleton width={90} height={28} />
            ) : (
              <Typography variant="body1" sx={{ fontWeight: 700, color: "error.main" }} className="text-end">
                {formatCurrency(totalWithdrawals)}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Net Profit / Net Profit % */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <Box
            sx={{
              bgcolor: "rgba(16, 185, 129, 0.08)",
              border: "1px solid",
              borderColor: "success.main",
              borderRadius: 1,
              px: 2,
              py: 1.5,
            }}
          >
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Net Profit
            </Typography>
            {loading ? (
              <Skeleton width={90} height={28} />
            ) : (
              <Typography variant="body1" sx={{ fontWeight: 700, color: "success.main" }} className="text-end">
                {formatCurrency(netProfit)}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              bgcolor: "rgba(16, 185, 129, 0.08)",
              border: "1px solid",
              borderColor: "success.main",
              borderRadius: 1,
              px: 2,
              py: 1.5,
            }}
          >
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Net Profit %
            </Typography>
            {loading ? (
              <Skeleton width={60} height={28} />
            ) : (
              <Typography variant="body1" sx={{ fontWeight: 700, color: "success.main" }} className="text-end">
                {growthPercent.toFixed(2)} %
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
