"use client";

import { Card, CardContent, Box, Typography, LinearProgress, Skeleton } from "@mui/material";

interface SymbolStat {
  symbol: string;
  trades: number;
  profit: number;
  winRate: number;
}

interface SymbolPerformanceProps {
  readonly loading?: boolean;
  readonly stats: readonly SymbolStat[];
  readonly totalTrades?: number;
}

export function SymbolPerformance({ loading, stats, totalTrades }: Readonly<SymbolPerformanceProps>) {
  const renderStats = () => {
    if (loading) {
      return ['s1', 's2', 's3', 's4', 's5'].map((key) => (
        <Box key={key} sx={{ mb: 1 }}>
          <Skeleton height={20} width="60%" />
          <Skeleton height={10} width="100%" sx={{ mt: 1 }} />
        </Box>
      ));
    }

    if (stats.length === 0) {
      return (
        <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center", py: 4 }}>
          No trade data available
        </Typography>
      );
    }

    return stats.map((item) => {
      let profitColor = "text.secondary";
      if (item.profit > 0) {
        profitColor = "success.main";
      } else if (item.profit < 0) {
        profitColor = "error.main";
      }
      
      const profitPrefix = item.profit > 0 ? "+" : "";
      
      return (
        <Box key={item.symbol}>
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
                  fontFamily: "var(--font-inter)",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  color: "text.primary",
                }}
              >
                {item.symbol}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "text.secondary" }}
              >
                {item.trades} trades
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography
                sx={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "0.875rem",
                  color: profitColor,
                }}
              >
                {profitPrefix}${item.profit.toLocaleString()}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "0.875rem",
                  color: "primary.main",
                  fontWeight: 500,
                }}
              >
                {item.winRate.toFixed(2)}%
              </Typography>
            </Box>
          </Box>
          <LinearProgress
            variant="determinate"
            value={item.winRate}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(148, 163, 184, 0.1)"
                  : "rgba(15, 23, 42, 0.05)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 4,
                bgcolor: "primary.main",
              },
            }}
          />
        </Box>
      );
    });
  };

  return (
    <Card sx={{ height: "100%", display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ p: { xs: 2, lg: 3 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              Symbol Performance
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Win rates by instrument (Top 5)
            </Typography>
          </Box>
          {!loading && totalTrades !== undefined && (
            <Box
              sx={{
                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(34, 211, 238, 0.1)' : 'rgba(8, 145, 178, 0.05)',
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(34, 211, 238, 0.2)' : 'rgba(8, 145, 178, 0.1)'}`
              }}
            >
              <Typography 
                sx={{ 
                  color: 'primary.main', 
                  fontSize: '0.75rem', 
                  fontWeight: 700,
                  fontFamily: 'var(--font-inter)'
                }}
              >
                Total Trades: {totalTrades}
              </Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, minHeight: 150, overflow: 'auto' }}>
          {renderStats()}
        </Box>
      </CardContent>
    </Card>
  );
}
