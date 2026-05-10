/**
 * ข้อมูลสำหรับการลงทะเบียนผู้ใช้ใหม่
 */
export interface RegistrationRequest {
  email: string;
  mt5_id: number;
  mt5_password_encrypted: string;
}

/**
 * ผลลัพธ์จากการลงทะเบียน
 */
export interface RegistrationResponse {
  id: string;
  email: string;
  defaultPassword?: string;
}

/**
 * ข้อมูลสำหรับการเข้าสู่ระบบ
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * ผลลัพธ์จากการเข้าสู่ระบบ
 */
export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    role_id: string;
    require_password_change?: boolean;
    menu: {
      dashboard: string[];
      setting: {
        masterAdmin: boolean;
        Admin: boolean;
      } | null;
    };
  };
}

/**
 * สถานะของเซสชันผู้ใช้
 */
export interface UserSession {
  token: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    role: string;
    require_password_change?: boolean;
    menu: {
      dashboard: string[];
      setting: {
        masterAdmin: boolean;
        Admin: boolean;
      } | null;
    };
  };
  isAuthenticated: boolean;
}
