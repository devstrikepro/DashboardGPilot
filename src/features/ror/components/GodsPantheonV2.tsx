import { useRagnarok } from "../hooks/useRagnarok";

export type God = ReturnType<typeof useRagnarok>["gods"][number];

const GOD_STYLES: Record<string, { border: string; glow: string; textColor: string; btnBorder: string; btnHover: string }> = {
  THOR: {
    border: "border-red-500",
    glow: "shadow-[0_0_20px_rgba(239,68,68,0.4)]",
    textColor: "text-red-400",
    btnBorder: "border-red-500",
    btnHover: "hover:bg-red-500/20",
  },
  LOKI: {
    border: "border-green-500",
    glow: "shadow-[0_0_20px_rgba(34,197,94,0.4)]",
    textColor: "text-green-400",
    btnBorder: "border-green-500",
    btnHover: "hover:bg-green-500/20",
  },
  HEIMDALL: {
    border: "border-sky-400",
    glow: "shadow-[0_0_20px_rgba(56,189,248,0.4)]",
    textColor: "text-sky-300",
    btnBorder: "border-sky-400",
    btnHover: "hover:bg-sky-400/20",
  },
  ODIN: {
    border: "border-purple-500",
    glow: "shadow-[0_0_20px_rgba(168,85,247,0.4)]",
    textColor: "text-purple-400",
    btnBorder: "border-purple-500",
    btnHover: "hover:bg-purple-500/20",
  },
};

const GodCard = ({ god }: { god: God }) => {
  const s = GOD_STYLES[god.name] ?? GOD_STYLES.ODIN;
  return (
    <div className={`rounded-xl border ${s.border} ${s.glow} bg-black/60 overflow-hidden flex flex-col transition-all duration-300 hover:scale-[1.03] hover:brightness-110 cursor-pointer`}>
      <img src={god.image} alt={god.name} className="w-full aspect-3/4 object-cover object-center" />
      <div className="p-3 text-center flex flex-col gap-1.5">
        <h3 className={`font-black text-lg ${s.textColor}`}>{god.name}</h3>
        <p className="text-[10px] text-slate-400">
          {god.type}&nbsp;|&nbsp;
          <span className="text-white font-bold">ROI: {god.roi}</span>
          &nbsp;|&nbsp;WIN RATE: {god.winRate}
        </p>
        <p className={`text-sm italic ${s.textColor}`} style={{ fontFamily: "cursive" }}>
          Signature/{god.signature}
        </p>
        <p className="text-[10px] text-slate-500 pb-2!">Followers: {god.followers}</p>
      </div>
    </div>
  );
};

interface GodsPantheonV2Props {
  gods: God[];
}

export const GodsPantheonV2 = ({ gods }: GodsPantheonV2Props) => (
  <div className="w-full">
    <div className="text-center my-4!">
      <h2 className="text-[#d4af37] font-bold text-xl">THE GODS</h2>
      <p className="text-[#d4af37] text-xs">(THE PANTHEON)</p>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {gods.map((god) => (
        <GodCard key={god.name} god={god} />
      ))}
    </div>
  </div>
);
