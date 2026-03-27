import type { Deal } from "@/shared/types/api";

/**
 * คำนวณกำไรรวมของ Deal (Profit + Commission + Swap)
 */
export const getNetProfit = (deal: Deal): number => {
  return deal.profit + (deal.commission || 0) + (deal.swap || 0);
};

/**
 * คำนวณ Equity Curve โดยเริ่มจากรายการฝากเงินครั้งแรก
 */
export const calculateEquityCurve = (deals: readonly Deal[]) => {
  // เรียงลำดับตามเวลา
  const sortedDeals = [...deals].sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
  );

  let currentEquity = 0;
  const curve = sortedDeals.map((deal) => {
    currentEquity += getNetProfit(deal);
    return {
      time: deal.time,
      equity: currentEquity,
      ticket: deal.ticket,
    };
  });

  return curve;
};

/**
 * คำนวณสถิติรายวัน (Daily Returns) สำหรับ Sharpe Ratio
 */
export const calculateDailyReturns = (deals: readonly Deal[]) => {
  if (deals.length === 0) return [];

  const sortedDeals = [...deals].sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
  );

  // Group deals by date string (YYYY-MM-DD)
  const dailyProfit: Record<string, number> = {};
  let rollingEquity = 0;
  const dailyEquity: Record<string, number> = {};

  sortedDeals.forEach((deal) => {
    const date = deal.time.split("T")[0];
    const profit = getNetProfit(deal);

    dailyProfit[date] = (dailyProfit[date] || 0) + profit;
    rollingEquity += profit;
    dailyEquity[date] = rollingEquity;
  });

  const dates = Object.keys(dailyEquity).sort();
  const returns: number[] = [];

  for (let i = 1; i < dates.length; i++) {
    const prevEquity = dailyEquity[dates[i - 1]];
    const currentProfit = dailyProfit[dates[i]];

    if (prevEquity !== 0) {
      returns.push(currentProfit / prevEquity);
    }
  }

  return returns;
};

/**
 * คำนวณ Sharpe Ratio (Daily)
 */
export const calculateSharpeRatio = (dailyReturns: number[]) => {
  if (dailyReturns.length < 2) return 0;

  const mean = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;
  const variance =
    dailyReturns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) /
    (dailyReturns.length - 1);
  const stdDev = Math.sqrt(variance);

  if (stdDev === 0) return 0;

  // Annualized Sharpe Ratio (assuming 252 trading days)
  return (mean / stdDev) * Math.sqrt(252);
};

/**
 * คำนวณ Max Drawdown
 */
export const calculateMaxDrawdown = (equityCurve: { equity: number }[]) => {
  if (equityCurve.length === 0) return 0;

  let maxEquity = -Infinity;
  let maxDD = 0;

  equityCurve.forEach((point) => {
    if (point.equity > maxEquity) {
      maxEquity = point.equity;
    }
    const dd = maxEquity - point.equity;
    if (dd > maxDD) {
      maxDD = dd;
    }
  });

  const peakEquity = Math.max(...equityCurve.map((p) => p.equity));
  return peakEquity === 0 ? 0 : (maxDD / peakEquity) * 100;
};

/**
 * คำนวณ Win Rate
 */
export const calculateWinRate = (deals: readonly Deal[]) => {
  const tradeDeals = deals.filter((d) => d.type !== "BALANCE");
  if (tradeDeals.length === 0) return 0;

  const wins = tradeDeals.filter((d) => d.profit > 0).length;
  return (wins / tradeDeals.length) * 100;
};

/**
 * จัดกลุ่มข้อมูล P/L Distribution (Histogram)
 */
export const calculatePLDistribution = (deals: readonly Deal[]) => {
  const tradeDeals = deals.filter((d) => d.type !== "BALANCE");
  if (tradeDeals.length === 0) return [];

  // Define bins (ranges)
  const ranges = [-500, -400, -300, -200, -100, 0, 100, 200, 300, 400, 500];
  const bins: Record<string, number> = {};

  // Initialize bins
  bins["<-500"] = 0;
  for (let i = 0; i < ranges.length - 1; i++) {
    bins[`${ranges[i]} to ${ranges[i + 1]}`] = 0;
  }
  bins[">500"] = 0;

  tradeDeals.forEach((deal) => {
    const p = deal.profit;
    if (p < -500) bins["<-500"]++;
    else if (p >= 500) bins[">500"]++;
    else {
      for (let i = 0; i < ranges.length - 1; i++) {
        if (p >= ranges[i] && p < ranges[i + 1]) {
          bins[`${ranges[i]} to ${ranges[i + 1]}`]++;
          break;
        }
      }
    }
  });

  return Object.entries(bins).map(([range, count]) => ({ range, count }));
};

/**
 * คำนวณ Asset Exposure
 */
export const calculateAssetExposure = (deals: readonly Deal[]) => {
  const tradeDeals = deals.filter((d) => d.type !== "BALANCE");
  const totalVolume = tradeDeals.reduce((sum, d) => sum + d.volume, 0);

  const stats: Record<
    string,
    { volume: number; profit: number; wins: number; trades: number }
  > = {};

  tradeDeals.forEach((deal) => {
    const symbol = deal.symbol || "Unknown";
    if (!stats[symbol]) {
      stats[symbol] = { volume: 0, profit: 0, wins: 0, trades: 0 };
    }
    stats[symbol].volume += deal.volume;
    stats[symbol].profit += deal.profit;
    stats[symbol].trades += 1;
    if (deal.profit > 0) stats[symbol].wins += 1;
  });

  return Object.entries(stats)
    .map(([symbol, data]) => ({
      symbol,
      exposure: totalVolume > 0 ? (data.volume / totalVolume) * 100 : 0,
      profit: data.profit,
      winRate: (data.wins / data.trades) * 100,
      direction: data.profit >= 0 ? "long" : "short", // Simplified for mock
    }))
    .sort((a, b) => b.exposure - a.exposure);
};
