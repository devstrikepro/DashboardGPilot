"use client";

import { useState } from "react";

interface FooterSectionV2Props {
  onLogout: () => void;
  isLoggedIn: boolean;
}

export const FooterSectionV2 = ({ onLogout, isLoggedIn }: FooterSectionV2Props) => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <div className="mt-auto py-4! px-10! border-t border-white/5 flex justify-end gap-6 text-slate-500 text-xs bg-[#0F172A]">
        <div className="flex items-center gap-6">
          <span>Terms &amp; Conditions</span>
          <span>Broker Website</span>
          <span>Contact Info</span>
        </div>

        {isLoggedIn && (
          <button
            onClick={() => setShowConfirm(true)}
            className="bg-linear-to-b from-[#2a2a2a] via-[#1a1a1a] to-[#1a1a1a] border-2 border-[#8b6d3f] text-white font-bold py-1! px-3! rounded-lg shadow-[0_0_15px_rgba(139,109,63,0.3)] inner-glow hover:bg-[#2a2a2a] transition-all relative overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(139,109,63,0.4)] pointer-events-none"></div>
            <span className="relative z-10">Logout</span>
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

            <div className="flex gap-3 w-full">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2 rounded-lg border border-white/10 text-slate-400 text-xs font-medium hover:bg-white/5 transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  onLogout();
                }}
                className="flex-1 py-2 rounded-lg bg-linear-to-b from-[#2a2a2a] via-[#1a1a1a] to-[#1a1a1a] border border-[#8b6d3f] text-white text-xs font-bold shadow-[0_0_12px_rgba(139,109,63,0.3)] hover:shadow-[0_0_20px_rgba(139,109,63,0.5)] transition-all cursor-pointer"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
