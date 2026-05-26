"use client";

import { useState } from "react";
import { Box, Grid } from "@mui/material";
import { useAccountViewModel } from "./hooks/use-account-view-model";
import { ProfileCard, FinancialSummary, AccountHeader, PortSelection } from "./components";
import { useRouter } from "next/navigation";
import { BalanceChart, DataTable } from "@/shared/ui";
import type { AccountProfile, AccountFinance, GroupedTradesResponse, AccountInfo } from "@/shared/types/api";

export interface AccountInitialData {
  info?: AccountInfo[] | null;
  lastUpdate?: string | null;
  profile?: AccountProfile | AccountProfile[] | null;
  finance?: AccountFinance | AccountFinance[] | null;
  tradesData?: GroupedTradesResponse | GroupedTradesResponse[] | null;
}

interface AccountPageProps {
  initialData?: AccountInitialData;
  mt5Id?: number;
}

export function AccountPage({ initialData, mt5Id }: AccountPageProps) {
  const router = useRouter();
  const isDetailView = !!mt5Id;

  const {
    // ... (rest of viewModel remains the same)
    loading,
    tableLoading,
    summary,
    realBalance,
    totalDeposits,
    totalWithdrawals,
    netProfit,
    growthPercent,
    chartData,
    trades,
    totalTrades,
    tradesTotals,
    typeOptions,
    refreshData,
    formatCurrency,
    profiles,
    finances,
    accountInfoList,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    typeFilter,
    setTypeFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    lastUpdate,
    canRefresh,
  } = useAccountViewModel(initialData, mt5Id);

  const handleSelectPort = (index: number) => {
    const port = accountInfoList[index];
    if (port) {
      router.push(`/account/${port.mt5_id}`);
    }
  };

  const handleBack = () => {
    router.push("/account");
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, pb: 8 }}>
      <AccountHeader onRefresh={refreshData} loading={loading} onBack={isDetailView ? handleBack : undefined} lastUpdate={lastUpdate} canRefresh={canRefresh} />

      {!isDetailView ? (
        <PortSelection ports={accountInfoList} onSelect={handleSelectPort} loading={loading} />
      ) : (
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
              sx={{ height: "100%" }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <FinancialSummary
              loading={loading}
              login={summary?.login ?? 0}
              supportGroup={accountInfoList.find((info) => info.mt5_id === mt5Id)?.support_group}
              realBalance={realBalance}
              totalDeposits={totalDeposits}
              totalWithdrawals={totalWithdrawals}
              netProfit={netProfit}
              growthPercent={growthPercent}
              formatCurrency={formatCurrency}
              sx={{ height: "100%" }}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
