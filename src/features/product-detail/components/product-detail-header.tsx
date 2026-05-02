import { Box, Typography, Chip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalMallIcon from "@mui/icons-material/LocalMall";

interface ProductDetailHeaderProps {
    productName: string;
    onBack: () => void;
}

export function ProductDetailHeader({ productName, onBack }: ProductDetailHeaderProps) {
    return (
        <>
            {/* Breadcrumb */}
            <Chip
                icon={<ArrowBackIcon sx={{ fontSize: "16px !important" }} />}
                label="Dashboard"
                size="small"
                onClick={onBack}
                sx={{
                    mb: 1.5,
                    cursor: "pointer",
                    fontWeight: 500,
                    color: "text.secondary",
                    bgcolor: "transparent",
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    "&:hover": { bgcolor: "action.hover" },
                }}
            />

            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
                <Box
                    sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        bgcolor: (theme) =>
                            theme.palette.mode === "dark"
                                ? "rgba(34, 211, 238, 0.15)"
                                : "rgba(8, 145, 178, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    <LocalMallIcon sx={{ color: "primary.main", fontSize: 20 }} />
                </Box>
                <Box>
                    <Typography
                        variant="h5"
                        sx={{
                            fontFamily: '"Manrope", sans-serif',
                            fontWeight: 700,
                            color: "text.primary",
                            fontSize: { xs: "1.25rem", lg: "1.5rem" },
                            lineHeight: 1.2,
                        }}
                    >
                        {productName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        Product Detail
                    </Typography>
                </Box>
            </Box>
        </>
    );
}
