"use client";

import { Box } from "@mui/material";
import { Sidebar } from "@/layouts/sidebar";
import { BottomNav } from "./bottom-nav";
import { TopBar } from "@/layouts/top-bar";

interface DashboardLayoutProps {
  readonly children: React.ReactNode;
}

export function DashboardLayout({ children }: Readonly<DashboardLayoutProps>) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flex: 1,
          ml: { xs: 0, lg: "256px" },
          pb: { xs: "80px", lg: 0 },
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TopBar />
        {children}
      </Box>
      <BottomNav />
    </Box>
  );
}
