import React, { useState, useEffect } from "react";
import { TextField, Button, Select, MenuItem, FormControl, Checkbox, FormControlLabel, CircularProgress } from "@mui/material";
import { God } from "./GodsPantheonV2";
import { SupportInfoResponse } from "@/shared/services/ror-service";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    backgroundColor: "rgba(255,255,255,0.05)",
    "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
    "&:hover fieldset": { borderColor: "#d4af37" },
    "&.Mui-focused fieldset": { borderColor: "#d4af37" },
  },
  "& input::placeholder": { color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" },
} as const;

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

const checkboxSx = { color: "#d4af37", "&.Mui-checked": { color: "#d4af37" } } as const;

// subscribe_list keys are lowercase ("thor"), pledgeData.god is uppercase ("THOR")
const getSubscribedPort = (subscribeList: SupportInfoResponse["subscribe_list"] | undefined, godName: string): string => {
  if (!subscribeList || !godName) return "";
  return subscribeList[godName.toLowerCase()]?.[0] ?? "";
};

export interface TheAltarV2Props {
  gods: God[];
  supportInfo: SupportInfoResponse | null;
  pledgeData: { investorId: string; god: string };
  onPledgeChange: (field: string, value: string) => void;
  onPledge: () => void;
  isLoading: boolean;
  message: string | null;
  onClearMessage: () => void;
}

export const TheAltarV2 = ({ gods, supportInfo, pledgeData, onPledgeChange, onPledge, isLoading, message, onClearMessage }: TheAltarV2Props) => {
  const [validated, setValidated] = useState(false);
  const isError = message?.toLowerCase().includes("error") || message?.toLowerCase().includes("fail") || message?.toLowerCase().includes("invalid");

  // Auto-fill (or clear) investorId when god selection or supportInfo changes
  useEffect(() => {
    const port = getSubscribedPort(supportInfo?.subscribe_list, pledgeData.god);
    onPledgeChange("investorId", port);
  }, [pledgeData.god, supportInfo]);

  const canPledge = !isLoading && !!pledgeData.god && !!pledgeData.investorId && validated;

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
            value={pledgeData.god}
            onChange={(e) => onPledgeChange("god", e.target.value)}
            displayEmpty
            sx={selectSx}
            disabled={Date.now() >= new Date("2026-05-25T00:00:00+07:00").getTime()}
            renderValue={(val) => {
              if (!val) return <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>Select God</span>;
              const god = gods.find((g) => g.name === val);
              return (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {god && (
                    <img src={god.image} alt="" style={{ width: 20, height: 20, borderRadius: "50%", objectFit: "cover", border: `1px solid ${god.color}` }} />
                  )}
                  <span style={{ fontWeight: 700 }}>Pledge: {val}</span>
                </span>
              );
            }}
          >
            <MenuItem value="" disabled>
              Select God
            </MenuItem>
            {gods
              // .filter((god) => Object.keys(supportInfo?.subscribe_list || {}).includes(god.name.toLowerCase()))
              .filter((god) => supportInfo?.subscribe_list.some((list) => Object.keys(list)?.[0]?.includes(god.name.toLowerCase())))
              .map((god) => (
                <MenuItem key={god.name} value={god.name} sx={{ display: "flex", gap: 1.5, py: 1 }}>
                  <img src={god.image} alt="" style={{ width: 20, height: 20, borderRadius: "50%", objectFit: "cover", border: `1px solid ${god.color}` }} />
                  <span>{god.name}</span>
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        {/* Investor Account ID — auto-filled from subscribe_list via investorId state */}
        <TextField
          fullWidth
          size="small"
          placeholder="[Enter Investor Account ID] (e.g., MT5 ID)"
          value={pledgeData.investorId}
          variant="outlined"
          disabled
          sx={inputSx}
        />

        <span className="text-white text-xs">Validate our validation</span>

        {message && (
          <div
            className={`flex items-start gap-2 rounded-lg px-3 py-2 text-xs ${isError ? "bg-red-500/20 border border-red-500/40 text-red-300" : "bg-green-500/20 border border-green-500/40 text-green-300"}`}
          >
            <span className="flex-1">{message}</span>
            <button onClick={onClearMessage} className="opacity-60 hover:opacity-100 cursor-pointer leading-none">
              ✕
            </button>
          </div>
        )}

        <Button fullWidth variant="contained" disabled={!canPledge} onClick={onPledge} sx={pledgeBtnSx}>
          {isLoading ? <CircularProgress size={20} sx={{ color: "#000" }} /> : "PLEDGE NOW (LOCK CHOICE)"}
        </Button>

        <p className="text-slate-500 text-[10px] text-center">Validation elements of our validation</p>
      </div>
    </div>
  );
};
