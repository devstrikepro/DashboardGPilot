export interface Deal {
  readonly ticket: number;
  readonly order: number;
  readonly symbol: string;
  readonly type: 'BUY' | 'SELL' | 'BALANCE'; // เพิ่ม BALANCE สำหรับรายการฝาก/ถอน
  readonly entry: 'IN' | 'OUT' | 'REVERSE' | null;
  readonly volume: number;
  readonly price: number;
  readonly profit: number;
  readonly commission: number;
  readonly swap: number;
  readonly magic: number;
  readonly comment: string;
  readonly time: string; // ISO 8601 string (e.g., "2024-03-26T15:30:00")
}

export interface TradesHistoryResponse {
  readonly total: number;
  readonly data: readonly Deal[];
}
