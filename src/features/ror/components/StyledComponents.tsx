import { styled, alpha, Paper, Box, Button, TableRow } from "@mui/material";

export const GlassPaper = styled(Paper)(({ theme }) => ({
    background: alpha("#0a0c10", 0.7),
    backdropFilter: "blur(12px)",
    border: `1px solid ${alpha("#d4af37", 0.1)}`,
    borderRadius: "16px",
    padding: theme.spacing(3),
    color: "#fff",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.8)",
}));

export const ActionButton = styled(Button)(({ theme }) => ({
    background: "linear-gradient(135deg, #d4af37 0%, #b8860b 100%)",
    color: "#000",
    fontWeight: 700,
    padding: "10px 24px",
    borderRadius: "8px",
    textTransform: "uppercase",
    letterSpacing: "1px",
    "&:hover": {
        background: "linear-gradient(135deg, #b8860b 0%, #d4af37 100%)",
        boxShadow: "0 0 15px rgba(212, 175, 55, 0.4)",
    },
}));

export const SecondaryButton = styled(Button)(({ theme }) => ({
    border: "1px solid #d4af37",
    color: "#d4af37",
    fontWeight: 600,
    padding: "10px 24px",
    borderRadius: "8px",
    backgroundColor: alpha("#d4af37", 0.05),
    "&:hover": {
        backgroundColor: alpha("#d4af37", 0.15),
        border: "1px solid #fff",
        color: "#fff",
    },
}));

export const GodCard = styled(Box, {
    shouldForwardProp: (prop) => prop !== "glowColor",
})<{ glowColor: string }>(({ glowColor }) => ({
    position: "relative",
    borderRadius: "12px",
    padding: "2px", // Border space
    background: `linear-gradient(180deg, ${glowColor} 0%, transparent 50%, ${glowColor} 100%)`,
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
    "&:hover": {
        transform: "translateY(-8px)",
        boxShadow: `0 10px 30px ${alpha(glowColor, 0.3)}`,
    },
    "& .content": {
        backgroundColor: "#0d1117",
        borderRadius: "10px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
    },
}));

export const StatBox = styled(Box)({
    display: "flex",
    justifyContent: "space-between",
    padding: "4px 8px",
    fontSize: "0.75rem",
    textTransform: "uppercase",
    color: "#8b949e",
    "& span": {
        color: "#fff",
        fontWeight: 600,
    },
});

export const LeaderboardRow = styled(TableRow)({
    "&:nth-of-type(odd)": {
        backgroundColor: alpha("#fff", 0.02),
    },
    "& td": {
        borderBottom: `1px solid ${alpha("#fff", 0.05)}`,
        color: "#fff",
    },
});
