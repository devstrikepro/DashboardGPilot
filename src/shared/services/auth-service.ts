import { apiClient } from '@/shared/api/client';
import { SUB_ENDPOINTS } from '@/shared/api/endpoint';
import { CryptoUtils } from '@/shared/utils/crypto';
import type { 
  RegistrationRequest, 
  RegistrationResponse, 
  LoginRequest, 
  LoginResponse 
} from '@/shared/types/auth';

/**
 * AuthService สำหรับจัดการสมาชิกผ่าน Backend-Sub
 */
export class AuthService {
  /**
   * ลงทะเบียนผู้ใช้ใหม่ (พร้อมเข้ารหัสรหัสผ่าน MT5)
   */
  static async register(data: Omit<RegistrationRequest, 'mt5_password_encrypted'> & { mt5_password_plain: string }): Promise<RegistrationResponse> {
    // 1. ดึง Encryption Key จาก Environment
    const encryptionKey = process.env.NEXT_PUBLIC_MT5_ENCRYPTION_KEY || '';
    if (!encryptionKey) {
      throw new Error('Encryption key not configured');
    }

    // 2. เข้ารหัสรหัสผ่าน MT5 ด้วย AES-256-GCM
    const encryptedPassword = await CryptoUtils.encrypt(data.mt5_password_plain, encryptionKey);

    // 3. เตรียมข้อมูลส่งให้ Backend-Sub
    const requestData: RegistrationRequest = {
      email: data.email,
      password: data.password,
      invited_by_ref_id: data.invited_by_ref_id,
      mt5_id: data.mt5_id,
      mt5_password_encrypted: encryptedPassword
    };

    // 4. ส่งข้อมูลผ่าน Gateway Proxy
    return apiClient<RegistrationResponse>(SUB_ENDPOINTS.AUTH_REGISTER, {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  /**
   * เข้าสู่ระบบ (คืนค่า Token และข้อมูลผู้ใช้)
   */
  static async login(data: LoginRequest): Promise<LoginResponse> {
    // Backend-Sub ใช้ OAuth2 Password Request Form (Form Data)
    const formData = new URLSearchParams();
    formData.append('username', data.username);
    formData.set('password', data.password);

    return apiClient<LoginResponse>(SUB_ENDPOINTS.AUTH_LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
  }
}
