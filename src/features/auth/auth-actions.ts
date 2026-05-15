"use server";

import { cookies } from "next/headers";
import { apiServer, isRedirectError } from "@/shared/api/api-server";
import { SUB_ENDPOINTS, API_GATEWAY_SUB } from "@/shared/api/endpoint";
import { ApiError } from "@/shared/api/api-error";
import type { LoginRequest, LoginResponse } from "@/shared/types/auth";
import type { ServiceResponse } from "@/shared/types/api";

/**
 * loginAction
 * Server Action สำหรับการ Login
 */
export async function loginAction(data: LoginRequest): Promise<ServiceResponse<LoginResponse>> {
  try {
    const response = await apiServer<ServiceResponse<LoginResponse>>(
      SUB_ENDPOINTS.AUTH_LOGIN,
      {
        method: "POST",
        body: JSON.stringify(data),
        cache: "no-store",
      },
      undefined,
      API_GATEWAY_SUB
    );

    if (response.success && response.data) {
      const { access_token, refresh_token } = response.data;
      const cookieStore = await cookies();

      // บันทึก Token ลงใน Cookie ฝั่ง Server
      cookieStore.set("auth_token", access_token, {
        path: "/",
        maxAge: 86400, // 1 day
        httpOnly: true, // เพิ่มความปลอดภัย
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      if (refresh_token) {
        cookieStore.set("refresh_token", refresh_token, {
          path: "/",
          maxAge: 604800, // 7 days
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
      }
    }

    return response;
  } catch (error) {
    // ถ้าเป็น Redirect Error จาก Next.js ให้ปล่อยไปเพื่อให้ Framework จัดการ
    if (isRedirectError(error)) {
      throw error;
    }

    // จัดการ ApiError เพื่อดึงข้อมูล Error ที่ถูกต้อง
    if (error instanceof ApiError) {
      // กรณี 401 คือกรอกรหัสผ่านผิด
      if (error.statusCode === 401) {
        return {
          success: false,
          data: null,
          error: {
            code: "AUTH_001",
            message: "Incorrect email or password",
          },
        };
      }

      return {
        success: false,
        data: null,
        error: {
          code: (error.details?.error?.code || error.details?.code || "LOGIN_ERROR") as string,
          message: error.message,
        },
      };
    }

    return {
      success: false,
      data: null,
      error: {
        code: "LOGIN_ERROR",
        message: error instanceof Error ? error.message : "การเชื่อมต่อล้มเหลว",
      },
    };
  }
}

/**
 * logoutAction
 * Server Action สำหรับการ Logout
 */
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  cookieStore.delete("refresh_token");
}
