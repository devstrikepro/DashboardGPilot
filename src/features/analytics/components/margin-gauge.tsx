"use client";

import { Card, CardContent, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface MarginGaugeProps {
  readonly value?: number;
  readonly max?: number;
  readonly loading?: boolean;
}

export function MarginGauge({ value = 0, max = 100, loading }: Readonly<MarginGaugeProps>) {
  const theme = useTheme();
  const percentage = (value / max) * 100;
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (percentage / 100) * circumference * 0.75;

  const getRiskLevel = (pct: number) => {
    if (pct < 30) return { label: "Low Risk", color: theme.palette.success.main };
    if (pct < 60) return { label: "Moderate", color: theme.palette.primary.main };
    if (pct < 80) return { label: "Elevated", color: theme.palette.warning.main };
    return { label: "High Risk", color: theme.palette.error.main };
  };

  const risk = getRiskLevel(percentage);

  const riskLevels = [
    { range: "0-30%", color: theme.palette.success.main },
    { range: "30-60%", color: theme.palette.primary.main },
    { range: "60-80%", color: theme.palette.warning.main },
    { range: "80-100%", color: theme.palette.error.main },
  ];

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: { xs: 2, lg: 3 } }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "text.primary" }}>
            Margin Risk Level
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Current margin utilization
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Box sx={{ position: "relative", width: 192, height: 144 }}>
            <svg width="100%" height="100%" viewBox="0 0 160 100">
              <path
                d="M 20 90 A 70 70 0 0 1 140 90"
                fill="none"
                stroke={theme.palette.mode === "dark" ? "rgba(148, 163, 184, 0.15)" : "rgba(15, 23, 42, 0.08)"}
                strokeWidth="12"
                strokeLinecap="round"
              />
              {!loading && (
                <path
                  d="M 20 90 A 70 70 0 0 1 140 90"
                  fill="none"
                  stroke={risk.color}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circumference * 0.75}
                  strokeDashoffset={strokeDashoffset}
                  style={{ transition: "stroke-dashoffset 0.5s ease" }}
                />
              )}
              <text
                x="80"
                y="70"
                textAnchor="middle"
                fill={theme.palette.text.primary}
                fontFamily="Inter, monospace"
                fontSize="24"
                fontWeight="700"
              >
                {loading ? "..." : `${value.toFixed(1)}%`}
              </text>
              <text
                x="80"
                y="90"
                textAnchor="middle"
                fill={loading ? theme.palette.text.secondary : risk.color}
                fontFamily="Inter, sans-serif"
                fontSize="11"
                fontWeight="500"
              >
                {loading ? "Calculating..." : risk.label}
              </text>
            </svg>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 1,
              width: "100%",
              mt: 2,
              textAlign: "center",
            }}
          >
            {riskLevels.map((level) => (
              <Box key={level.range}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    bgcolor: level.color,
                    mx: "auto",
                    mb: 0.5,
                  }}
                />
                <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.65rem" }}>
                  {level.range}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
