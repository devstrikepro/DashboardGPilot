import React from "react";
import { Box, Typography, Grid, alpha } from "@mui/material";
import { GodCard } from "./StyledComponents";

interface God {
    name: string;
    type: string;
    roi: string;
    winRate: string;
    signature: string;
    color: string;
    image: string;
}

interface RankingEntry {
    god: string;
    followers: number;
}

interface GodsPantheonProps {
    gods: God[];
    rankingData: RankingEntry[];
}

export const GodsPantheon: React.FC<GodsPantheonProps> = ({ gods, rankingData }) => {
    return (
        <Grid size={{ xs: 12, lg: 12 }}>
            <Box mb={2}>
                <Typography variant="h6" sx={{ textAlign: "center", fontWeight: 700 }}>
                    THE GODS{" "}
                    <Typography component="span" sx={{ color: "#8b949e", fontSize: "0.8rem" }}>
                        (THE PANTHEON)
                    </Typography>
                </Typography>
            </Box>
            <Grid container spacing={2}>
                {gods.map((god) => (
                    <Grid size={{ xs: 6, sm: 3, lg: 3 }} key={god.name}>
                        <GodCard glowColor={god.color}>
                            <Box className="content">
                                <Box
                                    sx={{
                                        aspectRatio: "3/4",
                                        width: "100%",
                                        backgroundImage: `url(${god.image})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
                                />
                                <Box sx={{ p: 1.5, textAlign: "center" }}>
                                    <Typography
                                        variant="h6"
                                        sx={{ fontWeight: 900, color: god.color, fontSize: "1.1rem" }}
                                    >
                                        {god.name}
                                    </Typography>
                                    <Box sx={{ display: "flex", justifyContent: "center", gap: 1, my: 0.5 }}>
                                        <Typography variant="caption" sx={{ color: "#8b949e", fontSize: "0.6rem" }}>
                                            {god.type}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: "#8b949e", fontSize: "0.6rem" }}>
                                            |
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{ color: "#fff", fontSize: "0.6rem", fontWeight: 700 }}
                                        >
                                            ROI: {god.roi}
                                        </Typography>
                                    </Box>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontStyle: "italic",
                                            color: god.color,
                                            display: "block",
                                            mb: 1.5,
                                        }}
                                    >
                                        Signature {god.signature}
                                    </Typography>
                                    <Box
                                        sx={{
                                            width: "100%",
                                            py: 0.75,
                                            px: 1,
                                            borderRadius: 1,
                                            backgroundColor: alpha(god.color, 0.08),
                                            border: `1px solid ${alpha(god.color, 0.3)}`,
                                            textAlign: "center",
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            sx={{ color: god.color, fontWeight: 700, fontSize: "0.7rem" }}
                                        >
                                            ผู้บูชา{" "}
                                            {rankingData.find(
                                                (r) => r.god.toUpperCase() === god.name.toUpperCase()
                                            )?.followers ?? 0}{" "}
                                            คน
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </GodCard>
                    </Grid>
                ))}
            </Grid>
        </Grid>
    );
};
