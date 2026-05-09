"use client";

import { Box, Grid, Card, CardContent, Typography, Avatar, CardActionArea, Skeleton } from "@mui/material";
import { Person as PersonIcon, AccountBalanceWallet as WalletIcon, ArrowForward as ArrowForwardIcon } from "@mui/icons-material";
import type { AccountInfo } from "@/shared/types/api";

interface PortSelectionProps {
    readonly ports: AccountInfo[];
    readonly onSelect: (index: number) => void;
    readonly loading: boolean;
}

export function PortSelection({ ports, onSelect, loading }: Readonly<PortSelectionProps>) {
    if (loading && ports.length === 0) {
        return (
            <Grid container spacing={3}>
                {[1, 2, 3].map((i) => (
                    <Grid key={i} size={{ xs: 12, md: 4 }}>
                        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 4 }} />
                    </Grid>
                ))}
            </Grid>
        );
    }

    return (
        <Box sx={{ py: 4 }}>
            <Typography variant="h5" sx={{ mb: 4, fontWeight: 700, textAlign: 'left' }}>
                Select an Account to View Portfolio
            </Typography>
            <Grid container spacing={3} justifyContent="flex-start">
                {ports.map((port, index) => (
                    <Grid key={port.mt5Id} size={{ xs: 12, md: 4 }}>
                        <Card 
                            sx={{ 
                                borderRadius: 4, 
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: (theme) => theme.shadows[10],
                                    '& .arrow-icon': {
                                        transform: 'translateX(4px)',
                                        opacity: 1,
                                    }
                                }
                            }}
                        >
                            <CardActionArea onClick={() => onSelect(index)} sx={{ p: 1 }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                        <Avatar 
                                            sx={{ 
                                                width: 56, 
                                                height: 56, 
                                                bgcolor: 'primary.main',
                                                boxShadow: '0 4px 12px rgba(34, 211, 238, 0.4)'
                                            }}
                                        >
                                            <PersonIcon sx={{ fontSize: 32 }} />
                                        </Avatar>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                                                {port.mt5Id}
                                            </Typography>
                                        </Box>
                                        <ArrowForwardIcon 
                                            className="arrow-icon"
                                            sx={{ 
                                                opacity: 0.5, 
                                                transition: 'all 0.3s ease',
                                                color: 'primary.main' 
                                            }} 
                                        />
                                    </Box>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Supported Group</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                                {port.supportGroup}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Net Profit</Typography>
                                            <Typography variant="body2" sx={{ 
                                                fontWeight: 600, 
                                                color: port.netProfit >= 0 ? 'success.main' : 'error.main' 
                                            }}>
                                                {new Intl.NumberFormat("en-US", {
                                                    style: "currency",
                                                    currency: "USD",
                                                }).format(port.netProfit)}
                                            </Typography>
                                        </Box>
                                        <Box 
                                            sx={{ 
                                                mt: 1, 
                                                p: 2, 
                                                bgcolor: 'rgba(34, 211, 238, 0.08)', 
                                                borderRadius: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between'
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <WalletIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>Balance</Typography>
                                            </Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main' }}>
                                                {new Intl.NumberFormat("en-US", {
                                                    style: "currency",
                                                    currency: "USD",
                                                }).format(port.balance)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
