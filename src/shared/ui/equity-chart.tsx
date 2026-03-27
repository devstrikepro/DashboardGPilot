"use client";

import { Card, CardContent, Box, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { useTheme } from "@mui/material/styles";

interface EquityChartProps {
  readonly data?: { date: string; equity: number; balance: number }[];
  readonly loading?: boolean;
}

export function EquityChart({ data: propData, loading }: Readonly<EquityChartProps>) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // ใช้ข้อมูลจาก Props หากไม่มีให้ใช้ Array ว่าง (จะแสดง Skeleton หรือกราฟเปล่า)
  const chartData = propData || [];

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Loading chart data...</Typography>
        </Box>
      );
    }

    if (chartData.length === 0) {
      return (
        <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>No data available</Typography>
        </Box>
      );
    }

    return (
      <LineChart
        xAxis={[
          {
            data: chartData.map((_, i) => i),
            scaleType: "point",
            valueFormatter: (value) => chartData[value]?.date || "",
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
              fontSize: 10,
            },
            valueFormatter: (value: number) => `$${(value / 1000).toFixed(1)}k`,
          },
        ]}
        series={[
          {
            data: chartData.map((d) => d.equity),
            label: "Equity",
            color: theme.palette.primary.main,
            area: true,
            showMark: false,
          },
          {
            data: chartData.map((d) => d.balance),
            label: "Balance",
            color: theme.palette.success.main,
            area: true,
            showMark: false,
          },
        ]}
        sx={{
          "& .MuiLineElement-root": {
            strokeWidth: 2,
          },
          "& .MuiAreaElement-root": {
            fillOpacity: 0.15,
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
          // @ts-ignore - MUI charts typing issue
          legend: { hidden: true },
        }}
        grid={{ horizontal: true }}
      />
    );
  };

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
              Equity Curve
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              12 month performance
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                }}
              />
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Equity
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor: "success.main",
                }}
              />
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Balance
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ height: { xs: 250, lg: 300 }, width: "100%" }}>
          {renderContent()}
        </Box>
      </CardContent>
    </Card>
  );
}
