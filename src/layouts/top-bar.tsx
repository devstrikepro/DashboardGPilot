"use client";

import { 
  AppBar, 
  Toolbar, 
  Box, 
  Typography, 
  IconButton, 
  Button 
} from "@mui/material";
import { 
  Analytics as AnalyticsIcon, 
  Notifications as NotificationsIcon, 
  Add as AddIcon, 
  LightMode as LightModeIcon, 
  DarkMode as DarkModeIcon 
} from "@mui/icons-material";
import { useThemeMode } from "@/shared/ui/theme-provider";

export function TopBar() {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        display: { xs: "block", lg: "none" },
        bgcolor: mode === "dark" ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        transition: "background-color 0.3s ease",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 2,
              bgcolor: "rgba(34, 211, 238, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AnalyticsIcon sx={{ color: "primary.main", fontSize: 18 }} />
          </Box>
          <Typography
            variant="subtitle1"
            sx={{
              fontFamily: '"Manrope", sans-serif',
              fontWeight: 600,
              color: "text.primary",
            }}
          >
            Precision
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={toggleTheme}
            sx={{
              color: "text.secondary",
            }}
          >
            {mode === "dark" ? (
              <LightModeIcon sx={{ color: "#FBBF24" }} />
            ) : (
              <DarkModeIcon sx={{ color: "#64748B" }} />
            )}
          </IconButton>
          <IconButton sx={{ color: "text.secondary" }}>
            <NotificationsIcon />
          </IconButton>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            sx={{
              bgcolor: "primary.main",
              color: mode === "dark" ? "#0F172A" : "#FFFFFF",
              fontWeight: 500,
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            Deposit
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
