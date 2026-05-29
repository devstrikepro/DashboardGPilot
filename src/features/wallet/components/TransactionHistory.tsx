import type { ProfitSharingTransaction } from "@/shared/types/api";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { CARD_SX, fmt, TX_META } from "../constants";
import { SectionIconBox } from "./SectionIconBox";

const TX_ICON: Record<string, React.ReactNode> = {
  rewards: <EmojiEventsIcon sx={{ fontSize: 18 }} />,
  deposit: <ArrowDownwardIcon sx={{ fontSize: 18 }} />,
  withdrawal: <ArrowUpwardIcon sx={{ fontSize: 18 }} />,
  rejected: <HighlightOffIcon sx={{ fontSize: 18 }} />,
  reject: <HighlightOffIcon sx={{ fontSize: 18 }} />,
  pending: <HourglassEmptyIcon sx={{ fontSize: 18 }} />,
  approved: <CheckCircleOutlineIcon sx={{ fontSize: 18 }} />,
  success: <CheckCircleOutlineIcon sx={{ fontSize: 18 }} />,
};

interface TransactionHistoryProps {
  transactions?: ProfitSharingTransaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  return (
    <Card sx={CARD_SX}>
      <CardContent sx={{ p: { xs: 2.5, lg: 3 }, "&:last-child": { pb: { xs: 2.5, lg: 3 } } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
          <SectionIconBox bg="rgba(245,158,11,0.15)" color="#F59E0B">
            <SwapHorizIcon sx={{ fontSize: 18 }} />
          </SectionIconBox>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Transaction History
          </Typography>
        </Box>

        <Stack spacing={1}>
          {transactions?.map((tx) => {
            const meta = TX_META[tx.type.toLowerCase() || ""] ?? { bg: "rgba(148,163,184,0.15)", color: "#94A3B8", label: tx.status };

            return (
              <Box
                key={tx.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  px: 1.5,
                  py: 1.25,
                  borderRadius: 2,
                  transition: "background 0.15s",
                  "&:hover": {
                    bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)"),
                  },
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    bgcolor: meta.bg,
                    color: meta.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {TX_ICON[tx.type.toLowerCase() || ""]}
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "text.primary", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                  >
                    {tx.description}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.disabled" }}>
                    {new Date(tx.created_at).toLocaleDateString("en-EN", { dateStyle: "medium" })}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 800,
                      fontFamily: '"Inter", monospace',
                      color: tx.status === "Reject" ? "error.main" : tx.amount > 0 ? "success.main" : "error.main",
                    }}
                  >
                    {/* {tx.amount > 0 ? "+" : "-"} */}
                    {fmt(tx.amount)}
                  </Typography>
                  <Chip
                    label={meta.label}
                    size="small"
                    sx={{
                      height: 16,
                      fontSize: "0.58rem",
                      fontWeight: 700,
                      mt: 0.25,
                      bgcolor: meta.bg,
                      color: meta.color,
                      "& .MuiChip-label": { px: 1 },
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}
