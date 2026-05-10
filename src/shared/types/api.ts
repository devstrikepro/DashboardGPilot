// ---------------------------------------------
// Core Service Types (Global Rules #10)
// ---------------------------------------------

/**
 * โครงสร้าง Error แบบละเอียด (ตามมาตรฐาน AntiGravity)
 */
export interface ErrorDetail {
  code: string;
  message: string;
  details?: Record<string, any>[] | null;
}

/**
 * มาตรฐานการตอบกลับจาก Backend
 * @template T ประเภทของข้อมูลที่อยู่ในฟิลด์ data
 */
export interface ServiceResponse<T> {
  readonly success: boolean;
  readonly data: T | null;
  readonly error: ErrorDetail | null;
  readonly meta?: {
    total: number;
    page?: number;
    limit?: number;
    totalPage?:number;
  } | null;
}


/**
 * Interface สำหรับการ Check Health ของ API
 */
export interface HealthResponse {
  readonly success: boolean;
  readonly data: {
    readonly status?: string;    // สำหรับ Main Backend
    readonly api?: string;       // สำหรับ Backend-Sub
    readonly database?: string;  // สำหรับ Backend-Sub
  };
  readonly error: ErrorDetail | string | null;
}

/**
 * Filter สำหรับการดึงข้อมูล Trades
 * รองรับทั้ง Backend-Main (Standard & Grouped)
 */
export interface TradeRequest {
  from_date?: string | null;  // สำหรับ API ทั่วไป
  to_date?: string | null;    // สำหรับ API ทั่วไป
  date_from?: string | null;  // สำหรับ /trades/grouped (Backend Alias)
  end_date?: string | null;   // สำหรับ /trades/grouped (Backend Alias)
  symbol?: string | null;
  type?: string | null;
  entry?: string | null;
  comment?: string | null;
  pageNumber?: number;
  pageSize?: number;
  page?: number;     // Pagination Alias
  limit?: number;    // Pagination Alias
  order_by?: string | null;   // Sorting
  order_dir?: 'ASC' | 'DESC'; // Sorting
  mt5Id?: number;             // สำหรับระบุพอร์ต
}

// ---------------------------------------------
// Analytics / Performance Types
// ---------------------------------------------

export interface EquityPoint {
  readonly time: string;    // ISO 8601
  readonly equity: number;
  readonly ticket: number;
}

export interface PerformanceStats {
  readonly total_trades: number;
  readonly wins: number;
  readonly losses: number;
  readonly win_rate: number;
  readonly risk_reward_ratio: number;
  readonly avg_win: number;
  readonly avg_loss: number;
  readonly profit_factor: number;
  readonly gross_profit: number;
  readonly gross_loss: number;
  readonly total_volume: number;
  readonly net_profit: number;
  readonly fee: number;
  readonly sharpe_ratio: number;
  readonly max_drawdown_pct: number;
  readonly max_drawdown_amount: number;
  readonly recovery_factor: number;
  readonly health_score: number;
  readonly equity_curve: readonly EquityPoint[];
}

// ---------------------------------------------
// Product Detail Types
// ---------------------------------------------

export interface SymbolStat {
  readonly symbol: string;
  readonly trades: number;
  readonly profit: number;
  readonly win_rate: number;
}

export interface ProductDetailRecentTransaction {
  readonly type: string;
  readonly amount: number;
  readonly datetime: string;
  readonly symbol?: string | null;
}

export interface DashboardSummary {
  readonly drawdown: number;
  readonly avg_profit_month: number;
}

export interface ProductDetail {
  readonly balance: number;
  readonly profit_today: number;
  readonly avg_profit_week: number;
  readonly avg_profit_month: number;
  readonly win_rate: number;
  readonly recovery_factor: number;
  readonly max_drawdown: number;
  readonly profit_factor: number;
  readonly equity_curve: readonly EquityPoint[];
  readonly symbol_statistics: {
    readonly total_trades: number;
    readonly list: readonly SymbolStat[];
  };
}


// ---------------------------------------------
// Cashflow Types
// ---------------------------------------------

export interface CashflowTransaction {
  readonly type: string;
  readonly date: string;
  readonly amount: number;
  readonly comment?: string | null;
  readonly status?: string | null;
}

