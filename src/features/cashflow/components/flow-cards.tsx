"use client";

import { Card, CardContent, Box, Typography, Grid, Skeleton } from "@mui/material";
import { 
  CallReceived as CallReceivedIcon, 
  CallMade as CallMadeIcon, 
  TrendingUp as TrendingUpIcon, 
  TrendingDown as TrendingDownIcon 
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

const flowDataDefaults = [
  {
    title: "Largest Inflow",
    value: "+$10,000",
    subtitle: "Dec 01, 2024",
    icon: CallReceivedIcon,
    iconBg: "rgba(16, 185, 129, 0.2)",
    iconColorKey: "success",
    valueColorKey: "success",
  },
  {
    title: "Largest Outflow",
    value: "-$2,500",
    subtitle: "Dec 12, 2024",
    icon: CallMadeIcon,
    iconBg: "rgba(239, 68, 68, 0.2)",
    iconColorKey: "error",
    valueColorKey: "text",
  },
  {
    title: "Daily Delta",
    value: "+$842.50",
    subtitle: "Average daily change",
    icon: TrendingUpIcon,
    iconBg: "rgba(34, 211, 238, 0.2)",
    iconColorKey: "primary",
    valueColorKey: "success",
  },
  {
    title: "Net Flow",
    value: "+$14,500",
    subtitle: "This quarter",
    icon: TrendingDownIcon,
    iconBg: "rgba(148, 163, 184, 0.1)",
    iconColorKey: "secondary",
    valueColorKey: "success",
  },
];

interface FlowCardsProps {
  readonly loading?: boolean;
}

export function FlowCards({ loading }: Readonly<FlowCardsProps>) {
  const theme = useTheme();

  const getColor = (key: string) => {
    switch (key) {
      case "success":
        return theme.palette.success.main;
      case "error":
        return theme.palette.error.main;
      case "primary":
        return theme.palette.primary.main;
      case "secondary":
        return theme.palette.text.secondary;
      case "text":
        return theme.palette.text.primary;
      default:
        return theme.palette.text.primary;
    }
  };

  return (
    <Grid container spacing={{ xs: 1.5, lg: 2 }}>
      {flowDataDefaults.map((item) => (
        <Grid key={item.title} size={{ xs: 6, md: 3 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 2 }}>
              {loading ? (
                <>
                  <Skeleton variant="circular" width={32} height={32} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </>
              ) : (
                <>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 2,
                        bgcolor: item.iconBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <item.icon sx={{ fontSize: 18, color: getColor(item.iconColorKey) }} />
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary", fontSize: "0.7rem" }}
                    >
                      {item.title}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: '"Inter", monospace',
                      fontSize: { xs: "1.1rem", lg: "1.35rem" },
                      fontWeight: 700,
                      color: getColor(item.valueColorKey),
                    }}
                  >
                    {item.value}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", fontSize: "0.7rem" }}
                  >
                    {item.subtitle}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
