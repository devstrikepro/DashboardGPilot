import React from "react";

const STEPS = [
  {
    icon: (
      <svg viewBox="0 0 100 100" fill="none" stroke="#D4AF37" strokeWidth="2">
        {/* หมวกไวกิ้งแบบย่อ */}
        <path d="M30 50 Q50 30 70 50 L70 70 Q50 80 30 70 Z" />
        <path d="M30 50 L20 30 Q30 35 35 50" />
        <path d="M70 50 L80 30 Q70 35 65 50" />
        <line x1="50" y1="40" x2="50" y2="75" />
      </svg>
    ),
    label: "1. OPEN BROKER ACCOUNT",
    sub: "(External)",
  },
  {
    icon: (
      <svg viewBox="0 0 100 100" fill="none" stroke="#D4AF37" strokeWidth="2">
        {/* บัตร ID */}
        <rect x="20" y="30" width="60" height="40" rx="3" />
        <circle cx="35" cy="45" r="7" />
        <line x1="50" y1="45" x2="70" y2="45" />
        <line x1="50" y1="55" x2="70" y2="55" />
      </svg>
    ),
    label: "2. GET INVESTOR ID",
    sub: null,
  },
  {
    icon: (
      <svg viewBox="0 0 100 100" fill="none" stroke="#D4AF37" strokeWidth="3">
        {/* หมวกไวกิ้งแบบเต็ม (เน้นความเท่) */}
        <path d="M25 55 Q50 25 75 55 L75 75 Q50 90 25 75 Z" />
        <path d="M25 55 L15 25 Q30 30 35 55" />
        <path d="M75 55 L85 25 Q70 30 65 55" />
        <path d="M40 65 L50 55 L60 65" />
        <line x1="50" y1="45" x2="50" y2="85" />
      </svg>
    ),
    label: "3. PLEDGE LOYALTY",
    sub: "(Register Here)",
  },
  {
    icon: (
      <svg viewBox="0 0 100 100" fill="none" stroke="#D4AF37" strokeWidth="2">
        {/* ลูกแก้วรางวัลพร้อมรัศมี */}
        <path d="M30 75 H70 L65 85 H35 Z" />
        <circle cx="50" cy="50" r="15" />
        <path d="M50 20 V30 M80 50 H70 M20 50 H30 M30 30 L38 38 M70 30 L62 38" />
      </svg>
    ),
    label: "4. CLAIM REWARDS",
    sub: null,
  },
];

export const HeroSectionV2 = () => (
  <div className="w-full">
    <p className="text-center text-sm font-bold tracking-[6px] text-[#d4af37] uppercase py-3">HERO &amp; RULES</p>
    <div className="relative w-full overflow-hidden">
      <img src="/ror/bg.png" alt="" className="absolute inset-0 w-full h-full object-cover object-top" />
      <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/50 to-black/80" />
      <div className="relative z-10 flex flex-col items-center justify-center px-8 py-8 gap-4 sm:px-12 sm:py-12 sm:gap-6">
        <div className="text-center">
          <p
            className="text-[#d4af37] font-bold tracking-[6px] sm:tracking-[8px] uppercase"
            style={{
              fontSize: "clamp(0.9rem, 4vw, 3rem)",
              textShadow: "0 0 40px rgba(212,175,55,0.9), 0 0 80px rgba(212,175,55,0.4)",
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Record of
          </p>
          <h1
            className="text-[#d4af37] font-black uppercase leading-none tracking-[6px] sm:tracking-[10px]"
            style={{
              fontSize: "clamp(2rem, 8vw, 5rem)",
              textShadow: "0 0 40px rgba(212,175,55,0.9), 0 0 80px rgba(212,175,55,0.4)",
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Ragnarok
          </h1>
          <p className="text-white/70 mt-1 tracking-widest text-xs sm:text-lg">Choose Your God. Witness the Battle. Claim the Glory.</p>
        </div>

        <div className="w-full max-w-2xl">
          <p className="text-center text-white font-bold text-sm sm:text-lg mb-2! sm:mb-3! tracking-wider">How to Play</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {STEPS.map((step, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-0.5 rounded-lg p-1.5! sm:p-3! border border-white/10 bg-white/5 backdrop-blur-sm hover:border-[#d4af37]/60 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <span className="w-7 h-7 sm:w-14 sm:h-14 block [&>svg]:w-full [&>svg]:h-full">{step.icon}</span>
                <span className="text-white font-semibold text-[9px] sm:text-sm text-center leading-tight">{step.label}</span>
                {step.sub && <span className="text-[#d4af37] text-[8px] sm:text-sm">{step.sub}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);
