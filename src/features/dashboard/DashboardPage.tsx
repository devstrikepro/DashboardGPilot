"use client";

import { Box, Typography, Grid, Alert } from "@mui/material";
import { useRouter } from "next/navigation";
import { ProductCard } from "./components/ProductCard";
import { useProductDetailData } from "@/features/product-detail/hooks/use-product-detail-data";

export function DashboardPage() {
  const router = useRouter();
  
  // โหลดข้อมูล GoldenBoy จาก hook เดิม 
  const { loading, error, profitMonth, performance, formatCurrency } = useProductDetailData();

  const handleCardClick = (productName: string) => {
    router.push(`/product-detail?name=${encodeURIComponent(productName)}`);
  };

  return (
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
          Product Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
          Select a product to view detailed performance metrics
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={{ xs: 2, lg: 3 }}>
        {/* Mock Data 1 - PPVP */}
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <ProductCard
            title="PPVP"
            avgMonthProfit={12500.5}
            percentDD={15.2}
            loading={loading}
            formatCurrency={formatCurrency}
            onClick={() => handleCardClick("PPVP")}
          />
        </Grid>

        {/* Real Data - GoldenBoy (ปัจจุบัน) */}
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <ProductCard
            title="GoldenBoy"
            avgMonthProfit={profitMonth ?? 0}
            percentDD={performance?.maxDrawdown ?? 0}
            loading={loading}
            formatCurrency={formatCurrency}
            onClick={() => handleCardClick("GoldenBoy")}
          />
        </Grid>

        {/* Mock Data 2 - บางระจัน */}
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <ProductCard
            title="บางระจัน (Bang Rajan)"
            avgMonthProfit={8450.75}
            percentDD={8.5}
            loading={loading}
            formatCurrency={formatCurrency}
            onClick={() => handleCardClick("BangRajan")}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
