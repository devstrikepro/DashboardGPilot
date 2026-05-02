import { Box, Typography, Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

interface AccountHeaderProps {
    onRefresh: () => void;
    loading: boolean;
}

export function AccountHeader({ onRefresh, loading }: AccountHeaderProps) {
    return (
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                    Account & Profile
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Manage your MT5 account settings and view financial summaries
                </Typography>
            </Box>
            <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={onRefresh}
                disabled={loading}
                sx={{ borderRadius: 2 }}
            >
                Refresh
            </Button>
        </Box>
    );
}
