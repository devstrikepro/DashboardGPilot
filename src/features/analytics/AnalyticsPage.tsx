"use client";

import { Box, Typography, Grid, Alert } from "@mui/material";
import { DashboardLayout, EquityChart } from "@/shared/ui";
import { RiskMetrics, MarginGauge, AssetExposure, PLDistribution } from "@/features/analytics/components";
import { useAnalyticsData } from "@/features/analytics/hooks";

export default function AnalyticsPage() {
  const { loading, error, account, stats } = useAnalyticsData();

  // Mapping equity curve to chart format
  const equityChartData = stats?.equityCurve.map(point => ({
    date: new Date(point.time).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }),
    equity: point.equity,
    balance: point.equity // Simplified: showing same for equity/balance if not tracked separately
  }));

  return (
    <DashboardLayout>
      <Box sx={{ p: { xs: 2, lg: 3 }, flex: 1 }}>
        <Box sx={{ mb: { xs: 2, lg: 3 } }}>
          <Typography
            variant="h5"
            sx={{
              fontFamily: '"Manrope", sans-serif',
              fontWeight: 700,
              color: "text.primary",
              fontSize: { xs: "1.25rem", lg: "1.5rem" },
            }}
          >
            Performance Intelligence
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Advanced risk metrics and portfolio analysis
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: { xs: 2, lg: 3 } }}>
          <RiskMetrics 
            loading={loading}
            winRate={stats?.winRate}
            sharpeRatio={stats?.sharpeRatio}
            maxDrawdown={stats?.maxDrawdown}
            totalTrades={stats?.totalTrades}
            wins={stats?.wins}
          />
        </Box>

        <Grid container spacing={{ xs: 2, lg: 3 }} sx={{ mb: { xs: 2, lg: 3 } }}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <MarginGauge 
              loading={loading}
              value={account?.margin_level} 
              max={100} 
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <AssetExposure 
              loading={loading}
              assets={stats?.assetExposure}
            />
          </Grid>
        </Grid>

        <Grid container spacing={{ xs: 2, lg: 3 }} sx={{ mb: { xs: 2, lg: 3 } }}>
          <Grid size={{ xs: 12, lg: 12 }}>
            <EquityChart 
              loading={loading}
              data={equityChartData}
            />
          </Grid>
        </Grid>

        <PLDistribution 
          loading={loading}
          data={stats?.plDistribution}
        />
      </Box>
    </DashboardLayout>
  );
}
