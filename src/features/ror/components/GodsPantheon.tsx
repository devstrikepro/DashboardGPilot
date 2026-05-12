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

interface GodsPantheonProps {
  gods: God[];
  onSelectGod?: (godName: string) => void;
}

export const GodsPantheon: React.FC<GodsPantheonProps> = ({ gods, onSelectGod }) => {
  return (
    <Grid size={{ xs: 12, lg: 12 }}>
      <Box mb={2} className="text-center">
        <Typography variant="h6" sx={{ color: "#d4af37", textAlign: "center", fontWeight: 700 }}>
          THE GODS
        </Typography>
        <Typography component="span" sx={{ color: "#d4af37", fontSize: "0.8rem" }}>
          (THE PANTHEON)
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
                  <Typography variant="h6" sx={{ fontWeight: 900, color: god.color, fontSize: "1.1rem" }}>
                    {god.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "#8b949e", fontSize: "0.6rem", display: "block", my: 0.5 }}
                  >
                    {god.type}&nbsp;|&nbsp;
                    <Box component="span" sx={{ color: "#fff", fontWeight: 700 }}>
                      ROI: {god.roi}
                    </Box>
                    &nbsp;|&nbsp;WIN RATE: {god.winRate}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontStyle: "italic",
                      fontFamily: "cursive",
                      color: god.color,
                      display: "block",
                      mb: 1.5,
                      fontSize: "0.85rem",
                    }}
                  >
                    Signature/{god.signature}
                  </Typography>
                  <Box
                    onClick={() => onSelectGod?.(god.name)}
                    sx={{
                      width: "100%",
                      py: 0.75,
                      px: 1,
                      borderRadius: 1,
                      backgroundColor: "transparent",
                      border: `1px solid ${god.color}`,
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                      "&:hover": {
                        backgroundColor: alpha(god.color, 0.15),
                      },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: god.color, fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.05em" }}
                    >
                      PLEDGE TO {god.name}
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
