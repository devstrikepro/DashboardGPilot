"use client";

import { Box, Typography, Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/providers/auth-provider";
import { DashboardCard } from "./components";
import { PRODUCTS } from "./constants/products";
import type { LoginResponse } from "@/shared/types/auth";

interface DashboardPageProps {
  initialUser?: LoginResponse["user"] | null;
}

export function DashboardPage({ initialUser }: DashboardPageProps) {
  const router = useRouter();
  const { user: authUser } = useAuth();

  // ใช้ข้อมูลจาก Server (initialUser) หรือจาก Client Context (authUser)
  const user = initialUser || authUser;

  if (!user) return null;

  // ใช้ Optional Chaining และ Fallback เป็น Array ว่างหากข้อมูล menu ไม่ถูกส่งมา
  const dashboardMenu = user.menu?.dashboard || [];

  const visibleProducts = dashboardMenu.map((key) => PRODUCTS[key.toLowerCase()]).filter(Boolean);

  const handleCardClick = (productName: string, serviceBase: string) => {
    // ส่งข้อมูลไปกับ URL เพื่อให้หน้า Detail ใช้ยิง API ถูกเส้น
    router.push(`/product-detail?name=${encodeURIComponent(productName)}&base=${encodeURIComponent(serviceBase)}`);
  };

  return (
    <Box sx={{ p: { xs: 2, lg: 3 }, flex: 1 }}>
      <Box sx={{ mb: { xs: 2, lg: 3 }, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontFamily: "var(--font-manrope)",
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
      </Box>

      <Grid container spacing={{ xs: 2, lg: 3 }}>
        {visibleProducts.map((product) => (
          <DashboardCard key={product.id} product={product} onCardClick={handleCardClick} />
        ))}
      </Grid>
    </Box>
  );
}
