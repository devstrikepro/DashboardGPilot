import React from "react";
import { Box, Typography, alpha } from "@mui/material";

export const FooterSection: React.FC = () => {
    return (
        <Box
            sx={{
                mt: 8,
                pt: 4,
                borderTop: `1px solid ${alpha("#fff", 0.05)}`,
                display: "flex",
                justifyContent: "space-between",
                color: "#8b949e",
            }}
        >
            <Typography variant="caption">Terms & Conditions</Typography>
            <Typography variant="caption">Broker Website</Typography>
            <Typography variant="caption">Contact Info</Typography>
        </Box>
    );
};
