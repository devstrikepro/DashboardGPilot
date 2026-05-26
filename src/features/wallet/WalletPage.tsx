"use client";

import { Box, Grid, Tab, Tabs, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { ProfitSharingService } from "@/shared/services/profit-sharing-service";
import type { ProfitSharingProduct, ProfitSharingTransaction } from "@/shared/types/api";
import { TRANSACTIONS, MOCK_PROFIT_SHARING_TRANSACTIONS } from "./constants";
import { ProfitSharingHero } from "./components/ProfitSharingHero";
import { WithdrawalForm } from "./components/WithdrawalForm";
import { TransactionHistory } from "./components/TransactionHistory";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface WalletInitialData {
  profitSharingBalance?: number;
  transactions?: typeof TRANSACTIONS;
}

interface WalletPageProps {
  initialData?: WalletInitialData;
}

interface WalletTab {
  key: number;
  label: string;
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function WalletPage({ initialData }: WalletPageProps) {
  const [tabs, setTabs] = useState<WalletTab[] | null>(null);
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [products, setProducts] = useState<ProfitSharingProduct[]>([]);
  const [transactionHistory, setTransactionHistory] = useState<ProfitSharingTransaction[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  useEffect(() => {
    ProfitSharingService.getProducts()
      .then((res) => {
        if (res.success && res.data) {
          setProducts(res.data);
          const productTabs = res.data.map((product) => ({ key: product.product_port, label: product.product_name }));
          setTabs(productTabs);
          setActiveTab(productTabs[0].key);
        } else {
          setProductsError(res.message || "ไม่สามารถโหลดข้อมูลได้");
        }
      })
      .finally(() => setProductsLoading(false));
  }, []);

  useEffect(() => {
    ProfitSharingService.getTransactionHistory(activeTab || 0).then((res) => {
      if (res.success && res.data) {
        setTransactionHistory(res.data);
        // setTransactionHistory(MOCK_PROFIT_SHARING_TRANSACTIONS);
      }
    });
  }, [activeTab]);

  const activeBalance = products.find((p) => p.product_port === activeTab)?.available ?? initialData?.profitSharingBalance ?? 0;
  const transactions = initialData?.transactions ?? TRANSACTIONS;

  return (
    <Box sx={{ p: { xs: 2, lg: 3 }, flex: 1 }}>
      {/* ── Page Header ─────────────────────────────────────── */}
      <Box sx={{ mb: { xs: 2.5, lg: 3 } }}>
        <Typography
          variant="h5"
          sx={{ fontFamily: '"Manrope", sans-serif', fontWeight: 700, color: "text.primary", fontSize: { xs: "1.25rem", lg: "1.5rem" } }}
        >
          Wallet
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
          Claim your rewards and manage withdrawals
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={activeTab ?? false}
          onChange={(_, v) => setActiveTab(v)}
          sx={{
            "& .MuiTab-root": { textTransform: "none", fontWeight: 500, fontSize: "0.875rem", minHeight: 44, gap: 0.5 },
            "& .Mui-selected": { fontWeight: 700 },
          }}
        >
          {tabs?.map((tab) => (
            <Tab key={tab.key} value={tab.key} id={`${tab.key}`} aria-controls={"tabpanel-" + tab.key} iconPosition="start" label={tab.label} />
          ))}
        </Tabs>
      </Box>

      {/* ── Hero ────────────────────────────────────────────── */}
      <ProfitSharingHero balance={activeBalance} />

      {/* ── Lower Section ───────────────────────────────────── */}
      <Grid container spacing={{ xs: 2, lg: 3 }} alignItems="flex-start">
        <Grid size={{ xs: 12, md: 5, lg: 4 }}>
          <WithdrawalForm activeProduct={products.find((p) => p.product_port === activeTab) ?? null} />
        </Grid>
        <Grid size={{ xs: 12, md: 7, lg: 8 }}>
          <TransactionHistory transactions={transactionHistory} />
        </Grid>
      </Grid>
    </Box>
  );
}