export interface CashflowSummary {
  readonly totalWithdrawal: number;
  readonly totalDeposit: number;
  readonly countWithdrawal: number;
  readonly countDeposit: number;
  readonly largestWithdrawal: number;
  readonly largestDeposit: number;
  readonly todayDeposit: number;
  readonly todayWithdrawal: number;
  readonly todayProfitSharing: number;
  readonly totalTransactions: number;
  readonly transactions: readonly CashflowTransaction[];
}

export interface AccountSummary {
  readonly balance: number;

  // Profile Data
  readonly name: string;
  readonly login: number;
  readonly server: string;
  readonly leverage: number;
  readonly currency: string;
  
  readonly gross_trade_profit: number;
  readonly total_deposits: number;
  readonly total_withdrawals: number;
  readonly total_profit_sharing: number;
  readonly net_profit: number;
}

/**
 * ข้อมูลสรุปรายพอร์ต (จาก Backend-Sub /account/profile)
 */
export interface AccountProfile {
  readonly mt5Id: number;
  readonly name: string;
  readonly server: string;
  readonly currency: string;
  readonly balance: number;
  readonly leverage: number;
  readonly updatedAt: string;
}

/**
 * ข้อมูลสถิติและการเงินภาพรวม (จาก Backend-Sub /account/finance)
 */
export interface AccountFinance {
  readonly mt5Id?: number;
  readonly user_id: string;
  readonly grossTradeProfit: number;
  readonly totalDeposits: number;
  readonly totalWithdrawals: number;
  readonly totalProfitSharing: number;
  readonly netProfit: number;
  readonly totalBalance: number;
  readonly totalTrades: number;
  readonly equityCurve: EquityPoint[];
  readonly updated_at: string;
}

/**
 * ข้อมูลบัญชี MT5 เบื้องต้น (จาก Backend-Sub /account/info)
 */
export interface AccountInfo {
  readonly mt5Id: number;
  readonly balance: number;
  readonly netProfit: number;
  readonly supportGroup: string;
}

// ---------------------------------------------
// Grouped Deal (Round-Turn Position)
// ---------------------------------------------

/**
 * ข้อมูล Trade รายการย่อย (ตาม Backend-Sub GroupedDeal schema v3)
 * - Required: time, type, netProfit, balance (Backend-Sub /account/trades)
 * - Optional: fields เพิ่มเติมสำหรับ full variant (Backend-Main /history)
 */
export interface GroupedDeal {
  readonly time: string;
  readonly type: string;
  readonly net_profit: number;
  readonly balance: number;
  // Optional fields — Backend-Main full trade data only
  readonly ticket?: number;
  readonly position_id?: number;
  readonly symbol?: string;
  readonly entry?: string | null;
  readonly volume?: number;
  readonly open_price?: number;
  readonly close_price?: number;
  readonly profit?: number;
  readonly commission?: number;
  readonly swap?: number;
  readonly fee?: number;
  readonly reason?: string;
  readonly comment?: string;
  readonly open_time?: string;
  readonly close_time?: string;
}

/**
 * โครงสร้าง Response สำหรับรายการเทรดแบบกลุ่ม (พร้อมสถิติสรุป)
 */
export interface GroupedTradesPage {
  readonly page_trades: number;
  readonly page_volume: number;
  readonly page_gross_profit: number;
  readonly page_gross_loss: number;
  readonly page_net_profit: number;
  readonly page_fee: number;
  readonly list: GroupedDeal[];
}

export interface GroupedTradesResponse {
  readonly mt5Id?: number;
  readonly total_trades: number;
  readonly total_volume: number;
  readonly gross_profit: number;
  readonly gross_loss: number;
  readonly net_profit: number;
  readonly fee: number;
  readonly paginated: GroupedTradesPage;
}

// ---------------------------------------------
// Referral Sync Types
// ---------------------------------------------

export interface ReferralSyncSummary {
  readonly successCount: number;
  readonly failedUsers: { email: string; error: string }[];
}

export interface ReferralSyncRequest {
  readonly from_date?: string;
  readonly to_date?: string;
}

/**
 * ผลลัพธ์การ Sync รายพอร์ต (Backend-Sub /account/sync)
 */
export interface SyncResult {
  readonly mt5Id: number;
  readonly syncedCount: number;
  readonly success: boolean;
  readonly message?: string | null;
}

// ---------------------------------------------
// Re-export Domain Models
// ---------------------------------------------
export * from './domain';

