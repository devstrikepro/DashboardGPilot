"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Suspense } from "react";
import { Box, Grid, Skeleton, Alert, Stack } from "@mui/material";
import { MetricCard } from "@/shared/ui/metric-card";
import { useProductDetailData } from "./hooks/use-product-detail-data";
import { useSearchParams, useRouter } from "next/navigation";
import { getMetricsData } from "./constants/metrics";
import { ProductDetailHeader, ProductDetailTabs } from "./components";

// Dynamic imports to avoid barrel file pollution (Critical Request Chains)
const EquityChart = dynamic(() => import("@/shared/ui/equity-chart").then((mod) => mod.EquityChart), {
    loading: () => (<Skeleton variant="rectangular" height={350} sx={{ borderRadius: 4, bgcolor: "rgba(255,255,255,0.03)" }} />),
    ssr: false,
});

const SymbolPerformance = dynamic(() => import("@/shared/ui/symbol-performance").then((mod) => mod.SymbolPerformance), {
    loading: () => (<Skeleton variant="rectangular" height={340} sx={{ borderRadius: 4, bgcolor: "rgba(255,255,255,0.03)" }} />),
    ssr: false,
});

const RiskMetrics = dynamic(() => import("@/shared/ui/risk-metrics").then((mod) => mod.RiskMetrics), {
    ssr: false,
});

// History tab — dynamic import (lazy-loaded only when tab is active)
const HistoryTab = dynamic(() => import("@/features/history/HistoryPage"), {
    loading: () => (<Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3, bgcolor: "rgba(255,255,255,0.03)" }} />),
    ssr: false,
});

function ProductDetailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const productName = searchParams.get("name") ?? "Product Detail";
    const serviceBase = searchParams.get("base") ?? undefined;
    const [activeTab, setActiveTab] = useState(0);

    const {
        loading,
        error,
        account,
        equityData,
        symbolStats,
        volumeStats,
        performance,
        profitToday,
        profitWeek,
        profitMonth,
        formatCurrency,
    } = useProductDetailData(serviceBase || undefined);

    const balance = account?.balance ?? 0;
    const metrics = getMetricsData(balance, profitToday, profitWeek, profitMonth, formatCurrency);

    return (
        <Box sx={{ p: { xs: 2, lg: 3 }, flex: 1 }}>
            <ProductDetailHeader 
                productName={productName} 
                onBack={() => router.push("/dashboard")} 
            />

            <ProductDetailTabs 
                activeTab={activeTab} 
                onChange={(_, val) => setActiveTab(val)} 
            />

            {/* Tab Panel: Overview */}
            <Box
                role="tabpanel"
                id="tabpanel-overview"
                aria-labelledby="tab-overview"
                sx={{ display: activeTab === 0 ? 'block' : 'none' }}
            >
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <Grid container spacing={{ xs: 1.5, lg: 2 }} sx={{ mb: { xs: 2, lg: 3 } }}>
                    {metrics.map((metric) => (
                        <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={metric.title}>
                            {loading ? (
                                <Skeleton
                                    variant="rectangular"
                                    height={115}
                                    sx={{ borderRadius: 3, bgcolor: "rgba(255,255,255,0.03)" }}
                                />
                            ) : (
                                <MetricCard
                                    title={metric.title}
                                    value={metric.value}
                                    change={metric.change}
                                    changeType={metric.changeType}
                                    icon={metric.icon}
                                    iconColor={metric.iconColor}
                                />
                            )}
                        </Grid>
                    ))}
                </Grid>

                <Stack spacing={2}>
                    <RiskMetrics
                        loading={loading}
                        winRate={performance.winRate}
                        recoveryFactor={performance.recoveryFactor}
                        maxDrawdown={performance.maxDrawdown}
                        profitFactor={performance.profitFactor}
                    />
                    <EquityChart loading={loading} data={equityData} title="Account Growth" />
                    <SymbolPerformance loading={loading} stats={symbolStats} totalTrades={volumeStats.tradeCount} />
                </Stack>
            </Box>

            {/* Tab Panel: Trade History */}
            <Box
                role="tabpanel"
                id="tabpanel-history"
                aria-labelledby="tab-history"
                sx={{ display: activeTab === 1 ? 'block' : 'none' }}
            >
                <HistoryTab serviceBase={serviceBase || undefined} />
            </Box>
        </Box>
    );
}

export default function ProductDetailPage() {
    return (
        <Suspense fallback={<Box sx={{ p: 3 }}><Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3 }} /></Box>}>
            <ProductDetailContent />
        </Suspense>
    );
}
