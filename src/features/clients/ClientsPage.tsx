"use client";

import { Box, Typography, Grid, Card, CardContent, Button, TextField, InputAdornment, Avatar, Chip, Stack, IconButton, Tab, Tabs } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProfitSharingService } from "@/shared/services/profit-sharing-service";
import type { MyClient, MyClientProduct /*, PortDetail */ } from "@/shared/types/api";
import EditIcon from "@mui/icons-material/Edit";
import crypto from "crypto";

interface WalletTab {
  key: string;
  label: string;
  product_port: number;
}

const fmt = (val: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);

// ─── Client Card ──────────────────────────────────────────────────────────────
// function ClientCard({ client, onStatusLoaded }: { client: MyClient; onStatusLoaded?: (mt5_id: number, status: string) => void }) {
function ClientCard({ client }: { client: MyClient }) {
  // const [portData, setPortData] = useState<PortDetail | null>(null);
  // useEffect(() => {
  //   ProfitSharingService.getPortDetail(client.mt5_id).then((res) => {
  //     if (res.success && res.data) {
  //       setPortData(res.data);
  //       onStatusLoaded?.(client.mt5_id, res.data.status ?? "Active");
  //     }
  //   });
  // }, [client.mt5_id]);

  const isActive = client.is_active;

  return (
    <Card
      sx={{
        bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.8)"),
        backdropFilter: "blur(12px)",
        border: (t) => `1px solid ${t.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"}`,
        borderRadius: 1,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: (t) => (t.palette.mode === "dark" ? "0 8px 25px -5px rgba(34,211,238,0.15)" : "0 8px 25px -5px rgba(8,145,178,0.15)"),
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2, lg: 2.5 }, "&:last-child": { pb: { xs: 2, lg: 2.5 } } }}>
        {/* Top row: Avatar + Name + Status + action icon */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          <Avatar
            sx={{
              width: 44,
              height: 44,
              bgcolor: "rgba(8,145,178,0.15)",
              color: "rgba(255,255,255,0.85)",
              fontWeight: 700,
              fontSize: "0.9rem",
              border: "2px solid rgba(34,211,238,0.15)",
            }}
          >
            {client.name.split(" ")[0][0] + client.name.split(" ")[1][0]}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 700, color: "text.primary", lineHeight: 1.2 }}>
              {client.name}
            </Typography>
            <Chip
              label={isActive ? "Active" : "Inactive"}
              size="small"
              sx={{
                height: 18,
                fontSize: "0.6rem",
                fontWeight: 700,
                textTransform: "uppercase",
                mt: 0.3,
                bgcolor: isActive ? "rgba(16,185,129,0.15)" : "rgba(148,163,184,0.1)",
                color: isActive ? "#10B981" : "text.disabled",
              }}
            />
          </Box>
          <IconButton
            disabled
            size="small"
            sx={{ width: 28, height: 28, "&.Mui-disabled": { backgroundColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.2)", opacity: 1 } }}
          >
            <EditIcon sx={{ fontSize: 15 }} />
          </IconButton>
        </Box>

        {/* Balance + Total PF rows */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Balance
            </Typography>
            <Typography variant="body2" sx={{ fontSize: 18, fontWeight: 700, color: "#22D3EE", fontFamily: '"Inter", monospace' }}>
              {fmt(client.balance)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Total PF
            </Typography>
            <Typography variant="body2" sx={{ fontSize: 18, fontWeight: 700, color: "#22D3EE", fontFamily: '"Inter", monospace' }}>
              {fmt(client.total_pf)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export interface ClientsInitialData {
  clients?: MyClient[];
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function ClientsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const p = searchParams.get("p");

  function decrypt() {
    try {
      if (!p) return null;
      const [ivHex, encryptedText, authTagHex] = p.split(":");
      const iv = Buffer.from(ivHex, "hex");
      const authTag = Buffer.from(authTagHex, "hex");
      const keySource = process.env.NEXT_PUBLIC_ENCRYPT_KEY ?? "gpilot-secret-key";
      const key = Buffer.alloc(32);
      Buffer.from(keySource, "utf8").copy(key);
      const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
      decipher.setAuthTag(authTag);
      let decrypted = decipher.update(encryptedText, "hex", "utf8");
      decrypted += decipher.final("utf8");
      return parseInt(decrypted, 10);
    } catch {
      return null;
    }
  }

  const port = useMemo(() => decrypt(), [p]);

  const [tabs, setTabs] = useState<WalletTab[] | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  // const [clientStatuses, setClientStatuses] = useState<Record<number, string>>({});
  const [myClients, setMyClients] = useState<MyClientProduct | null>(null);
  const [myClientsLoading, setMyClientsLoading] = useState(false);
  const [myClientsError, setMyClientsError] = useState<string | null>(null);

  const clients = myClients?.user;

  useEffect(() => {
    ProfitSharingService.getProducts().then((res) => {
      if (res.success && res.data) {
        const productTabs = res.data.map((p) => ({ key: p.wallet_code, label: p.product_name, product_port: p.product_port }));
        setTabs(productTabs);
      }
    });
  }, []);

  useEffect(() => {
    if (!tabs || tabs.length === 0) return;
    const matched = tabs.find((t) => Number(t.product_port) === Number(port));
    setActiveTab(matched?.key ?? tabs[0].key);
  }, [tabs, port]);

  useEffect(() => {
    const tab = tabs?.find((t) => t.key === activeTab);
    if (!tab) return;
    setMyClients(null);
    // setClientStatuses({});
    setMyClientsLoading(true);
    setMyClientsError(null);
    ProfitSharingService.getMyClients(tab.product_port)
      .then((res) => {
        if (res.success && res.data) {
          setMyClients(res.data);
        } else {
          setMyClientsError(res.message ?? "ไม่สามารถโหลดข้อมูล Clients ได้");
        }
      })
      .finally(() => setMyClientsLoading(false));
  }, [activeTab]);

  // const handleStatusLoaded = (mt5_id: number, status: string) => {
  //   setClientStatuses((prev) => ({ ...prev, [mt5_id]: status }));
  // };

  const filtered = clients?.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    // old: const status = (clientStatuses[c.mt5_id] ?? "Active").toLowerCase();
    // old: const matchesStatus = statusFilter === "all" || status === statusFilter;
    const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? c.is_active : !c.is_active);
    return matchesSearch && matchesStatus;
  });

  const activeCount = clients?.reduce((p, c) => (c.is_active ? p + 1 : p), 0) || 0;
  const inactiveCount = (clients?.length || 0) - activeCount;
  const totalPortfolio = clients?.reduce((s, c) => s + c.balance, 0) ?? 0;

  return (
    <Box sx={{ p: { xs: 2, lg: 3 }, flex: 1 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2, mb: { xs: 2, lg: 3 }, flexWrap: "wrap" }}>
        <Box>
          <Typography
            variant="h5"
            sx={{ fontFamily: '"Manrope", var(--font-thai), sans-serif', fontWeight: 700, color: "text.primary", fontSize: { xs: "1.25rem", lg: "1.5rem" } }}
          >
            My Clients
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            {activeCount} active · {clients?.length} total · {fmt(totalPortfolio)} AUM
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          sx={{ borderRadius: 2.5, fontWeight: 700, textTransform: "none", px: 3 }}
          onClick={() => router.push("/add-port")}
        >
          Add Client
        </Button>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={activeTab ?? false}
          onChange={(_, v) => setActiveTab(v)}
          sx={{
            "& .MuiTab-root": { textTransform: "none", fontWeight: 500, fontSize: "0.875rem", minHeight: 44, gap: 0.5 },
            "& .Mui-selected": { fontWeight: 700 },
          }}
        >
          {tabs?.map((tab) => (
            <Tab key={tab.key} value={tab.key} id={`${tab.key}`} aria-controls={"tabpanel-" + tab.key} iconPosition="start" label={tab.label} />
          ))}
        </Tabs>
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
        <Chip
          label={`All (${clients?.length || 0})`}
          size="small"
          color="primary"
          variant={statusFilter === "all" ? "filled" : "outlined"}
          onClick={() => setStatusFilter("all")}
          sx={{ cursor: "pointer", fontWeight: 600 }}
        />
        <Chip
          label={`Active (${activeCount})`}
          size="small"
          onClick={() => setStatusFilter("active")}
          sx={{
            cursor: "pointer",
            fontWeight: 600,
            bgcolor: statusFilter === "active" ? "rgba(16,185,129,0.3)" : "rgba(16,185,129,0.15)",
            color: "#10B981",
            border: statusFilter === "active" ? "1px solid #10B981" : "1px solid transparent",
          }}
        />
        <Chip
          label={`Inactive (${inactiveCount})`}
          size="small"
          onClick={() => setStatusFilter("inactive")}
          sx={{
            cursor: "pointer",
            fontWeight: 600,
            bgcolor: statusFilter === "inactive" ? "rgba(148,163,184,0.2)" : "rgba(148,163,184,0.1)",
            color: "text.secondary",
            border: (t) => (statusFilter === "inactive" ? `1px solid ${t.palette.text.secondary}` : "1px solid transparent"),
          }}
        />
      </Stack>

      {/* Client Grid */}
      {filtered?.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
          <SearchIcon sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
          <Typography variant="body1">No clients match {search ? '"' + search + '"' : ""}</Typography>
        </Box>
      ) : (
        <Grid container spacing={{ xs: 2, lg: 2.5 }}>
          {filtered?.map((client) => (
            <Grid key={client.mt5_id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <ClientCard client={client} /* onStatusLoaded={handleStatusLoaded} */ />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
