import React from "react";
import {
    Box,
    Typography,
    Grid,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Avatar,
    alpha,
} from "@mui/material";
import { GlassPaper, LeaderboardRow } from "./StyledComponents";

interface RankingRow {
    rank: number;
    god: string;
    roi: number;
    winRate: number;
    followers: number;
    color: string;
    avatar: string;
}

interface ValhallaBoardProps {
    rankingData: RankingRow[];
}

export const ValhallaBoard: React.FC<ValhallaBoardProps> = ({ rankingData }) => {
    return (
        <Grid size={{ xs: 12, md: 8 }}>
            <Box textAlign="center" mb={2}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    VALHALLA BOARD
                </Typography>
                <Typography variant="caption" sx={{ color: "#8b949e" }}>
                    (LEADERBOARD)
                </Typography>
            </Box>
            <GlassPaper sx={{ p: 0, height: "400px", overflow: "hidden" }}>
                <Box
                    sx={{
                        p: 2,
                        borderBottom: `1px solid ${alpha("#d4af37", 0.2)}`,
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        LIVE RANKING
                    </Typography>
                </Box>
                <TableContainer sx={{ height: "calc(100% - 60px)" }}>
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow
                                sx={{
                                    "& th": {
                                        backgroundColor: "#0d1117",
                                        color: "#8b949e",
                                        borderBottom: `1px solid ${alpha("#fff", 0.1)}`,
                                        fontSize: "0.7rem",
                                        fontWeight: 700,
                                    },
                                }}
                            >
                                <TableCell>Rank</TableCell>
                                <TableCell>God</TableCell>
                                <TableCell align="right">ROI %</TableCell>
                                <TableCell align="right">Win Rate %</TableCell>
                                <TableCell align="right">Followers</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rankingData.map((row, idx) => (
                                <LeaderboardRow
                                    key={idx}
                                    sx={
                                        row.rank === 1
                                            ? { backgroundColor: alpha("#d4af37", 0.1) }
                                            : {}
                                    }
                                >
                                    <TableCell
                                        sx={{
                                            fontWeight: 800,
                                            color: row.rank === 1 ? "#d4af37" : "#fff",
                                        }}
                                    >
                                        #{row.rank}
                                    </TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Avatar
                                                src={row.avatar}
                                                sx={{
                                                    width: 24,
                                                    height: 24,
                                                    border: `1px solid ${row.color}`,
                                                }}
                                            />
                                            <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                                {row.god}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        sx={{
                                            fontWeight: 800,
                                            color:
                                                row.rank === 1
                                                    ? "#d4af37"
                                                    : row.roi > 300
                                                      ? "#22c55e"
                                                      : "#fff",
                                        }}
                                    >
                                        {row.roi}
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        sx={{ color: row.winRate > 60 ? "#22c55e" : "#fff" }}
                                    >
                                        {row.winRate}%
                                    </TableCell>
                                    <TableCell align="right">{row.followers}</TableCell>
                                </LeaderboardRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </GlassPaper>
        </Grid>
    );
};
