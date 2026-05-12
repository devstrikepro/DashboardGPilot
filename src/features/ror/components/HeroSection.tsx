import React from "react";
import { Box, Typography, Grid } from "@mui/material";

const steps = [
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
        <path
          d="M20 4C16 4 10 7 10 14v4H8a2 2 0 00-2 2v12a2 2 0 002 2h24a2 2 0 002-2V20a2 2 0 00-2-2h-2v-4c0-7-4-10-8-10z"
          stroke="#d4af37"
          strokeWidth="1.5"
          fill="none"
        />
        <path d="M14 18v-4c0-4 2.5-6 6-6s6 2 6 6v4" stroke="#d4af37" strokeWidth="1.5" fill="none" />
        <circle cx="20" cy="24" r="2" fill="#d4af37" />
        <path d="M8 6h2v4H8zM30 6h2v4h-2z" fill="#d4af37" />
        <path d="M12 2l2 4M26 2l2 4M6 10l4 2M28 12l4-2" stroke="#d4af37" strokeWidth="1.2" />
      </svg>
    ),
    label: "1. OPEN BROKER ACCOUNT",
    sub: "(External)",
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
        <rect x="6" y="10" width="28" height="20" rx="3" stroke="#d4af37" strokeWidth="1.5" fill="none" />
        <circle cx="15" cy="20" r="4" stroke="#d4af37" strokeWidth="1.5" fill="none" />
        <path d="M22 17h8M22 21h6M22 25h4" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    label: "2. GET INVESTOR ID",
    sub: null,
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
        <path d="M20 4l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" stroke="#d4af37" strokeWidth="1.5" fill="none" />
        <path d="M10 22c0 6 4 12 10 14 6-2 10-8 10-14H10z" stroke="#d4af37" strokeWidth="1.5" fill="none" />
        <path d="M14 26l2 2 6-6" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: "3. PLEDGE LOYALTY",
    sub: "(Register Here)",
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
        <path d="M20 6l2 6 6 1-4.5 4 1.5 6L20 20l-5 3 1.5-6L12 13l6-1z" stroke="#d4af37" strokeWidth="1.5" fill="none" />
        <path d="M10 34h20" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14 28v6M26 28v6" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 26c0-2 2-4 4-4h16c2 0 4 2 4 4" stroke="#d4af37" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    label: "4. CLAIM REWARDS",
    sub: null,
  },
];

const StepCard: React.FC<{ icon: React.ReactNode; label: string; sub?: string | null }> = ({ icon, label, sub }) => (
  <Box
    className="bg-linear-to-bl from-white/5 from-60% to-[#d4af37bf]/20 border border-white/10 cursor-pointer hover:border-gold/75 rounded-lg p-3 flex flex-col items-center gap-1 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
    sx={{
      py: { xs: 1.5, sm: 2 },
      px: 1,
      height: "100%",
      borderRadius: "10px",
      backdropFilter: "blur(10px)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 0.75,
      transition: "all 0.25s ease",
      "&:hover": {
        borderColor: "rgba(212,175,55,0.75)",
        backgroundColor: "rgba(0,0,0,0.72)",
        transform: "translateY(-3px)",
        boxShadow: "0 6px 20px rgba(212,175,55,0.15)",
      },
    }}
  >
    {icon}
    <Typography
      variant="caption"
      sx={{
        display: "block",
        fontWeight: 700,
        lineHeight: 1.3,
        color: "#fff",
        textAlign: "center",
        fontSize: { xs: "0.65rem", sm: "0.7rem" },
      }}
    >
      {label}
    </Typography>
    {sub && (
      <Typography variant="caption" sx={{ color: "#d4af37", lineHeight: 1, fontSize: "0.65rem" }}>
        {sub}
      </Typography>
    )}
  </Box>
);

const HeroTitle: React.FC = () => (
  <Box sx={{ textAlign: "center" }}>
    <Typography
      sx={{
        color: "#d4af37",
        fontWeight: 700,
        letterSpacing: { xs: 4, sm: 6, md: 8 },
        fontSize: { xs: "0.7rem", sm: "0.85rem", md: "1rem" },
        textTransform: "uppercase",
      }}
    >
      Record of
    </Typography>
    <Typography
      sx={{
        fontSize: { xs: "2rem", sm: "2.8rem", md: "3.8rem", lg: "5rem" },
        fontWeight: 900,
        color: "#d4af37",
        letterSpacing: { xs: 3, sm: 6, md: 10 },
        lineHeight: 1,
        textShadow: "0 0 40px rgba(212,175,55,0.9), 0 0 80px rgba(212,175,55,0.4), 0 3px 12px rgba(0,0,0,0.9)",
        fontFamily: "'Playfair Display', serif",
        textTransform: "uppercase",
      }}
    >
      Ragnarok
    </Typography>
    <Typography
      sx={{
        color: "rgba(255,255,255,0.7)",
        mt: { xs: 0.5, md: 1 },
        mb: { xs: 1, md: 2 },
        fontSize: { xs: "0.65rem", sm: "0.75rem", md: "0.875rem" },
        letterSpacing: 1.5,
      }}
    >
      Choose Your God. Witness the Battle. Claim the Glory.
    </Typography>
  </Box>
);

const HowToPlay: React.FC = () => (
  <Box sx={{ width: "100%", textAlign: "center" }}>
    <Typography
      sx={{
        fontWeight: 700,
        color: "#fff",
        mb: { xs: 1, sm: 1.5 },
        fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.95rem" },
        letterSpacing: 1,
      }}
    >
      How to Play
    </Typography>
    <Grid container spacing={{ xs: 1, sm: 1.5 }} justifyContent="center" sx={{ maxWidth: 720, mx: "auto" }}>
      {steps.map((step, idx) => (
        <Grid size={{ xs: 6, sm: 3 }} key={idx}>
          <StepCard icon={step.icon} label={step.label} sub={step.sub} />
        </Grid>
      ))}
    </Grid>
  </Box>
);

export const HeroSection: React.FC = () => {
  return (
    <Box sx={{ width: "100%", mb: 6 }}>
      {/* Header */}
      <Box
        sx={{
          textAlign: "center",
          py: 1.5,
          //   backgroundColor: "rgba(1,4,9,0.85)",
          //   backdropFilter: "blur(8px)",
        }}
      >
        <Typography variant="subtitle2" sx={{ color: "#d4af37", letterSpacing: 4, fontWeight: 700, fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.875rem" } }}>
          HERO &amp; RULES
        </Typography>
      </Box>

      {/* Banner */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          width: "100%",
          aspectRatio: { xs: "4/3", sm: "16/9", md: "21/9" },
          minHeight: { xs: 220, sm: 300, md: 360 },
        }}
      >
        <Box
          component="img"
          src="/ror/bg.png"
          alt=""
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            display: "block",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            px: { xs: 3, sm: 6, md: 16, lg: 24 },
            pt: { xs: 3, sm: 4, md: 5 },
            pb: { xs: 2.5, sm: 3 },
          }}
        >
          <HeroTitle />
          <HowToPlay />
        </Box>
      </Box>
    </Box>
  );
};
