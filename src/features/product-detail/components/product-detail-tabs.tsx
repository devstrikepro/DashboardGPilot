import { Box, Tabs, Tab } from "@mui/material";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import HistoryIcon from "@mui/icons-material/History";

interface ProductDetailTabsProps {
    activeTab: number;
    onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export function ProductDetailTabs({ activeTab, onChange }: ProductDetailTabsProps) {
    return (
        <Box
            sx={{
                borderBottom: 1,
                borderColor: "divider",
                mb: 3,
            }}
        >
            <Tabs
                value={activeTab}
                onChange={onChange}
                sx={{
                    "& .MuiTab-root": {
                        textTransform: "none",
                        fontWeight: 500,
                        fontSize: "0.875rem",
                        minHeight: 44,
                        gap: 0.5,
                    },
                    "& .Mui-selected": {
                        fontWeight: 700,
                    },
                }}
            >
                <Tab
                    id="tab-overview"
                    aria-controls="tabpanel-overview"
                    icon={<ShowChartIcon sx={{ fontSize: 18 }} />}
                    iconPosition="start"
                    label="Overview"
                />
                <Tab
                    id="tab-history"
                    aria-controls="tabpanel-history"
                    icon={<HistoryIcon sx={{ fontSize: 18 }} />}
                    iconPosition="start"
                    label="Trade History"
                />
            </Tabs>
        </Box>
    );
}
