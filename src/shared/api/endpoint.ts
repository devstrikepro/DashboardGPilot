/**
 * Base Paths สำหรับ Microservices (Microservice Architecture)
 */
export const SERVICE_BASE_GPILOT = "/api/gateway/gpilot";
export const SERVICE_BASE_SAFEGROW = "/api/gateway/safegrow";
export const SERVICE_BASE_HQULTIMATE = "/api/gateway/hqultimate";
export const SERVICE_BASE_PPVP = "/api/gateway/ppvp";
export const SERVICE_BASE_GOLDENBOY = "/api/gateway/goldenboy";
export const SERVICE_BASE_ROR = "/api/gateway/ror";
export const SERVICE_BASE_ROR_INTERNAL = "/api/gateway/ror-internal";

/**
 * กำหนด Base Paths สำหรับ API Gateway
 */
export const API_GATEWAY_MAIN = SERVICE_BASE_GPILOT;
export const API_GATEWAY_SUB = "/api/gateway/sub";

/**
 * รายการ Endpoint ของ Backend-Main (MT5 Real-time)
 */
export const MAIN_ENDPOINTS = {
  /** เช็คสถานะ API และการเชื่อมต่อ MT5 */
  HEALTH: `/health`,
  /** ดึงประวัติการเทรด raw (รองรับ Filtering) */
  TRADES: `/trades`,
  /** ดึงประวัติการเทรด grouped by position (round-turn) */
  TRADES_GROUPED: `/history`,
  /** ดึงข้อมูลบัญชี MT5 */
  ACCOUNT: `/account`,
  /** ดึง Dashboard Summary (today/week/month profit, symbol stats) */
  DASHBOARD_SUMMARY: `/dashboard`,
  /** สรุปข้อมูลสำหรับหน้า Account (Balance, Profit, Deposits, Withdrawals) - Optimized */
  ACCOUNT_SUMMARY: `/dashboard/account`,
  /** ข้อมูลเจาะจงของแต่ละสัญลักษณ์สำหรับหน้า Detail */
  PRODUCT_DETAIL: `/product/detail`,
} as const;

/**
 * รายการ Endpoint ของ Backend-Sub (Auth & Sync) - V1 Structure
 * หมายเหตุ: apiClient จะเติม /api/v1 ให้โดยอัตโนมัติ
 */
export const SUB_ENDPOINTS = {
  /** เช็คสถานะ API และ Database */
  HEALTH: `/health`,

  // Auth Endpoints
  /** ลงทะเบียนผู้ใช้ใหม่ */
  AUTH_REGISTER: `/auth/register`,
  /** เข้าสู่ระบบ */
  AUTH_LOGIN: `/auth/login`,
  /** ขอ Refresh Access Token */
  AUTH_REFRESH: `/auth/refresh`,
  /** เปลี่ยนรหัสผ่านเว็บ */
  AUTH_UPDATE_PASSWORD: `/auth/password`,
  /** เปลี่ยนรหัสผ่าน MT5 */
  AUTH_UPDATE_MT5_PASSWORD: `/auth/mt5-password`,

  // Account Endpoints (Own Data)
  /** ดึงข้อมูลสรุปบัญชี (Balance, Server, Currency) */
  ACCOUNT_PROFILE: `/account/profile`,
  /** ดึงข้อมูลการเงินและสถิติ (Finance, Equity Curve) */
  ACCOUNT_FINANCE: `/account/finance`,
  /** ดึงข้อมูลเทรดที่ Sync แล้ว (ของตัวเอง) */
  ACCOUNT_TRADES: `/account/trades`,
  /** สั่ง Sync ข้อมูลการเทรดของตัวเอง (Manual) */
  ACCOUNT_SYNC: `/account/sync`,
  /** ดึงข้อมูลบัญชี MT5 เบื้องต้น (mt5Id, balance, netProfit, supportGroup) */
  ACCOUNT_INFO: `/account/info`,

  // Referral Endpoints (Team Data)
  /** ดึงข้อมูลเทรดที่ Sync แล้ว (ของ Referral) */
  REFERRAL_TRADES: `/referral/trades`,
  /** สั่ง Sync ข้อมูลการเทรด Referral (Manual) */
  REFERRAL_SYNC: `/referral/sync`,

  // --- Legacy Mappings (For backward compatibility) ---
  TRADES: `/account/trades`,
  TRADES_REFERRALS: `/referral/trades`,
  TRADES_SYNC_ME: `/account/sync`,
  TRADES_SYNC_REFERRALS: `/referral/sync`,
} as const;

/**
 * รายการ Endpoint ของ Record of Ragnarok (Dedicated Service)
 * อ้างอิง: B2Broker Front-Office API v2
 */
export const ROR_ENDPOINTS = {
  /** Step 1: ดึง UUID สำหรับ signin wizard */
  WIZARD: `/api/v2/my/signin/wizard`,
  /** Step 2: เข้าสู่ระบบด้วย email + password + deviceFingerprint */
  AUTH_LOGIN: `/api/v2/my/signin`,
  /** Refresh Access Token ด้วย refreshToken + deviceFingerprint */
  AUTH_REFRESH: `/api/v2/my/my/refresh`,
  /** ยืนยันรหัส 2FA Google Authenticator */
  AUTH_2FA_GOOGLE: `/api/v2/my/2fa/google`,
  /** ยืนยันรหัส 2FA SMS */
  AUTH_2FA_SMS: `/api/v2/my/2fa/sms`,
  /** ยืนยันรหัส 2FA Email */
  AUTH_2FA_EMAIL: `/api/v2/my/2fa/email`,
  /** ดึงข้อมูลบัญชีเทรด */
  ACCOUNTS: "/api/v2/my/accounts",
} as const;

/**
 * รายการ Endpoint ของ Backend-Ror (Internal Storage & Support)
 * หมายเหตุ: ใช้สำหรับเก็บข้อมูลที่ Sync มาจาก ROR
 */
export const ROR = {
  /** Login **/
  LOGIN_BE: `/api/v1/auth/login`,
  /** Refresh Token **/
  REFRESH_TOKEN_BE: `/api/v1/auth/refreshtoken`,
  /** เช็คสถานะ API และ Database */
  HEALTH: `/api/v1/health`,
  /** ดึงสถิติรายพอร์ต (Winrate, Profit, Balance) */
  PORT_GODS: `/api/v1/ports/gods`,
  /** บันทึกข้อมูล Support ใหม่ */
  SUPPORT_ADD: `/api/v1/support`,
  /** ดึงข้อมูล Support Info รายพอร์ต */
  SUPPORT_INFO: `/api/v1/support/info`,
} as const;

/**
 * Legacy Support (For backward compatibility)
 */
export const ENDPOINTS = MAIN_ENDPOINTS;
