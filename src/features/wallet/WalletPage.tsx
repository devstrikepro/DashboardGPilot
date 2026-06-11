"use client";

import { ProfitSharingService } from "@/shared/services/profit-sharing-service";
import type { ProfitSharingProduct, ProfitSharingTransaction } from "@/shared/types/api";
import { Box, Grid, Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { ProfitSharingHero } from "./components/ProfitSharingHero";
import { TransactionHistory } from "./components/TransactionHistory";
import { WithdrawalForm } from "./components/WithdrawalForm";
import { TRANSACTIONS } from "./constants";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface WalletInitialData {
  profitSharingBalance?: number;
  transactions?: typeof TRANSACTIONS;
}

interface WalletPageProps {
  initialData?: WalletInitialData;
}

interface WalletTab {
  key: string;
  label: string;
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function WalletPage({ initialData }: WalletPageProps) {
  const [tabs, setTabs] = useState<WalletTab[] | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [products, setProducts] = useState<ProfitSharingProduct[]>([]);
  const [activeProduct, setActiveProduct] = useState<ProfitSharingProduct>();
  const [transactionHistory, setTransactionHistory] = useState<ProfitSharingTransaction[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const currentWalletRef = useRef<string>("");

  useEffect(() => {
    ProfitSharingService.getProducts()
      .then((res) => {
        if (res.success && res.data) {
          setProducts(res.data);
          const productTabs = res.data.map((product) => ({ key: product.wallet_code, label: product.product_name }));
          setTabs(productTabs);
          setActiveTab(productTabs[0].key);
        } else {
          setProductsError(res.message || "ไม่สามารถโหลดข้อมูลได้");
        }
      })
      .finally(() => setProductsLoading(false));
  }, []);

  useEffect(() => {
    const product = products.find((p) => p.wallet_code === activeTab);
    const wallet = product?.wallet_code ?? "";
    currentWalletRef.current = wallet;
    setActiveProduct(product);
    ProfitSharingService.getTransactionHistory(wallet).then((res) => {
      if (res.success && res.data) setTransactionHistory(res.data);
    });
  }, [activeTab]);

  useEffect(() => {
    if (!isLoading) return;
    ProfitSharingService.getTransactionHistory(currentWalletRef.current).then((res) => {
      if (res.success && res.data) setTransactionHistory(res.data);
      setIsLoading(false);
    });
    ProfitSharingService.getProducts().then((res) => {
      if (res.success && res.data) setActiveProduct(res.data.find((r) => r.wallet_code === activeProduct?.wallet_code));
    });
  }, [isLoading]);

  return (
    <Box sx={{ p: { xs: 2, lg: 3 }, flex: 1, minWidth: 0, overflowX: "hidden" }}>
      {/* ── Page Header ─────────────────────────────────────── */}
      <Box sx={{ mb: { xs: 2.5, lg: 3 } }}>
        <Typography
          variant="h5"
          sx={{ fontFamily: '"Manrope", var(--font-thai), sans-serif', fontWeight: 700, color: "text.primary", fontSize: { xs: "1.25rem", lg: "1.5rem" } }}
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
      <ProfitSharingHero balance={activeProduct?.available || 0} last_update={activeProduct?.last_update || ""} />

      {/* ── Lower Section ───────────────────────────────────── */}
      <Grid container spacing={{ xs: 2, lg: 3 }} alignItems="flex-start">
        <Grid size={{ xs: 12, md: 5, lg: 4 }}>
          <WithdrawalForm activeProduct={products.find((p) => p.wallet_code === activeTab) ?? null} setIsLoading={setIsLoading} />
        </Grid>
        <Grid size={{ xs: 12, md: 7, lg: 8 }}>
          <TransactionHistory transactions={transactionHistory} />
        </Grid>
      </Grid>
    </Box>
  );
}
