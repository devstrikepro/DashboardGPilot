"use client";

import { Card, CardContent, Box, Typography, Chip, LinearProgress } from "@mui/material";

interface AssetData {
  symbol: string;
  exposure: number;
  profit: number;
  direction: string;
}

interface AssetExposureProps {
  readonly assets?: AssetData[];
  readonly loading?: boolean;
}
export function AssetExposure({ assets: propAssets, loading }: Readonly<AssetExposureProps>) {
  const assets = propAssets || [];
  const renderContent = () => {
    if (loading) {
      return (
        <Typography variant="caption" sx={{ color: "text.secondary", textAlign: "center", py: 4 }}>
          Loading exposure data...
        </Typography>
      );
    }

    if (assets.length === 0) {
      return (
        <Typography variant="caption" sx={{ color: "text.secondary", textAlign: "center", py: 4 }}>
          No exposure data
        </Typography>
      );
    }

    return assets.map((asset) => {
      let profitColor = "text.secondary";
      if (asset.profit > 0) profitColor = "success.main";
      else if (asset.profit < 0) profitColor = "error.main";

      return (
        <Box key={asset.symbol}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                sx={{
                  fontFamily: '"Inter", monospace',
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  color: "text.primary",
                }}
              >
                {asset.symbol}
              </Typography>
              <Chip
                label={asset.direction.toUpperCase()}
                size="small"
                sx={{
                  height: 20,
                  fontSize: "0.65rem",
                  fontWeight: 500,
                  bgcolor:
                    asset.direction === "long"
                      ? "rgba(16, 185, 129, 0.2)"
                      : "rgba(239, 68, 68, 0.2)",
                  color: asset.direction === "long" ? "success.main" : "error.main",
                }}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography
                sx={{
                  fontFamily: '"Inter", monospace',
                  fontSize: "0.875rem",
                  color: profitColor,
                }}
              >
                {asset.profit > 0 ? "+" : ""}${asset.profit.toLocaleString()}
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Inter", monospace',
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "primary.main",
                  width: 48,
                  textAlign: "right",
                }}
              >
                {asset.exposure.toFixed(1)}%
              </Typography>
            </Box>
          </Box>
          <LinearProgress
            variant="determinate"
            value={asset.exposure}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(148, 163, 184, 0.1)"
                  : "rgba(15, 23, 42, 0.05)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 4,
                bgcolor: asset.direction === "long" ? "success.main" : "error.main",
              },
            }}
          />
        </Box>
      );
    });
  };

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: { xs: 2, lg: 3 } }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "text.primary" }}>
            Asset Exposure
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Portfolio allocation by instrument
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {renderContent()}
        </Box>
      </CardContent>
    </Card>
  );
}

