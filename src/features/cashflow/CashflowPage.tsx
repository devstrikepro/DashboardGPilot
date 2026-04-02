"use client";

import { Box, Typography, Grid } from "@mui/material";
import { 
  CashflowDistribution, 
  TransactionLedger, 
  FlowCards 
} from "@/features/cashflow/components";
import { useCashflowData } from "@/features/cashflow/hooks";

export default function CashflowPage() {
  const {
    loading,
    transactions,
    cashflowStats,
    summary,
    page,
    limit,
    total,
    setPage,
    setLimit,
  } = useCashflowData();


  return (
    <Box sx={{ p: { xs: 1, lg: 3 }, flex: 1 }}>
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
          Track deposits and withdrawals
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 2, lg: 3 }} sx={{ mb: { xs: 2, lg: 3 } }}>
        <Grid size={{ xs: 12 }}>
          <CashflowDistribution 
            loading={loading} 
            deposits={cashflowStats?.deposits || 0}
            withdrawals={cashflowStats?.withdrawals || 0}
          />
        </Grid>
      </Grid>

      <Box sx={{ mb: { xs: 2, lg: 3 } }}>
        <FlowCards loading={loading} summary={summary} />
      </Box>

      <TransactionLedger 
        loading={loading} 
        transactions={transactions} 
        page={page}
        limit={limit}
        total={total}
        onPageChange={setPage}
        onLimitChange={setLimit}
      />
    </Box>
  );
}
