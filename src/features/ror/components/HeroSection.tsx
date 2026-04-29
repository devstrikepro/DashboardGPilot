import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import CelebrationIcon from "@mui/icons-material/Celebration";
import { GlassPaper } from "./StyledComponents";

export const HeroSection: React.FC = () => {
    return (
        <Grid size={{ xs: 12, lg: 12 }} sx={{ mb: 6 }}>
            <GlassPaper
                sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                    minHeight: "450px",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        opacity: 0.15,
                        zIndex: 0,
                        background: "url('/ror/bg.png') center/cover",
                    }}
                />

                <Box sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                    <Typography variant="h6" sx={{ color: "#d4af37", letterSpacing: 4, mb: 1, fontWeight: 700 }}>
                        HERO & RULES
                    </Typography>
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 900,
                            mb: 2,
                            textShadow: "0 0 20px rgba(212, 175, 55, 0.5)",
                            fontFamily: "'Playfair Display', serif",
                        }}
                    >
                        RECORD OF <br /> RAGNAROK
                    </Typography>
                    <Typography sx={{ color: "#8b949e", maxWidth: 600, mx: "auto", mb: 4 }}>
                        Choose Your God. Witness the Battle. Claim the Glory.
                    </Typography>

                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3 }}>
                        How to Play
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 5 }}>
                        {[
                            { icon: <AccountBalanceWalletIcon />, text: "1. OPEN BROKER ACCOUNT" },
                            { icon: <FingerprintIcon />, text: "2. GET INVESTOR ID" },
                            { icon: <MilitaryTechIcon />, text: "3. PLEDGE LOYALTY" },
                            { icon: <CelebrationIcon />, text: "4. CLAIM REWARDS" },
                        ].map((step, idx) => (
                            <Grid size={{ xs: 6, sm: 3 }} key={idx}>
                                <Box
                                    sx={{
                                        p: 2,
                                        borderRadius: "12px",
                                        border: "1px solid rgba(255,255,255,0.05)",
                                        backgroundColor: "rgba(255,255,255,0.02)",
                                        height: "100%",
                                    }}
                                >
                                    <Box sx={{ color: "#d4af37", mb: 1 }}>{step.icon}</Box>
                                    <Typography
                                        variant="caption"
                                        sx={{ display: "block", fontWeight: 700, lineHeight: 1.2 }}
                                    >
                                        {step.text}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </GlassPaper>
        </Grid>
    );
};
