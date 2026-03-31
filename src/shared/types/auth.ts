/**
 * ข้อมูลสำหรับการลงทะเบียนผู้ใช้ใหม่
 */
export interface RegistrationRequest {
  email: string;
  password: string;
  invited_by_ref_id: string; // บังคับใส่
  mt5_id: number;
  mt5_password_encrypted: string; // ต้องเข้ารหัส AES-256-GCM มาจากหน้าบ้าน
}

/**
 * ผลลัพธ์จากการลงทะเบียน
 */
export interface RegistrationResponse {
  id: string;
  email: string;
  ref_id: string;
  message: string;
}

/**
 * ข้อมูลสำหรับการเข้าสู่ระบบ
 */
export interface LoginRequest {
  username: string; // ตรงกับ email
  password: string;
}

/**
 * ผลลัพธ์จากการเข้าสู่ระบบ
 */
export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    ref_id: string;
  };
}

/**
 * สถานะของเซสชันผู้ใช้
 */
export interface UserSession {
  token: string;
  user: {
    id: string;
    email: string;
    ref_id: string;
  };
  isAuthenticated: boolean;
}
