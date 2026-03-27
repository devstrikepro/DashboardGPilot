"use client";

import { 
  Card, 
  CardContent, 
  Box, 
  Typography, 
  TextField, 
  InputAdornment, 
  IconButton, 
  Chip, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TableSortLabel, 
  Grid, 
  CircularProgress 
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { useTheme } from "@mui/material/styles";
import type { Deal } from "@/shared/types/api";
import type { SortField, SortDirection, HistoryTotals } from "../hooks/use-history-data";

interface TradeTableProps {
  readonly loading?: boolean;
  readonly deals: readonly Deal[];
  readonly totals: HistoryTotals;
  readonly search: string;
  readonly onSearchChange: (value: string) => void;
  readonly sortField: SortField;
  readonly sortDirection: SortDirection;
  readonly onSort: (field: SortField) => void;
  readonly filteredCount: number;
}

export function TradeTable({
  loading,
  deals,
  totals,
  search,
  onSearchChange,
  sortField,
  sortDirection,
  onSort,
  filteredCount,
}: Readonly<TradeTableProps>) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <CardContent sx={{ p: { xs: 2, lg: 3 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            justifyContent: "space-between",
            alignItems: { lg: "center" },
            gap: 2,
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "text.primary" }}>
              Trade History
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {filteredCount} trades found
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextField
              size="small"
              placeholder="Search ticket or symbol..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                flex: 1,
                minWidth: { lg: 240 },
                "& .MuiOutlinedInput-root": {
                  bgcolor: isDark ? "rgba(148, 163, 184, 0.05)" : "rgba(15, 23, 42, 0.02)",
                  "& fieldset": {
                    borderColor: isDark ? "rgba(148, 163, 184, 0.1)" : "rgba(15, 23, 42, 0.1)",
                  },
                  "&:hover fieldset": {
                    borderColor: isDark ? "rgba(148, 163, 184, 0.2)" : "rgba(15, 23, 42, 0.2)",
                  },
                },
              }}
            />
            <IconButton
              sx={{
                border: isDark ? "1px solid rgba(148, 163, 184, 0.1)" : "1px solid rgba(15, 23, 42, 0.1)",
                borderRadius: 2,
              }}
            >
              <FilterListIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "text.secondary", fontWeight: 500, borderColor: theme.palette.divider }}>
                  <TableSortLabel
                    active={sortField === "ticket"}
                    direction={sortField === "ticket" ? sortDirection : "asc"}
                    onClick={() => onSort("ticket")}
                  >
                    Ticket
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ color: "text.secondary", fontWeight: 500, borderColor: theme.palette.divider }}>
                  <TableSortLabel
                    active={sortField === "symbol"}
                    direction={sortField === "symbol" ? sortDirection : "asc"}
                    onClick={() => onSort("symbol")}
                  >
                    Symbol
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ color: "text.secondary", fontWeight: 500, borderColor: theme.palette.divider }}>Type</TableCell>
                <TableCell sx={{ color: "text.secondary", fontWeight: 500, borderColor: theme.palette.divider }}>Entry</TableCell>
                <TableCell sx={{ color: "text.secondary", fontWeight: 500, borderColor: theme.palette.divider, display: { xs: "none", lg: "table-cell" } }}>Time</TableCell>
                <TableCell align="right" sx={{ color: "text.secondary", fontWeight: 500, borderColor: theme.palette.divider }}>
                  <TableSortLabel
                    active={sortField === "volume"}
                    direction={sortField === "volume" ? sortDirection : "asc"}
                    onClick={() => onSort("volume")}
                  >
                    Volume
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right" sx={{ color: "text.secondary", fontWeight: 500, borderColor: theme.palette.divider }}>
                  <TableSortLabel
                    active={sortField === "profit"}
                    direction={sortField === "profit" ? sortDirection : "asc"}
                    onClick={() => onSort("profit")}
                  >
                    Profit
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deals.map((deal) => {
                const renderDealTypeChip = () => {
                  let icon = <SwapHorizIcon sx={{ fontSize: 14, color: "text.secondary" }} />;
                  let bgcolor = "rgba(148, 163, 184, 0.2)";
                  let color = "text.secondary";

                  if (deal.type === "BUY") {
                    icon = <ArrowUpwardIcon sx={{ fontSize: 14, color: `${theme.palette.success.main} !important` }} />;
                    bgcolor = "rgba(16, 185, 129, 0.2)";
                    color = "success.main";
                  } else if (deal.type === "SELL") {
                    icon = <ArrowDownwardIcon sx={{ fontSize: 14, color: `${theme.palette.error.main} !important` }} />;
                    bgcolor = "rgba(239, 68, 68, 0.2)";
                    color = "error.main";
                  }

                  return (
                    <Chip
                      icon={icon}
                      label={deal.type}
                      size="small"
                      sx={{
                        bgcolor,
                        color,
                        fontWeight: 500,
                        fontSize: "0.7rem",
                      }}
                    />
                  );
                };

                const getDealProfitColor = () => {
                  if (deal.profit > 0) return "success.main";
                  if (deal.profit < 0) return "error.main";
                  return "text.primary";
                };

                return (
                  <TableRow
                    key={deal.ticket}
                    sx={{
                      "&:hover": { bgcolor: isDark ? "rgba(148, 163, 184, 0.05)" : "rgba(15, 23, 42, 0.02)" },
                    }}
                  >
                    <TableCell sx={{ fontFamily: '"Inter", monospace', color: "text.primary", borderColor: theme.palette.divider }}>
                      {deal.ticket}
                    </TableCell>
                    <TableCell sx={{ fontFamily: '"Inter", monospace', fontWeight: 500, color: "text.primary", borderColor: theme.palette.divider }}>
                      {deal.symbol || "-"}
                    </TableCell>
                    <TableCell sx={{ borderColor: theme.palette.divider }}>
                      {renderDealTypeChip()}
                    </TableCell>
                    <TableCell sx={{ borderColor: theme.palette.divider }}>
                      {deal.entry && (
                        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 500 }}>
                          {deal.entry}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ fontFamily: '"Inter", monospace', fontSize: "0.75rem", color: "text.secondary", borderColor: theme.palette.divider, display: { xs: "none", lg: "table-cell" } }}>
                      {deal.time}
                    </TableCell>
                    <TableCell align="right" sx={{ fontFamily: '"Inter", monospace', color: "text.primary", borderColor: theme.palette.divider }}>
                      {deal.volume.toFixed(2)}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontFamily: '"Inter", monospace',
                        fontWeight: 500,
                        color: getDealProfitColor(),
                        borderColor: theme.palette.divider,
                      }}
                    >
                      {deal.profit > 0 ? "+" : ""}${deal.profit.toFixed(2)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Paper
          sx={{
            mt: 2,
            p: 2,
            bgcolor: isDark ? "rgba(148, 163, 184, 0.05)" : "rgba(15, 23, 42, 0.02)",
            border: isDark ? "1px solid rgba(148, 163, 184, 0.08)" : "1px solid rgba(15, 23, 42, 0.05)",
          }}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, lg: 2 }}>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Total Volume
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Inter", monospace',
                  fontWeight: 700,
                  color: "text.primary",
                }}
              >
                {totals.volume.toFixed(2)} lots
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, lg: 2 }}>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Gross Profit
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Inter", monospace',
                  fontWeight: 700,
                  color: "success.main",
                }}
              >
                +${totals.grossProfit.toFixed(2)}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, lg: 2 }}>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Gross Loss
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Inter", monospace',
                  fontWeight: 700,
                  color: "error.main",
                }}
              >
                ${totals.grossLoss.toFixed(2)}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, lg: 2 }}>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Commission
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Inter", monospace',
                  fontWeight: 700,
                  color: "text.primary",
                }}
              >
                ${totals.commission.toFixed(2)}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, lg: 2 }}>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Swap
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Inter", monospace',
                  fontWeight: 700,
                  color: "text.primary",
                }}
              >
                ${totals.swap.toFixed(2)}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, lg: 2 }}>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Net P/L
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Inter", monospace',
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  color: totals.netPL >= 0 ? "success.main" : "error.main",
                }}
              >
                {totals.netPL > 0 ? "+" : ""}${totals.netPL.toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </CardContent>
    </Card>
  );
}
