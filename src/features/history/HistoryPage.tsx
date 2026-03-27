"use client";

import { Box, Typography, Alert } from "@mui/material";
import { DashboardLayout } from "@/shared/ui";
import { TradeTable } from "@/features/history/components";
import { useHistoryData } from "@/features/history/hooks";

export default function HistoryPage() {
  const {
    loading,
    error,
    deals,
    totals,
    search,
    setSearch,
    sortField,
    sortDirection,
    handleSort,
    filteredCount,
  } = useHistoryData();

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
            Trade History
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Complete trading record with filtering and totals
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <TradeTable
          loading={loading}
          deals={deals}
          totals={totals}
          search={search}
          onSearchChange={setSearch}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          filteredCount={filteredCount}
        />
      </Box>
    </DashboardLayout>
  );
}
