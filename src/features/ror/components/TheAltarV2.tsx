import React, { useState, useEffect } from "react";
import { Button, Select, MenuItem, FormControl, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { God } from "./GodsPantheonV2";
import { SupportInfoResponse } from "@/shared/services/ror-service";

const selectSx = {
  color: "#fff",
  backgroundColor: "rgba(255,255,255,0.05)",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.2)" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#d4af37" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#d4af37" },
  "& .MuiSvgIcon-root": { color: "#fff" },
} as const;

const pledgeBtnSx = {
  backgroundColor: "#d4af37",
  color: "#000",
  fontWeight: 800,
  fontSize: "0.75rem",
  letterSpacing: "0.1em",
  py: 1.25,
  "&:hover": { backgroundColor: "#b8960f" },
  "&.Mui-disabled": { backgroundColor: "rgba(212,175,55,0.2)", color: "rgba(255,255,255,0.3)" },
} as const;

// subscribe_list keys are lowercase ("thor"), pledgeData.god is uppercase ("THOR")
const getSubscribedPort = (subscribeList: SupportInfoResponse["subscribe_list"] | undefined, godName: string): string => {
  if (!subscribeList || !godName) return "";
  const godKey = godName;
  return subscribeList.find((g) => godKey in g)?.[godKey]?.[0] ?? "";
};

export interface TheAltarV2Props {
  gods: God[];
  supportInfo: SupportInfoResponse | null;
  pledgeData: { investorId: string; god: string };
  onPledgeChange: (field: string, value: number) => void;
  onPledge: () => void;
  isLoading: boolean;
  message: string | null;
  onClearMessage: () => void;
  infoLoading: boolean;
}

