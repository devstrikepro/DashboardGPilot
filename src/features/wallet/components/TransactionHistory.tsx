import { useEffect, useState } from "react";
import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { CARD_SX, fmt, TRANSACTIONS, TX_META } from "../constants";
import { SectionIconBox } from "./SectionIconBox";
import { ProfitSharingService } from "@/shared/services/profit-sharing-service";
import type { ProfitSharingTransaction } from "@/shared/types/api";

const TX_ICON: Record<string, React.ReactNode> = {
  credit: <EmojiEventsIcon sx={{ fontSize: 18 }} />,
  deposit: <ArrowDownwardIcon sx={{ fontSize: 18 }} />,
  withdraw: <ArrowUpwardIcon sx={{ fontSize: 18 }} />,
};

interface TransactionHistoryProps {
  transactions?: typeof TRANSACTIONS;
}

export function TransactionHistory({ transactions = TRANSACTIONS }: TransactionHistoryProps) {
  const [transactionHistory, setTransactionHistory] = useState<ProfitSharingTransaction[]>([]);

  useEffect(() => {
    ProfitSharingService.getTransactionHistory().then((res) => {
      if (res.success && res.data) {
        console.log("res: ", res);
        console.log("res.data: ", res.data);
        setTransactionHistory(res.data);
      }
    });
  }, []);

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
          {transactions.map((tx) => {
            const meta = TX_META[tx.type];
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
                  {TX_ICON[tx.type]}
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "text.primary", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                  >
                    {tx.label}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.disabled" }}>
                    {tx.date}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: '"Inter", monospace', color: tx.amount > 0 ? "success.main" : "error.main" }}>
                    {tx.amount > 0 ? "+" : "-"}
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
