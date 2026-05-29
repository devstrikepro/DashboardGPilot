import type { AdminWithdrawal } from "@/shared/services/admin-service";

export const MOCK_WITHDRAWALS: Record<string, AdminWithdrawal[]> = {
  pending: [
    { id: "WD-0001AA", user_id: "GP-A1B2C3", name: "Pornchai Wijit",      user_port: 2121000001, user_email: "pornchai.wijit@gmail.com",    product_name: "Gpilot", product_port: 2121978453, amount: 2000,  status: "pending", note: "",                   requested_at: "2026-04-15T08:30:00.000000", reviewed_at: null,                          reviewed_by: null              },
    { id: "WD-0002BB", user_id: "GP-D4E5F6", name: "Sukanya Kaewkla",     user_port: 2121000002, user_email: "sukanya.kaewkla@gmail.com",   product_name: "Gpilot", product_port: 2121978453, amount: 2000,  status: "pending", note: "",                   requested_at: "2026-04-15T09:10:00.000000", reviewed_at: null,                          reviewed_by: null              },
    { id: "WD-0003CC", user_id: "GP-G7H8I9", name: "Teerachai Pond",      user_port: 2121000003, user_email: "teerachai.pond@hotmail.com",  product_name: "Gpilot", product_port: 2121978453, amount: 500,   status: "pending", note: "urgent withdrawal",   requested_at: "2026-05-01T14:22:00.000000", reviewed_at: null,                          reviewed_by: null              },
    { id: "WD-0004DD", user_id: "GP-J0K1L2", name: "Nisa Moonlight",      user_port: 2121000004, user_email: "nisa.moonlight@gmail.com",    product_name: "Gpilot", product_port: 2121978453, amount: 10000, status: "pending", note: "withdraw all balance", requested_at: "2026-05-20T11:05:00.000000", reviewed_at: null,                          reviewed_by: null              },
  ],
  approved: [
    { id: "WD-1001AA", user_id: "GP-A1B2C3", name: "Pornchai Wijit",      user_port: 2121000001, user_email: "pornchai.wijit@gmail.com",    product_name: "Gpilot", product_port: 2121978453, amount: 1500,  status: "approved", note: "",                  requested_at: "2026-03-10T10:00:00.000000", reviewed_at: "2026-03-10T10:30:00.000000", reviewed_by: "GP-Admin-GPILOT" },
    { id: "WD-1002BB", user_id: "GP-M3N4O5", name: "Wanchai Dee",         user_port: 2121000005, user_email: "wanchai.dee@gmail.com",        product_name: "Gpilot", product_port: 2121978453, amount: 300,   status: "approved", note: "monthly withdraw",   requested_at: "2026-04-02T08:00:00.000000", reviewed_at: "2026-04-02T09:15:00.000000", reviewed_by: "GP-Admin-GPILOT" },
    { id: "WD-1003CC", user_id: "GP-P6Q7R8", name: "Malee Pimchanok",     user_port: 2121000006, user_email: "malee.pimchanok@yahoo.com",   product_name: "Gpilot", product_port: 2121978453, amount: 7500,  status: "approved", note: "",                  requested_at: "2026-05-05T13:45:00.000000", reviewed_at: "2026-05-05T14:00:00.000000", reviewed_by: "GP-Admin-GPILOT" },
  ],
  rejected: [
    { id: "WD-4354Y2", user_id: "GP-A5I9ZA", name: "Suwijak Suppapit",    user_port: 2121982589, user_email: "mike.suppapit@gmail.com",      product_name: "Gpilot", product_port: 2121978453, amount: 20,    status: "rejected", note: "Test First Time Reject",  requested_at: "2026-05-19T15:31:28.769000", reviewed_at: "2026-05-19T15:43:27.281000", reviewed_by: "GP-Admin-GPILOT" },
    { id: "WD-2002BB", user_id: "GP-S9T0U1", name: "Somchai Reject",      user_port: 2121000007, user_email: "somchai.reject@gmail.com",     product_name: "Gpilot", product_port: 2121978453, amount: 9999,  status: "rejected", note: "incomplete info",          requested_at: "2026-04-18T07:30:00.000000", reviewed_at: "2026-04-18T08:00:00.000000", reviewed_by: "GP-Admin-GPILOT" },
    { id: "WD-2003CC", user_id: "GP-V2W3X4", name: "Ploy Unlikely",       user_port: 2121000008, user_email: "ploy.unlikely@outlook.com",    product_name: "Gpilot", product_port: 2121978453, amount: 50000, status: "rejected", note: "exceeds approved limit",   requested_at: "2026-05-10T16:00:00.000000", reviewed_at: "2026-05-10T16:20:00.000000", reviewed_by: "GP-Admin-GPILOT" },
  ],
};