export const TheAltarV2 = ({ gods, supportInfo, pledgeData, onPledgeChange, onPledge, isLoading, message, onClearMessage, infoLoading }: TheAltarV2Props) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const canPledge = !isLoading && !!pledgeData.god && !!pledgeData.investorId;

  return (
    <div className="flex flex-col gap-3">
      <div className="text-center">
        <h2 className="text-[#d4af37] font-bold text-lg">THE ALTAR</h2>
        <p className="text-slate-400 text-xs">(PLEDGE)</p>
      </div>
      <div className="rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm p-6! flex flex-col gap-4">
        <h3 className="text-white font-black text-xl text-center">
          PLEDGE YOUR
          <br />
          LOYALTY
        </h3>

        {/* God Select — uses gods prop directly so dropdown is always available */}
        <FormControl fullWidth size="small">
          <Select
            value={pledgeData.god || supportInfo?.main_port || ""}
            onChange={(e) => onPledgeChange("god", Number(e.target.value))}
            displayEmpty
            sx={selectSx}
            disabled={infoLoading || Date.now() >= new Date("2026-05-25T00:00:00+07:00").getTime() || !!supportInfo?.main_port || !!supportInfo?.slave_port}
            IconComponent={infoLoading ? () => <CircularProgress size={14} sx={{ color: "rgba(255,255,255,0.4)", mr: 1 }} /> : undefined}
            renderValue={(val) => {
              if (infoLoading) return <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>Loading...</span>;
              if (!val) return <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>Select God</span>;
              const god = gods.find((g) => g.port === val);
              return (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {god && (
                    <img src={god.image} alt="" style={{ width: 20, height: 20, borderRadius: "50%", objectFit: "cover", border: `1px solid ${god.color}` }} />
                  )}
                  <span style={{ fontWeight: 700 }}>Pledge: {god?.name}</span>
                </span>
              );
            }}
          >
            <MenuItem value="" disabled>
              Select God
            </MenuItem>
            {gods
              .filter((god) => supportInfo?.subscribe_list.some((list) => Object.keys(list)?.[0]?.includes(god.name)))
              .map((god) => (
                <MenuItem key={god.name} value={god.port} sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}>
                  <img src={god.image} alt="" style={{ width: 20, height: 20, borderRadius: "50%", objectFit: "cover", border: `1px solid ${god.color}` }} />
                  <span>{god.name}</span>
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        {/* Investor Account ID — selectable from subscribe_list for the chosen god */}
        <FormControl fullWidth size="small">
          <Select
            value={pledgeData.investorId || supportInfo?.slave_port || ""}
            onChange={(e) => onPledgeChange("investorId", Number(e.target.value))}
            displayEmpty
            disabled={infoLoading || pledgeData.god.length === 0 || !!supportInfo?.main_port || !!supportInfo?.slave_port}
            sx={selectSx}
            IconComponent={infoLoading ? () => <CircularProgress size={14} sx={{ color: "rgba(255,255,255,0.4)", mr: 1 }} /> : undefined}
            renderValue={(val) => {
              if (infoLoading) return <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>Loading...</span>;
              if (!val) return <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>Select Investor Account ID (e.g., MT5 ID)</span>;
              return <span style={{ fontWeight: 700 }}>{val}</span>;
            }}
          >
            <MenuItem value="" disabled>
              Select Investor Account ID
            </MenuItem>
            {(
              supportInfo?.subscribe_list.find((g) => gods.find((f) => f.port === pledgeData.god)?.name in g)?.[
                gods.find((f) => f.port === pledgeData.god)?.name
              ] ?? []
            ).map((id) => (
              <MenuItem key={id} value={id}>
                {id}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Dialog
          open={!!message}
          onClose={onClearMessage}
          slotProps={{
            paper: {
              sx: {
                backgroundColor: "#0f172a",
                border: `1px solid ${message?.includes("ไม่") ? "rgba(239,68,68,0.4)" : "rgba(212,175,55,0.4)"}`,
                borderRadius: 2,
                minWidth: 300,
              },
            },
          }}
        >
          <DialogTitle sx={{ color: message?.includes("ไม่") ? "#f87171" : "#d4af37", fontWeight: 800, fontSize: "0.9rem", letterSpacing: "0.05em", pb: 1 }}>
            {/* {message ? "บูชาไม่สำเร็จ" : "บูชาสำเร็จ"} */}
            {message}
          </DialogTitle>
          <DialogActions sx={{ px: 2, pb: 2 }}>
            <Button onClick={onClearMessage} variant="contained" size="small" sx={pledgeBtnSx}>
              OK
            </Button>
          </DialogActions>
        </Dialog>

        <Button
          fullWidth
          variant="contained"
          disabled={!canPledge || !!supportInfo?.main_port || !!supportInfo?.slave_port}
          onClick={() => setConfirmOpen(true)}
          sx={pledgeBtnSx}
        >
          {isLoading ? <CircularProgress size={20} sx={{ color: "#000" }} /> : "PLEDGE NOW (LOCK CHOICE)"}
        </Button>

        <Dialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          slotProps={{
            paper: {
              sx: {
                backgroundColor: "#0f172a",
                border: "1px solid rgba(212,175,55,0.4)",
                borderRadius: 2,
                minWidth: 300,
              },
            },
          }}
        >
          <DialogTitle sx={{ color: "#d4af37", fontWeight: 800, fontSize: "0.9rem", letterSpacing: "0.05em", pb: 1 }}>ยืนยันการบูชา?</DialogTitle>
          <DialogContent sx={{ color: "#cbd5e1", fontSize: "0.8rem", display: "flex", flexDirection: "column", gap: 1 }}>
            <span>
              คุณกำลังจะบูชา <strong style={{ color: "#d4af37" }}>{gods.find((f) => f.port === pledgeData.god)?.name}</strong> ด้วยบัญชี{" "}
              <strong style={{ color: "#d4af37" }}>{pledgeData.investorId}</strong>
            </span>
            <span style={{ color: "rgba(255,100,100,0.9)" }}>⚠ เมื่อยืนยันแล้ว จะไม่สามารถเปลี่ยนแปลงหรือแก้ไขการเลือกได้อีก</span>
          </DialogContent>
          <DialogActions sx={{ px: 2, pb: 2, gap: 1 }}>
            <Button
              onClick={() => setConfirmOpen(false)}
              variant="outlined"
              size="small"
              sx={{ py: 1.25, color: "#fff", borderColor: "rgba(255,255,255,0.2)", "&:hover": { borderColor: "#fff" } }}
            >
              CANCEL
            </Button>
            <Button
              onClick={() => {
                setConfirmOpen(false);
                onPledge();
              }}
              variant="contained"
              size="small"
              sx={{ ...pledgeBtnSx }}
            >
              CONFIRM
            </Button>
          </DialogActions>
        </Dialog>

        <div className={supportInfo?.main_port || supportInfo?.slave_port ? "" : "space-y-1!"}>
          {supportInfo?.main_port || supportInfo?.slave_port ? (
            <></>
          ) : (
            <p className="text-center">ข้อมูล port จะอัปเดตทุก 1 นาที กดรีเฟรชเพื่อดูข้อมูลล่าสุด</p>
          )}
          <p className="text-slate-500 text-[10px] text-center">Validation elements of our validation</p>
        </div>
      </div>
    </div>
  );
};
