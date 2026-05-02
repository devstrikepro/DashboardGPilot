import { Grid, Alert } from "@mui/material";
import { ProductCard } from "./product-card";
import { useDashboardData } from "../hooks/use-dashboard-data";
import { ProductInfo } from "../constants/products";

interface DashboardCardProps {
    product: ProductInfo;
    onCardClick: (name: string, serviceBase: string) => void;
}

export function DashboardCard({ product, onCardClick }: DashboardCardProps) {
    const { loading, error, summary, formatCurrency } = useDashboardData(product.serviceBase);
    
    return (
        <Grid size={{ xs: 12, md: 6 }}>
            {error && (
                <Alert severity="warning" sx={{ mb: 1, py: 0, fontSize: '0.75rem' }}>
                    {product.title}: API Offline (Using Mock)
                </Alert>
            )}
            <ProductCard
                title={product.title}
                initials={product.initials}
                avgMonthProfit={summary?.avgProfitMonth ?? 0}
                percentDD={summary?.DD ?? 0}
                loading={loading}
                formatCurrency={formatCurrency}
                onClick={() => onCardClick(product.title, product.serviceBase)}
            />
        </Grid>
    );
}
