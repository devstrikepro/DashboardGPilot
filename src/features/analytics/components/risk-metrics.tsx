"use client";

import { Card, CardContent, Box, Typography, Grid } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import BalanceIcon from "@mui/icons-material/Balance";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import { SvgIconComponent } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

interface MetricData {
  label: string;
  value: string;
  description: string;
  icon: SvgIconComponent;
  colorKey: "success" | "primary" | "error";
  bgColor: string;
}

interface RiskMetricsProps {
  readonly winRate?: number;
  readonly sharpeRatio?: number;
  readonly maxDrawdown?: number;
  readonly totalTrades?: number;
  readonly wins?: number;
  readonly loading?: boolean;
}

export function RiskMetrics({ 
  winRate = 0, 
  sharpeRatio = 0, 
  maxDrawdown = 0, 
  totalTrades = 0, 
  wins = 0,
  loading 
}: Readonly<RiskMetricsProps>) {
  const theme = useTheme();

  const metrics: MetricData[] = [
    {
      label: "Win Rate",
      value: `${winRate.toFixed(1)}%`,
      description: `${wins} wins / ${totalTrades} total`,
      icon: TrendingUpIcon,
      colorKey: "success",
      bgColor: "rgba(16, 185, 129, 0.2)",
    },
    {
      label: "Sharpe Ratio",
      value: sharpeRatio.toFixed(2),
      description: "Risk-adjusted return",
      icon: BalanceIcon,
      colorKey: "primary",
      bgColor: "rgba(34, 211, 238, 0.2)",
    },
    {
      label: "Risk Reward",
      value: "1:2.4", // ยังคง Mock ก้อนนี้ไว้ก่อนถ้าไม่มีสูตรคำนวณที่แน่นอน
      description: "Avg win vs avg loss",
      icon: TrackChangesIcon,
      colorKey: "primary",
      bgColor: "rgba(34, 211, 238, 0.2)",
    },
    {
      label: "Max Drawdown",
      value: `-${maxDrawdown.toFixed(1)}%`,
      description: "Peak to trough drop",
      icon: TrendingDownIcon,
      colorKey: "error",
      bgColor: "rgba(239, 68, 68, 0.2)",
    },
  ];

  const getColor = (key: string) => {
    switch (key) {
      case "success":
        return theme.palette.success.main;
      case "primary":
        return theme.palette.primary.main;
      case "error":
        return theme.palette.error.main;
      default:
        return theme.palette.text.primary;
    }
  };

  return (
    <Grid container spacing={{ xs: 1.5, lg: 2 }}>
      {metrics.map((metric) => (
        <Grid key={metric.label} size={{ xs: 6, lg: 3 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: { xs: 2, lg: 2.5 } }}>
              <Box sx={{ mb: 1.5 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: metric.bgColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <metric.icon sx={{ color: getColor(metric.colorKey), fontSize: 20 }} />
                </Box>
              </Box>
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", fontWeight: 500 }}
              >
                {metric.label}
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Inter", monospace',
                  fontSize: { xs: "1.5rem", lg: "1.75rem" },
                  fontWeight: 700,
                  color: getColor(metric.colorKey),
                  letterSpacing: "-0.02em",
                }}
              >
                {loading ? "..." : metric.value}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", display: "block", mt: 0.5 }}
              >
                {metric.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
