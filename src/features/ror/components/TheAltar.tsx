import React from "react";
import {
    Box,
    Typography,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Avatar,
    alpha,
} from "@mui/material";
import { GlassPaper, ActionButton } from "./StyledComponents";

interface God {
    name: string;
    image: string;
    color: string;
}

interface TheAltarProps {
    pledgeData: {
        investorId: string;
        god: string;
    };
    onPledgeChange: (field: string, value: string) => void;
    gods: God[];
    accounts: any[];
}

export const TheAltar: React.FC<TheAltarProps> = ({ pledgeData, onPledgeChange, gods, accounts }) => {
    return (
        <Grid size={{ xs: 12, md: 4 }}>
            <Box textAlign="center" mb={2}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    THE ALTAR
                </Typography>
                <Typography variant="caption" sx={{ color: "#8b949e" }}>
                    (PLEDGE)
                </Typography>
            </Box>
            <GlassPaper
                sx={{
                    p: 4,
                    height: "400px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}
            >
                <Typography variant="h5" sx={{ textAlign: "center", fontWeight: 800, mb: 4, color: "#d4af37" }}>
                    PLEDGE YOUR <br /> LOYALTY
                </Typography>

                <FormControl fullWidth variant="filled" sx={{ mb: 2, backgroundColor: alpha("#fff", 0.05) }}>
                    <InputLabel sx={{ color: "#8b949e" }}>Select God</InputLabel>
                    <Select
                        value={pledgeData.god}
                        onChange={(e) => onPledgeChange("god", e.target.value as string)}
                        sx={{
                            color: "#fff",
                            "& .MuiSelect-select": {
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                            },
                        }}
                        renderValue={(selected) => {
                            const god = gods.find((g) => g.name === selected);
                            return (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                    {god && (
                                        <Avatar
                                            src={god.image}
                                            sx={{
                                                width: 24,
                                                height: 24,
                                                border: `1px solid ${god.color}`,
                                            }}
                                        />
                                    )}
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                        {selected}
                                    </Typography>
                                </Box>
                            );
                        }}
                    >
                        {gods.map((g) => (
                            <MenuItem
                                key={g.name}
                                value={g.name}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                    py: 1.5,
                                }}
                            >
                                <Avatar
                                    src={g.image}
                                    sx={{
                                        width: 24,
                                        height: 24,
                                        border: `1px solid ${g.color}`,
                                    }}
                                />
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                    {g.name}
                                </Typography>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl 
                    fullWidth 
                    variant="filled" 
                    sx={{ mb: 3, backgroundColor: alpha("#fff", 0.05) }}
                    disabled={!pledgeData.god}
                >
                    <InputLabel sx={{ color: "#8b949e" }}>
                        {pledgeData.god ? "Enter Investor Account ID" : "Select God First"}
                    </InputLabel>
                    <Select
                        value={pledgeData.investorId}
                        onChange={(e) => onPledgeChange("investorId", e.target.value as string)}
                        sx={{
                            color: "#fff",
                        }}
                    >
                        {accounts.length > 0 ? (
                            accounts.map((acc) => (
                                <MenuItem key={acc.accountId} value={acc.caption}>
                                    {acc.caption} (Balance: ${parseFloat(acc.statement?.currentBalance).toFixed(2)})
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled value="">
                                {pledgeData.god ? "No eligible accounts found" : "Please select a God"}
                            </MenuItem>
                        )}
                    </Select>
                </FormControl>

                <ActionButton fullWidth variant="contained" sx={{ py: 1.5 }}>
                    PLEDGE NOW (LOCK CHOICE)
                </ActionButton>

                <Typography variant="caption" sx={{ mt: 2, textAlign: "center", color: "#8b949e", display: "block" }}>
                    Validation elements of your validation
                </Typography>
            </GlassPaper>
        </Grid>
    );
};
