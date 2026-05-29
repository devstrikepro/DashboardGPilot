"use client";

import { Button } from "@mui/material";
import { memo, useState } from "react";

interface FooterSectionV2Props {
  onLogout: () => void;
  isLoggedIn: boolean;
}

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

export const FooterSectionV2 = memo(({ onLogout, isLoggedIn }: FooterSectionV2Props) => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <div className="mt-auto py-4! px-10! border-t border-white/5 flex justify-end gap-6 text-slate-500 text-xs bg-[#0F172A]">
        <div className="flex items-center gap-6">
          <span>ข้อกำหนดและเงื่อนไข</span>
          <span>เว็บไซต์โบรกเกอร์</span>
          <span>ข้อมูลติดต่อ</span>
        </div>

        {isLoggedIn && (
          <button
            onClick={() => setShowConfirm(true)}
            className="bg-linear-to-b from-[#2a2a2a] via-[#1a1a1a] to-[#1a1a1a] border-2 border-[#8b6d3f] text-white font-bold py-1! px-3! rounded-lg shadow-[0_0_15px_rgba(139,109,63,0.3)] inner-glow hover:bg-[#2a2a2a] transition-all relative overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(139,109,63,0.4)] pointer-events-none"></div>
            <span className="relative z-10">ออกจากระบบ</span>
          </button>
        )}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative bg-[#0F172A] border border-[#8b6d3f]/60 rounded-xl shadow-[0_0_40px_rgba(139,109,63,0.25)] p-8! w-80 flex flex-col items-center gap-5">
            <div className="absolute inset-0 rounded-xl shadow-[inset_0_0_30px_rgba(139,109,63,0.1)] pointer-events-none" />

            <p className="text-slate-200 text-sm text-center leading-relaxed">
              คุณต้องการออกจากระบบ
              <br />
              ใช่หรือไม่?
            </p>

            <div className="flex justify-center gap-3 w-full">
              <Button
                onClick={() => setShowConfirm(false)}
                variant="outlined"
                size="small"
                sx={{ py: 1.25, color: "#fff", borderColor: "rgba(255,255,255,0.2)", "&:hover": { borderColor: "#fff" } }}
              >
                CANCEL
              </Button>
              <Button
                onClick={() => {
                  setShowConfirm(false);
                  onLogout();
                }}
                variant="contained"
                size="small"
                sx={{ ...pledgeBtnSx }}
              >
                CONFIRM
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});
