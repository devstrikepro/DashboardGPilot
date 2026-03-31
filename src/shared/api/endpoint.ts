/**
 * กำหนด Base Paths สำหรับ API Gateway
 */
export const API_GATEWAY_MAIN = "/api/gateway/main";
export const API_GATEWAY_SUB = "/api/gateway/sub";

/**
 * รายการ Endpoint ของ Backend-Main (MT5 Real-time)
 */
export const MAIN_ENDPOINTS = {
  /** เช็คสถานะ API และการเชื่อมต่อ MT5 */
  HEALTH: `${API_GATEWAY_MAIN}/api/v1/health`,
  /** ดึงประวัติการเทรด raw (รองรับ Filtering) */
  TRADES: `${API_GATEWAY_MAIN}/api/v1/trades`,
  /** ดึงประวัติการเทรด grouped by position (round-turn) */
  TRADES_GROUPED: `${API_GATEWAY_MAIN}/api/v1/trades/grouped`,
  /** ดึงข้อมูลบัญชี MT5 */
  ACCOUNT: `${API_GATEWAY_MAIN}/api/v1/account`,
  /** ดึง Performance Stats ทั้งหมด (Analytics page) */
  ANALYTICS_PERFORMANCE: `${API_GATEWAY_MAIN}/api/v1/analytics/performance`,
  /** ดึง Dashboard Summary (today/week/month profit, symbol stats) */
  DASHBOARD_SUMMARY: `${API_GATEWAY_MAIN}/api/v1/dashboard/summary`,
  /** ดึง Cashflow Summary (transactions, balance chart) */
  CASHFLOW_SUMMARY: `${API_GATEWAY_MAIN}/api/v1/cashflow/summary`,
} as const;

/**
 * รายการ Endpoint ของ Backend-Sub (Auth & Sync)
 */
export const SUB_ENDPOINTS = {
  /** เช็คสถานะ API และ Database */
  HEALTH: `${API_GATEWAY_SUB}/api/v1/health`,
  /** ลงทะเบียนผู้ใช้ใหม่ */
  AUTH_REGISTER: `${API_GATEWAY_SUB}/api/v1/auth/register`,
  /** เข้าสู่ระบบ */
  AUTH_LOGIN: `${API_GATEWAY_SUB}/api/v1/auth/login`,
  /** ดึงข้อมูลเทรดที่ Sync แล้ว */
  TRADES: `${API_GATEWAY_SUB}/api/v1/trades`,
} as const;

/**
 * Legacy Support (For backward compatibility)
 */
export const ENDPOINTS = MAIN_ENDPOINTS;
