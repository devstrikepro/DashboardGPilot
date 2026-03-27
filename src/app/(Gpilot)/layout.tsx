import { Box } from "@mui/material";
import { Sidebar } from "@/layouts/sidebar";
import { TopBar } from "@/layouts/top-bar"; // Assume this exists from previous structure

export default function GpilotLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* 
        This is the shared Layout for (Gpilot) route group
        which includes the sidebar and top navigation for dashboard, analytics, etc. 
      */}
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <TopBar />
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, lg: 4 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
