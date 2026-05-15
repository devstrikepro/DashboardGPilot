import { useEffect, useRef, useState } from "react";
import { useRagnarok } from "../hooks/useRagnarok";
import { GOD_STYLES } from "./GodsPantheonV2";

type RankingRow = ReturnType<typeof useRagnarok>["rankingData"][number];

interface ValhallaBoardV2Props {
  rankingData: RankingRow[];
  isLoading?: boolean;
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

export const ValhallaBoardV2 = ({ rankingData, isLoading }: ValhallaBoardV2Props) => {
  const [timeLeft, setTimeLeft] = useState<string>("กำลังคำนวณ...");

  useEffect(() => {
    if (!rankingData?.[0]?.last_update) {
      setTimeLeft("ไม่พบข้อมูลเวลา");
      return;
    }

    const lastUpdate = rankingData?.[0]?.last_update ? new Date(rankingData[0].last_update).getTime() + 7 * 60 * 60 * 1000 : NaN;

    if (isNaN(lastUpdate)) {
      setTimeLeft("รูปแบบเวลาไม่ถูกต้อง");
      return;
    }

    let intervalId: ReturnType<typeof setInterval>;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const targetTime = lastUpdate + 16 * 60 * 1000;
      const remaining = targetTime - now;

      if (remaining <= 0) {
        setTimeLeft("กดรีเฟรชเพื่อดูข้อมูลล่าสุด");
        clearInterval(intervalId);
        return;
      }

      const minutes = Math.floor(remaining / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      const pad = (num: number) => String(num).padStart(2, "0");
      setTimeLeft(`${pad(minutes)}:${pad(seconds)} นาที`);
    };

    // รันครั้งแรกทันทีเพื่อให้หน้าจอไม่ว่างเปล่า
    updateCountdown();

    // ตั้ง Interval อัปเดตทุก 1 วินาที
    intervalId = setInterval(updateCountdown, 1000);

    // เคลียร์ Interval เมื่อ Component ถูกถอดออก (Unmount)
    return () => clearInterval(intervalId);
  }, [rankingData?.[0]?.last_update]);

  return (
    <div className="flex flex-col gap-3">
      <div className="text-center">
        <h2 className="text-[#d4af37] font-bold text-lg">กระดานวัลฮัลลา</h2>
        <p className="text-slate-400 text-xs">(ตารางอันดับ)</p>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/60 p-6! backdrop-blur-sm space-y-2!">
        <div className="py-3 text-center">
          <h3 className="text-white font-black text-base tracking-widest">อันดับแบบเรียลไทม์</h3>
        </div>
        <div className="text-end">{timeLeft}</div>

        <div className="overflow-x-auto">
          <div className="min-w-100">
            {/* Header */}
            <div className="grid grid-cols-5 px-4! py-2! bg-white/5 rounded-lg">
              {(["อันดับ", "เทพเจ้า", "ROI %", "อัตราชนะ %", "ผู้ติดตาม"] as const).map((h, i) => (
                <span key={h} className={`text-slate-400 text-xs font-semibold ${i >= 2 ? "text-right" : ""}`}>
                  {h}
                </span>
              ))}
            </div>

            {/* Rows */}
            <div className="flex flex-col gap-1.5 mt-1.5">
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="grid grid-cols-5 items-center px-3! py-2.5! rounded-lg border border-transparent animate-pulse">
                      <div className="h-4 bg-white/10 rounded w-8" />
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/10 shrink-0" />
                        <div className="h-4 bg-white/10 rounded w-16" />
                      </div>
                      <div className="h-4 bg-white/10 rounded w-10 ml-auto" />
                      <div className="h-4 bg-white/10 rounded w-12 ml-auto" />
                      <div className="h-4 bg-white/10 rounded w-10 ml-auto" />
                    </div>
                  ))
                : rankingData.map((row) => {
                    const s = GOD_STYLES[row.god] ?? GOD_STYLES.ODIN;

                    return (
                      <div
                        key={row.rank}
                        className={`grid grid-cols-5 items-center px-3! py-2.5! rounded-lg transition-colors ${
                          row.rank === 1 ? "border border-[#d4af37] bg-[#d4af37]/5" : "border border-transparent hover:bg-white/5"
                        }`}
                      >
                        <span className={`font-black text-sm ${rankColor(row.rank)}`}>#{row.rank}</span>
                        <div className="flex items-center gap-2">
                          <img
                            src={row.avatar}
                            alt={row.god}
                            className="w-8 h-8 rounded-full object-cover shrink-0"
                            style={{ border: `2px solid ${row.color}` }}
                          />
                          <span className="text-white font-semibold text-sm whitespace-nowrap">{s.nameTH}</span>
                        </div>
                        <span className={`text-right font-black text-sm ${roiColor(row.rank)}`}>
                          {typeof row.roi === "number" ? Math.round(row.roi) : row.roi}
                        </span>
                        <span className={`text-right text-sm font-semibold ${winRateColor(row.winRate, row.rank)}`}>
                          {typeof row.winRate === "number" ? Math.round(row.winRate) : row.winRate}%
                        </span>
                        <span className={`text-right text-sm font-semibold ${followersColor(row.rank)}`}>{row.followers}</span>
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
