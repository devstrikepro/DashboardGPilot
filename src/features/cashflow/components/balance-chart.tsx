"use client";

import { Card, CardContent, Box, Typography, Skeleton } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { useTheme } from "@mui/material/styles";

interface BalancePoint {
  date: string;
  balance: number;
}

interface BalanceChartProps {
  readonly loading?: boolean;
  readonly data: readonly BalancePoint[];
  readonly currentBalance: number;
  readonly change: number;
  readonly changePercent: number;
}

export function BalanceChart({
  loading,
  data,
  currentBalance,
  change,
  changePercent,
}: Readonly<BalanceChartProps>) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  if (loading) {
    return (
      <Card sx={{ height: "100%" }}>
        <CardContent sx={{ p: { xs: 2, lg: 3 } }}>
          <Skeleton variant="text" width="40%" height={32} />
          <Skeleton variant="rectangular" height={300} sx={{ mt: 2, borderRadius: 2 }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: { xs: 2, lg: 3 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              Balance Velocity
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              12 week trend
            </Typography>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography
              sx={{
                fontFamily: '"Inter", monospace',
                fontSize: { xs: "1.25rem", lg: "1.5rem" },
                fontWeight: 700,
                color: "text.primary",
              }}
            >
              ${currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: change >= 0 ? "success.main" : "error.main", fontWeight: 500 }}
            >
              {change >= 0 ? "+" : ""}${Math.abs(change).toLocaleString()} ({changePercent}%)
            </Typography>
          </Box>
        </Box>
        <Box sx={{ height: { xs: 250, lg: 300 }, width: "100%" }}>
          <LineChart
            xAxis={[
              {
                data: data.map((_, i) => i),
                scaleType: "point",
                valueFormatter: (val: number) => data[val]?.date || "",
                tickLabelStyle: {
                  fill: theme.palette.text.secondary,
                  fontSize: 10,
                },
              },
            ]}
            yAxis={[
              {
                tickLabelStyle: {
                  fill: theme.palette.text.secondary,
                  fontSize: 11,
                },
                valueFormatter: (val: number) => `$${(val / 1000).toFixed(0)}k`,
              },
            ]}
            series={[
              {
                data: data.map((d) => d.balance),
                label: "Balance",
                color: theme.palette.primary.main,
                area: true,
                showMark: false,
              },
            ]}
            sx={{
              "& .MuiLineElement-root": {
                strokeWidth: 2,
              },
              "& .MuiAreaElement-root": {
                fillOpacity: 0.2,
              },
              "& .MuiChartsAxis-line": {
                stroke: isDark ? "rgba(148, 163, 184, 0.2)" : "rgba(15, 23, 42, 0.1)",
              },
              "& .MuiChartsAxis-tick": {
                stroke: isDark ? "rgba(148, 163, 184, 0.2)" : "rgba(15, 23, 42, 0.1)",
              },
              "& .MuiChartsGrid-line": {
                stroke: isDark ? "rgba(148, 163, 184, 0.1)" : "rgba(15, 23, 42, 0.05)",
              },
            }}
            slotProps={{
              legend: { hidden: true } as any,
            }}
            grid={{ horizontal: true }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
