"use client";

import { Box, Typography, Grid } from "@mui/material";
import { DashboardLayout } from "@/shared/ui";
import { 
  BalanceChart, 
  VolumeProgress, 
  TransactionLedger, 
  FlowCards 
} from "@/features/cashflow/components";
import { useCashflowData } from "@/features/cashflow/hooks";

export default function CashflowPage() {
  const {
    loading,
    transactions,
    balanceData,
    currentBalance,
    balanceChange,
    balanceChangePercent,
  } = useCashflowData();

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
            Cashflow Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Track deposits, withdrawals, and balance velocity
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 2, lg: 3 }} sx={{ mb: { xs: 2, lg: 3 } }}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <BalanceChart 
              loading={loading}
              data={balanceData}
              currentBalance={currentBalance}
              change={balanceChange}
              changePercent={balanceChangePercent}
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <VolumeProgress loading={loading} />
          </Grid>
        </Grid>

        <Box sx={{ mb: { xs: 2, lg: 3 } }}>
          <FlowCards loading={loading} />
        </Box>

        <TransactionLedger loading={loading} transactions={transactions} />
      </Box>
    </DashboardLayout>
  );
}
