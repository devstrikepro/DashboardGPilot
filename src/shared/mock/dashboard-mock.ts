import { ProductDetail } from "../types/api";

export const MOCK_PRODUCT_DETAIL: ProductDetail = {
  balance: 10000,
  profit_today: 150.25,
  avg_profit_week: 750.50,
  avg_profit_month: 2500.00,
  win_rate: 65,
  recovery_factor: 3.2,
  max_drawdown: 12.5,
  profit_factor: 1.85,
  equity_curve: Array.from({ length: 30 }, (_, i) => ({
    time: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toISOString(),
    equity: 9000 + Math.random() * 2000,
    ticket: i,
  })),
  symbol_statistics: {
    total_trades: 120,
    list: [
      { symbol: "XAUUSD", trades: 50, profit: 1200, win_rate: 70 },
      { symbol: "EURUSD", trades: 40, profit: 800, win_rate: 65 },
      { symbol: "GBPUSD", trades: 30, profit: 500, win_rate: 60 },
    ],
  },
};
