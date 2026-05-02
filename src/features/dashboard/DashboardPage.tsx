"use client";

import { Box, Typography, Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/providers/auth-provider";
import { DashboardCard } from "./components";
import { PRODUCTS } from "./constants/products";

export function DashboardPage() {
    const router = useRouter();
    const { user } = useAuth();

    if (!user) return null; // สามารถเพิ่ม Loading Skeleton ที่นี่ได้

    const visibleProducts = user.menu.dashboard
        .map(key => PRODUCTS[key.toLowerCase()])
        .filter(Boolean);

    const handleCardClick = (productName: string, serviceBase: string) => {
        // ส่งข้อมูลไปกับ URL เพื่อให้หน้า Detail ใช้ยิง API ถูกเส้น
        router.push(`/product-detail?name=${encodeURIComponent(productName)}&base=${encodeURIComponent(serviceBase)}`);
    };

    return (
        <Box sx={{ p: { xs: 2, lg: 3 }, flex: 1 }}>
            <Box sx={{ mb: { xs: 2, lg: 3 }, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Box>
                    <Typography
                        variant="h5"
                        sx={{
                            fontFamily: 'var(--font-manrope)',
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
                <Typography
                    variant="caption"
                    sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        fontWeight: 700,
                        textTransform: 'uppercase'
                    }}
                >
                    Role: {user.role}
                </Typography>
            </Box>

            <Grid container spacing={{ xs: 2, lg: 3 }}>
                {visibleProducts.map((product) => (
                    <DashboardCard
                        key={product.id}
                        product={product}
                        onCardClick={handleCardClick}
                    />
                ))}
            </Grid>
        </Box>
    );
}
