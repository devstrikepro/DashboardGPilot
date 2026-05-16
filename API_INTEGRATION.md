# 🔌 Frontend API Integration Map

This document maps out how the DashboardGpilot Frontend consumes the Backend-Sub API endpoints.

## 1. Authentication
**Service:** `src/shared/services/auth-service.ts`

| Action | Frontend Method | Backend Endpoint | Request Data | Response Format | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Login** | `AuthService.login()` | `POST /api/v1/auth/login` | `{ email, password }` | `{ success, data: { access_token, refresh_token, role, user_id, mt5_id }, message }` | Supports `role` instead of legacy `role_id`. Redirection errors are suppressed on 401. |
| **Register** | `AuthService.register()` | `POST /api/v1/auth/register` | `{ email, password, referral_code }` | StandardResponse | - |
| **Refresh** | `AuthService.refreshToken()` | `POST /api/v1/auth/refresh` | `{ refresh_token }` | `{ access_token, refresh_token }` | - |
| **Update PW** | `AuthService.updatePassword()` | `POST /api/v1/auth/password` | `{ old_password, new_password }` | StandardResponse | - |
| **Update MT5** | `AuthService.updateMT5Password()` | `POST /api/v1/auth/mt5-password`| `{ mt5_password }` | StandardResponse | - |

## 2. Account Information
**Service:** `src/shared/services/account-service.ts`
**Hooks:** `useAccountData`

| Action | Frontend Method | Backend Endpoint | Request Data | Response Format | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Get Info** | `AccountService.getInfo()` | `GET /api/v1/account/info` | None | `{ success, data: { last_update, port_list: [...] }, error }` | Includes global `last_update` timestamp and wrapped `port_list` array. |
| **Get Finance** | `AccountService.getFinance()` | `GET /api/v1/account/finance` | None | `{ success, data: { balance, total_profit_sharing, ... }, error }` | Uses `total_profit_sharing` (snake_case). |
| **Sync Account**| `AccountService.syncAccount()` | `POST /api/v1/account/sync` | None | `{ success, message, ... }` | Has a 15-minute cooldown implemented in UI to prevent spam. |

## 3. Analytics & Product Details
**Service:** `src/shared/services/analytics-service.ts`
**Hooks:** `useDashboardData`, `useProductDetailData`, `useHistoryData`

| Action | Frontend Method | Backend Endpoint | Request Data | Response Format | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Grouped Trades**| `AnalyticsService.getGroupedTrades()` | `GET /api/v1/analytics/grouped-trades` | `{ page, limit, date_from, end_date, symbol, type, order_by, order_dir }` | `[{ paginated: { list, total }, total_volume, gross_profit, gross_loss, net_profit, total_trades }]` | Fully mapped to snake_case properties in the frontend. |
| **Product Detail**| `AnalyticsService.getProductDetail()` | `GET /api/v1/analytics/product-detail` | `{ account_id }` (optional) | `{ balance, equity_curve, symbol_statistics: { list, total_trades }, win_rate, recovery_factor, max_drawdown, profit_factor, profit_today, avg_profit_week, avg_profit_month }` | Follows snake_case schema. `equity_curve` replaces `equityCurve`. |

## 4. Trade History (Direct Sync)
**Service:** `src/shared/services/trade-history-service.ts`

| Action | Frontend Method | Backend Endpoint | Request Data | Response Format | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Sync My Trades**| `TradeHistoryService.syncMyTrades()` | `POST /api/v1/trades/v3/my/sync`| None | StandardResponse | Triggers background job on backend. |
| **My History** | `TradeHistoryService.getMySyncedHistory()` | `GET /api/v1/trades/v3/my/synced`| `{ page, limit, ... }` | Paginated list of deals | - |
| **Sync Referral** | `TradeHistoryService.syncReferralTrades()`| `POST /api/v1/trades/v3/referral/sync`| `{ referral_id }` | StandardResponse | Admin/Sub-gateway route. |
| **Referral History**| `TradeHistoryService.getReferralHistory()` | `GET /api/v1/trades/v3/referral/synced`| `{ referral_id, page, limit }`| Paginated list of deals | - |

## Cooldown Implementation
Frontend incorporates a strict 15-minute refresh cooldown for data syncing operations (`AccountService.syncAccount` / `TradeHistoryService.syncMyTrades`). This uses `localStorage` to track the `last_update` timestamp and disables the refresh button visually while maintaining a countdown timer for the user.

## Type Definition Alignment
All frontend types have been refactored to perfectly mirror the Backend-Sub's `snake_case` JSON responses. Mappings include:
- `role_id` -> `role`
- `totalProfitSharing` -> `total_profit_sharing`
- `netProfit` -> `net_profit`
- `equityCurve` -> `equity_curve`
- `symbolStats` -> `symbol_statistics`
- `winrate` -> `win_rate`
- `maxdd` -> `max_drawdown`
