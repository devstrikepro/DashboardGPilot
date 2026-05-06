"use client";

import {
  Box, Typography, Grid, Card, CardContent, Button,
  TextField, InputAdornment, Avatar, Chip, Stack, IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { useState } from "react";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_CLIENTS = [
  {
    id: 1,
    name: "Siriporn Kaewkla",
    initials: "SK",
    status: "Active" as const,
    portfolio: 32_450.0,
    performance: 12.4,
    sparkline: [100, 105, 102, 110, 108, 118, 115, 124],
    color: "#22D3EE",
  },
  {
    id: 2,
    name: "Nattapol Wongchai",
    initials: "NW",
    status: "Active" as const,
    portfolio: 18_720.5,
    performance: -3.2,
    sparkline: [100, 98, 95, 97, 93, 91, 95, 97],
    color: "#10B981",
  },
  {
    id: 3,
    name: "Priya Suwan",
    initials: "PS",
    status: "Inactive" as const,
    portfolio: 9_800.0,
    performance: 0.8,
    sparkline: [100, 101, 100, 103, 101, 102, 101, 101],
    color: "#F59E0B",
  },
  {
    id: 4,
    name: "Somchai Limcharoen",
    initials: "SL",
    status: "Active" as const,
    portfolio: 55_100.0,
    performance: 18.7,
    sparkline: [100, 108, 112, 115, 119, 122, 130, 119],
    color: "#8B5CF6",
  },
  {
    id: 5,
    name: "Malee Phongphan",
    initials: "MP",
    status: "Inactive" as const,
    portfolio: 4_325.0,
    performance: -7.5,
    sparkline: [100, 96, 93, 90, 88, 91, 93, 93],
    color: "#EC4899",
  },
  {
    id: 6,
    name: "Thanet Rungsri",
    initials: "TR",
    status: "Active" as const,
    portfolio: 41_200.0,
    performance: 9.1,
    sparkline: [100, 103, 105, 107, 109, 110, 109, 109],
    color: "#EF4444",
  },
];

const fmt = (val: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);

// ─── Sparkline SVG ────────────────────────────────────────────────────────────
function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const W = 80;
  const H = 32;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v - min) / range) * H}`)
    .join(" ");
  const color = positive ? "#10B981" : "#EF4444";
  return (
    <svg width={W} height={H} style={{ overflow: "visible" }}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts}
      />
    </svg>
  );
}

// ─── Client Card ──────────────────────────────────────────────────────────────
function ClientCard({ client }: { client: (typeof MOCK_CLIENTS)[0] }) {
  const isPositive = client.performance >= 0;
  return (
    <Card
      sx={{
        bgcolor: (t) =>
          t.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.8)",
        backdropFilter: "blur(12px)",
        border: (t) =>
          `1px solid ${t.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"}`,
        borderRadius: 3,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: (t) =>
            t.palette.mode === "dark"
              ? "0 8px 25px -5px rgba(34,211,238,0.15)"
              : "0 8px 25px -5px rgba(8,145,178,0.15)",
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2, lg: 2.5 }, "&:last-child": { pb: { xs: 2, lg: 2.5 } } }}>
        {/* Top row: Avatar + Name + Status */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          <Avatar
            sx={{
              width: 44,
              height: 44,
              bgcolor: client.color + "33",
              color: client.color,
              fontWeight: 700,
              fontSize: "0.9rem",
              border: `2px solid ${client.color}55`,
            }}
          >
            {client.initials}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 700, color: "text.primary", lineHeight: 1.2 }}>
              {client.name}
            </Typography>
            <Chip
              label={client.status}
              size="small"
              sx={{
                height: 18,
                fontSize: "0.6rem",
                fontWeight: 700,
                textTransform: "uppercase",
                mt: 0.3,
                bgcolor: client.status === "Active" ? "rgba(16,185,129,0.15)" : "rgba(148,163,184,0.1)",
                color: client.status === "Active" ? "#10B981" : "text.disabled",
              }}
            />
          </Box>
        </Box>

        {/* Portfolio + Sparkline */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 1.5 }}>
          <Box>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>Total Portfolio</Typography>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Inter", monospace',
                fontWeight: 800,
                color: "text.primary",
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
              }}
            >
              {fmt(client.portfolio)}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.4, mt: 0.3 }}>
              {isPositive ? (
                <TrendingUpIcon sx={{ fontSize: 14, color: "success.main" }} />
              ) : (
                <TrendingDownIcon sx={{ fontSize: 14, color: "error.main" }} />
              )}
              <Typography
                variant="caption"
                sx={{ fontWeight: 700, color: isPositive ? "success.main" : "error.main" }}
              >
                {isPositive ? "+" : ""}{client.performance}%
              </Typography>
            </Box>
          </Box>
          <Sparkline data={client.sparkline} positive={isPositive} />
        </Box>

        <Box sx={{ borderTop: (t) => `1px solid ${t.palette.divider}`, pt: 1.5, display: "flex", gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
            sx={{ flex: 1, borderRadius: 2, textTransform: "none", fontWeight: 600, py: 0.7, fontSize: "0.75rem" }}
          >
            Details
          </Button>
          <Button
            size="small"
            variant="contained"
            startIcon={<ShowChartIcon sx={{ fontSize: 14 }} />}
            sx={{ flex: 1, borderRadius: 2, textTransform: "none", fontWeight: 600, py: 0.7, fontSize: "0.75rem" }}
          >
            Trade
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export interface ClientsInitialData {
    clients?: typeof MOCK_CLIENTS;
}

interface ClientsPageProps {
    initialData?: ClientsInitialData;
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function ClientsPage({ initialData }: ClientsPageProps) {
  const [search, setSearch] = useState("");

  const clients = initialData?.clients ?? MOCK_CLIENTS;

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = clients.filter((c) => c.status === "Active").length;
  const totalPortfolio = clients.reduce((s, c) => s + c.portfolio, 0);

  return (
    <Box sx={{ p: { xs: 2, lg: 3 }, flex: 1 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2, mb: { xs: 2, lg: 3 }, flexWrap: "wrap" }}>
        <Box>
          <Typography
            variant="h5"
            sx={{ fontFamily: '"Manrope", sans-serif', fontWeight: 700, color: "text.primary", fontSize: { xs: "1.25rem", lg: "1.5rem" } }}
          >
            My Clients
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            {activeCount} active · {clients.length} total · {fmt(totalPortfolio)} AUM
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          sx={{ borderRadius: 2.5, fontWeight: 700, textTransform: "none", px: 3 }}
        >
          Add Client
        </Button>
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        placeholder="Search clients by name…"
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: 20, color: "text.secondary" }} />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 3,
          "& .MuiOutlinedInput-root": { borderRadius: 3 },
          maxWidth: 480,
        }}
      />

      {/* Summary chips */}
      <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: "wrap", gap: 1 }}>
        <Chip label={`All (${clients.length})`} size="small" color="primary" />
        <Chip label={`Active (${activeCount})`} size="small" sx={{ bgcolor: "rgba(16,185,129,0.15)", color: "#10B981", fontWeight: 600 }} />
        <Chip
          label={`Inactive (${clients.length - activeCount})`}
          size="small"
          sx={{ bgcolor: "rgba(148,163,184,0.1)", color: "text.secondary", fontWeight: 600 }}
        />
      </Stack>

      {/* Client Grid */}
      {filtered.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
          <SearchIcon sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
          <Typography variant="body1">No clients match "{search}"</Typography>
        </Box>
      ) : (
        <Grid container spacing={{ xs: 2, lg: 2.5 }}>
          {filtered.map((client) => (
            <Grid key={client.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <ClientCard client={client} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
