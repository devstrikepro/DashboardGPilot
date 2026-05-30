"use client";

import { Box, Grid, Card, CardContent, Typography, Avatar, CardActionArea, Skeleton } from "@mui/material";
import { AccountBalanceWallet as WalletIcon, ArrowForward as ArrowForwardIcon } from "@mui/icons-material";
import type { AccountInfo } from "@/shared/types/api";

interface PortSelectionProps {
  readonly ports: AccountInfo[];
  readonly onSelect: (index: number) => void;
  readonly loading: boolean;
}

const formatUSD = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

export function PortSelection({ ports, onSelect, loading }: Readonly<PortSelectionProps>) {
  if (loading && ports.length === 0) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3].map((i) => (
          <Grid key={i} size={{ xs: 12, md: 4 }}>
            <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 4 }} />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ mb: 4, fontWeight: 700, textAlign: "left" }}>
        Select an Account to View Portfolio
      </Typography>
      <Grid container spacing={3} justifyContent="flex-start">
        {ports.map((port, index) => {
          const isProfit = port.net_profit >= 0;

          return (
            <Grid key={`${port.mt5_id}-${index}`} size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
                    "& .arrow-icon": { transform: "translateX(4px)" },
                  },
                }}
              >
                <CardActionArea onClick={() => onSelect(index)} disableRipple>
                  <CardContent sx={{ p: 2.5, pb: "0 !important" }}>
                    {/* Header row */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5 }}>
                      <Avatar
                        sx={{
                          width: 52,
                          height: 52,
                          bgcolor: "primary.main",
                          boxShadow: "0 4px 14px rgba(34, 211, 238, 0.35)",
                          flexShrink: 0,
                        }}
                      >
                        <img src={port.image} alt="" className="w-7 h-7 rounded-full" />
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body1" sx={{ fontWeight: 700, lineHeight: 1.3, letterSpacing: 0.3 }} noWrap>
                          {port.mt5_id}
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 700, lineHeight: 1.3, letterSpacing: 0.3 }}>
                          {port.support_group}
                        </Typography>
                      </Box>
                      <ArrowForwardIcon
                        className="arrow-icon"
                        sx={{ color: "text.secondary", fontSize: 20, transition: "transform 0.25s ease", flexShrink: 0 }}
                      />
                    </Box>

                    {/* Stats rows */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25, px: 0.5 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          Growth
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: 18, fontWeight: 700, color: isProfit ? "success.main" : "error.main" }}>
                          {port.growth}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          Net Profit
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: isProfit ? "success.main" : "error.main" }}>
                          {formatUSD(port.net_profit)}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Balance strip */}
                    <Box
                      sx={{
                        borderRadius: 2,
                        mt: 2,
                        mb: 2,
                        px: 2.5,
                        py: 1.5,
                        bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(34, 50, 67, 1)" : "rgba(8, 145, 178, 0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <WalletIcon sx={{ fontSize: 18, color: "primary.main" }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Balance
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "primary.main" }}>
                        {formatUSD(port.balance)}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
