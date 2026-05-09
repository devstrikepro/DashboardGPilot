"use client";

import { Box, Typography, Button } from "@mui/material";
import { AccountCircle as AccountCircleIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { SectionHeader } from "@/shared/ui";

interface AccountHeaderProps {
    readonly onRefresh: () => void;
    readonly loading: boolean;
    readonly onBack?: () => void;
}

export function AccountHeader({ onRefresh, loading, onBack }: Readonly<AccountHeaderProps>) {
    return (
        <SectionHeader
            title="My Portfolio"
            icon={<AccountCircleIcon sx={{ fontSize: 28 }} />}
            onRefresh={onRefresh}
            loading={loading}
            actions={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {onBack && (
                        <Button 
                            startIcon={<ArrowBackIcon />} 
                            onClick={onBack}
                            variant="outlined"
                            size="small"
                            sx={{ borderRadius: 2 }}
                        >
                            Change Account
                        </Button>
                    )}
                    <Typography variant="body2" sx={{ color: "text.secondary", display: { xs: 'none', sm: 'block' } }}>
                        Manage your account settings and summaries
                    </Typography>
                </Box>
            }
        />
    );
}
