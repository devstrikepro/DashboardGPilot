export interface Deal {
  readonly ticket: number;
  readonly order: number;
  readonly position_id: number;
  readonly symbol: string;
  readonly type: 'BUY' | 'SELL' | 'BALANCE' | (string & {}); // BALANCE สำหรับรายการฝาก/ถอน — (string & {}) รองรับ type ที่ไม่ได้กำหนดไว้ล่วงหน้า
  readonly entry: 'IN' | 'OUT' | 'INOUT' | 'OUT_BY' | null;
  readonly volume: number;
  readonly price: number;
  readonly profit: number;
  readonly commission: number;
  readonly swap: number;
  readonly fee: number;
  readonly net_profit: number;
  readonly magic: number;
  readonly reason: string;
  readonly comment: string;
  readonly price_sl: number | null;
  readonly price_tp: number | null;
  readonly time: string; // ISO 8601 string (e.g., "2024-03-26T15:30:00")
  readonly time_msc: number;
}

/**
 * รายการเทรดที่ Sync มาจาก Backend-Sub
 */
export interface SyncedTrade extends Deal {
  readonly user_id: string;
  readonly user_email?: string | null;
  readonly ref_id: string;
  readonly mt_id: number; // In Backend-Sub TradeDeal, it's mt_id
  readonly account_currency: string;
  readonly is_referral_data: boolean;
  readonly source_ref_id?: string | null;
}
