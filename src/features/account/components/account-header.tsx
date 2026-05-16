"use client";

import { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { AccountCircle as AccountCircleIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { SectionHeader } from "@/shared/ui";

interface AccountHeaderProps {
    readonly onRefresh: () => void;
    readonly loading: boolean;
    readonly onBack?: () => void;
    readonly lastUpdate?: string | null;
    readonly canRefresh?: boolean;
}

export function AccountHeader({ onRefresh, loading, onBack, lastUpdate, canRefresh }: Readonly<AccountHeaderProps>) {
    const [countdown, setCountdown] = useState<string | null>(null);
    const [isCooldown, setIsCooldown] = useState(false);

    useEffect(() => {
        if (!lastUpdate) return;

        const updateTimer = () => {
            const now = new Date().getTime();
            const lastTime = new Date(lastUpdate).getTime();
            const diff = 15 * 60 * 1000 - (now - lastTime);

            if (diff <= 0) {
                setCountdown(null);
                setIsCooldown(false);
                return false;
            } else {
                const minutes = Math.floor(diff / 60000);
                const seconds = Math.floor((diff % 60000) / 1000);
                setCountdown(`${minutes}:${seconds.toString().padStart(2, '0')}`);
                setIsCooldown(true);
                return true;
            }
        };

        const hasCooldown = updateTimer();
        if (hasCooldown) {
            const interval = setInterval(updateTimer, 1000);
            return () => clearInterval(interval);
        }
    }, [lastUpdate]);

    return (
        <SectionHeader
            title="My Portfolio"
            icon={<AccountCircleIcon sx={{ fontSize: 28 }} />}
            onRefresh={onRefresh}
            loading={loading}
            refreshDisabled={isCooldown}
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
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" sx={{ color: "text.secondary", display: { xs: 'none', sm: 'block' } }}>
                            Manage your account settings and summaries
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            {lastUpdate && (
                                <Typography variant="caption" sx={{ color: "text.disabled" }}>
                                    Last updated: {new Date(lastUpdate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </Typography>
                            )}
                            {isCooldown && countdown && (
                                <Typography variant="caption" sx={{ color: "warning.main", fontWeight: "bold" }}>
                                    Refresh available in: {countdown}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Box>
            }
        />
    );
}
