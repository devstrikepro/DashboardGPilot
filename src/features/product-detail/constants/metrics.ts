import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PercentIcon from "@mui/icons-material/Percent";

export const getMetricsData = (
    balance: number,
    profitToday: number,
    profitWeek: number,
    profitMonth: number,
    formatCurrency: (val: number) => string
) => [
        {
            title: "Balance",
            value: formatCurrency(balance),
            change: "Current balance",
            changeType: "neutral" as const,
            icon: AccountBalanceWalletIcon,
            iconColor: "#22D3EE",
        },
        {
            title: "Profit TODAY",
            value: formatCurrency(profitToday),
            change: "Daily performance",
            changeType: profitToday >= 0 ? ("positive" as const) : ("negative" as const),
            icon: TrendingUpIcon,
            iconColor: "#10B981",
        },
        {
            title: "AVG Profit WEEK",
            value: formatCurrency(profitWeek),
            change: "Weekly average",
            changeType: profitWeek >= 0 ? ("positive" as const) : ("negative" as const),
            icon: AttachMoneyIcon,
            iconColor: "#10B981",
        },
        {
            title: "AVG Profit MONTH",
            value: formatCurrency(profitMonth),
            change: "Monthly average",
            changeType: profitMonth >= 0 ? ("positive" as const) : ("negative" as const),
            icon: PercentIcon,
            iconColor: "#22D3EE",
        },
    ];
