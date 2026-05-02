"use client";

import { Box, Grid, Alert } from "@mui/material";
import { useAccountData } from "./hooks/use-account-data";
import { useAccountTable } from "./hooks/use-account-table";
import { ProfileCard, FinancialSummary, AccountHeader } from "./components";
import { BalanceChart, SymbolPerformance, DataTable } from "@/shared/ui";
import { MOCK_BALANCE_DATA, MOCK_SYMBOL_STATS, MOCK_DEALS, MOCK_TOTALS } from "./constants/account.mock";

export function AccountPage() {
    const {
        loading,
        error,
        summary,
        realBalance,
        grossTradeProfit,
        totalDeposits,
        totalWithdrawals,
        totalProfitSharing,
        netProfit,
        formatCurrency,
        refreshData,
    } = useAccountData();

    const tableState = useAccountTable();

    if (error) {
        return (
            <Box sx={{ p: 4 }}>
                <Alert severity="error" variant="filled" sx={{ borderRadius: 3 }}>
                    {error}
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, pb: 8 }}>
            <AccountHeader onRefresh={refreshData} loading={loading} />

            <Grid container spacing={3} alignItems="stretch">
                {/* Row 1: Profile & Financial Summary */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <ProfileCard
                        loading={loading}
                        name={summary?.name ?? ""}
                        login={summary?.login ?? 0}
                        server={summary?.server ?? ""}
                        leverage={summary?.leverage ?? 0}
                        currency={summary?.currency ?? ""}
                        sx={{ height: '100%' }}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 8 }}>
                    <FinancialSummary
                        loading={loading}
                        realBalance={realBalance}
                        grossTradeProfit={grossTradeProfit}
                        totalDeposits={totalDeposits}
                        totalWithdrawals={totalWithdrawals}
                        totalProfitSharing={totalProfitSharing}
                        netProfit={netProfit}
                        formatCurrency={formatCurrency}
                        sx={{ height: '100%' }}
                    />
                </Grid>

                {/* Row 2: Account Growth & Symbol Performance */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <BalanceChart
                        loading={loading}
                        data={MOCK_BALANCE_DATA}
                        currentBalance={realBalance || 13200}
                        change={3200}
                        changePercent={32}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <SymbolPerformance
                        loading={loading}
                        stats={MOCK_SYMBOL_STATS}
                        totalTrades={142}
                    />
                </Grid>

                {/* Row 3: Trade History Table */}
                <Grid size={{ xs: 12 }}>
                    <DataTable
                        loading={loading}
                        deals={MOCK_DEALS}
                        totals={MOCK_TOTALS}
                        sortField="closeTime"
                        sortDirection="desc"
                        onSort={() => {}}
                        
                        symbolFilter={tableState.symbolFilter}
                        onSymbolFilterChange={tableState.setSymbolFilter}
                        typeFilter={tableState.typeFilter}
                        onTypeFilterChange={tableState.setTypeFilter}
                        startDate={tableState.startDate}
                        onStartDateChange={tableState.setStartDate}
                        endDate={tableState.endDate}
                        onEndDateChange={tableState.setEndDate}
                        
                        totalCount={MOCK_DEALS.length}
                        page={tableState.page}
                        rowsPerPage={tableState.rowsPerPage}
                        onPageChange={tableState.setPage}
                        onRowsPerPageChange={tableState.setRowsPerPage}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
