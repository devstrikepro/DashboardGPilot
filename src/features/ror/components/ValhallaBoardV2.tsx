import React from "react";
import { useRagnarok } from "../hooks/useRagnarok";

type RankingRow = ReturnType<typeof useRagnarok>["rankingData"][number];

interface ValhallaBoardV2Props {
  rankingData: RankingRow[];
}

const rankColor = (rank: number) => {
  if (rank === 1) return "text-[#d4af37]";
  if (rank === 2) return "text-white";
  return "text-red-400";
};

const roiColor = (rank: number) => {
  if (rank === 1) return "text-[#d4af37]";
  return "text-green-400";
};

const winRateColor = (winRate: number, rank: number) => {
  if (rank === 1) return "text-[#d4af37]";
  return winRate >= 50 ? "text-green-400" : "text-orange-400";
};

const followersColor = (rank: number) => (rank === 1 ? "text-[#d4af37]" : "text-white");

export const ValhallaBoardV2 = ({ rankingData }: ValhallaBoardV2Props) => (
  <div className="flex flex-col gap-3">
    <div className="text-center">
      <h2 className="text-[#d4af37] font-bold text-lg">VALHALLA BOARD</h2>
      <p className="text-slate-400 text-xs">(LEADERBOARD)</p>
    </div>
    <div className="rounded-xl border border-white/10 bg-black/60 p-6! backdrop-blur-sm overflow-hidden space-y-2!">
      <div className="py-3  text-center">
        <h3 className="text-white font-black text-base tracking-widest">LIVE RANKING</h3>
      </div>

      {/* Header */}
      <div className="grid grid-cols-[56px_1fr_72px_96px_76px] px-4! py-2! bg-white/5 rounded-lg">
        {(["Rank", "God", "ROI %", "Win Rate %", "Followers"] as const).map((h, i) => (
          <span key={h} className={`text-slate-400 text-xs font-semibold ${i >= 2 ? "text-right" : ""}`}>
            {h}
          </span>
        ))}
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-1.5">
        {rankingData.map((row) => (
          <div
            key={row.rank}
            className={`grid grid-cols-[56px_1fr_72px_96px_76px] items-center px-3! py-2.5! rounded-lg transition-colors ${
              row.rank === 1 ? "border border-[#d4af37] bg-[#d4af37]/5" : "border border-transparent hover:bg-white/5"
            }`}
          >
            <span className={`font-black text-sm ${rankColor(row.rank)}`}>#{row.rank}</span>

            <div className="flex items-center gap-2">
              <img src={row.avatar} alt={row.god} className="w-8 h-8 rounded-full object-cover shrink-0" style={{ border: `2px solid ${row.color}` }} />
              <span className="text-white font-semibold text-sm">{row.god}</span>
            </div>

            <span className={`text-right font-black text-sm ${roiColor(row.rank)}`}>{typeof row.roi === "number" ? Math.round(row.roi) : row.roi}</span>

            <span className={`text-right text-sm font-semibold ${winRateColor(row.winRate, row.rank)}`}>
              {typeof row.winRate === "number" ? Math.round(row.winRate) : row.winRate}%
            </span>

            <span className={`text-right text-sm font-semibold ${followersColor(row.rank)}`}>{row.followers}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);
