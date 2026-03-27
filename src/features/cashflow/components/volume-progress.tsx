"use client";

import { Card, CardContent, Box, Typography, LinearProgress, CircularProgress, Skeleton } from "@mui/material";

interface VolumeProgressProps {
  readonly loading?: boolean;
}

export function VolumeProgress({ loading }: Readonly<VolumeProgressProps>) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: { xs: 2, lg: 3 } }}>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, color: "text.primary" }}
          >
            Volume Quotient
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Monthly trading activity vs goal
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 4, position: "relative" }}>
          {loading ? (
            <Skeleton variant="circular" width={140} height={140} />
          ) : (
            <>
              <CircularProgress
                variant="determinate"
                value={100}
                size={140}
                thickness={4}
                sx={{ color: (theme) => theme.palette.mode === "dark" ? "rgba(148, 163, 184, 0.1)" : "rgba(15, 23, 42, 0.05)" }}
              />
              <CircularProgress
                variant="determinate"
                value={78}
                size={140}
                thickness={4}
                sx={{
                  color: "primary.main",
                  position: "absolute",
                  left: 0,
                  strokeLinecap: "round",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary" }}>
                  78%
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  of goal
                </Typography>
              </Box>
            </>
          )}
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {loading ? (
            <>
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="100%" />
            </>
          ) : (
            <>
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Standard Lots
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    156.4 / 200
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={78}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(148, 163, 184, 0.1)" : "rgba(15, 23, 42, 0.05)",
                  }}
                />
              </Box>
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Trade Count
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    412 / 500
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={82}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(148, 163, 184, 0.1)" : "rgba(15, 23, 42, 0.05)",
                    "& .MuiLinearProgress-bar": { bgcolor: "success.main" },
                  }}
                />
              </Box>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
