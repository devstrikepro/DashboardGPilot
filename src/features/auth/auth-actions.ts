"use server";

import { cookies } from "next/headers";
import { apiServer } from "@/shared/api/api-server";
import { SUB_ENDPOINTS, API_GATEWAY_SUB } from "@/shared/api/endpoint";
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
