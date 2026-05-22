import { Box, Paper, Typography } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { fmt } from "../constants";
import { SectionIconBox } from "./SectionIconBox";

interface ProfitSharingHeroProps {
  balance: number;
}

export function ProfitSharingHero({ balance }: ProfitSharingHeroProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        mb: { xs: 2.5, lg: 3 },
        p: { xs: 3, lg: 4 },
        borderRadius: 4,
        position: "relative",
        overflow: "hidden",
        background: (t) =>
          t.palette.mode === "dark"
            ? "linear-gradient(135deg, rgba(8,145,178,0.25) 0%, rgba(34,211,238,0.08) 100%)"
            : "linear-gradient(135deg, rgba(8,145,178,0.12) 0%, rgba(34,211,238,0.04) 100%)",
        border: (t) =>
          `1px solid ${t.palette.mode === "dark" ? "rgba(34,211,238,0.25)" : "rgba(8,145,178,0.2)"}`,
      }}
    >
      {/* decorative blur blobs */}
      <Box
        sx={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 200,
          height: 200,
          borderRadius: "50%",
          bgcolor: "rgba(34,211,238,0.07)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -60,
          left: 60,
          width: 180,
          height: 180,
          borderRadius: "50%",
          bgcolor: "rgba(8,145,178,0.06)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: { md: "center" }, gap: 3, position: "relative" }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <SectionIconBox bg="rgba(34,211,238,0.2)" color="#22D3EE">
              <EmojiEventsIcon sx={{ fontSize: 18 }} />
            </SectionIconBox>
            <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600, letterSpacing: 0.5 }}>
              PROFIT SHARING BALANCE
            </Typography>
          </Box>
          <Typography
            variant="h2"
            sx={{
              fontFamily: '"Manrope", sans-serif',
              fontWeight: 800,
              fontSize: { xs: "2.2rem", lg: "3rem" },
              background: "linear-gradient(135deg, #22D3EE 0%, #0891B2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.03em",
              lineHeight: 1,
              mb: 0.5,
            }}
          >
            {fmt(balance)}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.disabled" }}>
            Last updated: Today, 17:30
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
