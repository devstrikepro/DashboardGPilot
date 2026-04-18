"use client";

import { Card, CardContent, CardActionArea, Box, Typography, Skeleton } from "@mui/material";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import LocalMallIcon from "@mui/icons-material/LocalMall";

interface ProductCardProps {
  title: string;
  avgMonthProfit: number;
  percentDD: number;
  loading?: boolean;
  onClick: () => void;
  formatCurrency: (val: number) => string;
}

export function ProductCard({
  title,
  avgMonthProfit,
  percentDD,
  loading,
  onClick,
  formatCurrency
}: ProductCardProps) {

  if (loading) {
    return (
      <Skeleton 
        variant="rectangular" 
        height={160} 
        sx={{ borderRadius: 3, bgcolor: "rgba(255,255,255,0.03)" }} 
      />
    );
  }

  return (
    <Card
      sx={{
        height: 160,
        display: "flex",
        flexDirection: "column",
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.03)"
            : "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(12px)",
        border: (theme) =>
          `1px solid ${
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(0, 0, 0, 0.05)"
          }`,
        borderRadius: 3,
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? "0 4px 20px -10px rgba(0,0,0,0.5)"
            : "0 4px 20px -10px rgba(0,0,0,0.1)",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "0 8px 25px -5px rgba(34, 211, 238, 0.2)"
              : "0 8px 25px -5px rgba(8, 145, 178, 0.2)",
          borderColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(34, 211, 238, 0.4)"
              : "rgba(8, 145, 178, 0.4)",
        }
      }}
    >
      <CardActionArea onClick={onClick} sx={{ height: "100%", p: { xs: 2, lg: 2.5 } }}>
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(34, 211, 238, 0.15)"
                    : "rgba(8, 145, 178, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LocalMallIcon sx={{ color: "primary.main", fontSize: 20 }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: "text.primary",
                fontFamily: "var(--font-inter)",
                fontWeight: 700,
                fontSize: { xs: "1.1rem", lg: "1.25rem" },
                letterSpacing: "-0.01em",
              }}
            >
              {title}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <ShowChartIcon sx={{ fontSize: 16, color: "success.main" }} />
              <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.8rem", fontWeight: 500 }}>
                AVG Month Profit
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: "text.primary", fontWeight: 700, fontFamily: "var(--font-inter)" }}>
              {formatCurrency(avgMonthProfit)}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
             <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <WarningAmberIcon sx={{ fontSize: 16, color: "error.main" }} />
              <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.8rem", fontWeight: 500 }}>
                Percent DD
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: "error.main", fontWeight: 700, fontFamily: "var(--font-inter)" }}>
              {percentDD.toFixed(2)}%
            </Typography>
          </Box>

        </CardContent>
      </CardActionArea>
    </Card>
  );
}
