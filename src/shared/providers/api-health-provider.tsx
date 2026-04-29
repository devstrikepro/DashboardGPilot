"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { HealthService } from "@/shared/services/health-service";
import { logger } from "@/shared/utils/logger";

interface ApiHealthContextType {
  isHealthy: boolean;
  isChecking: boolean;
  lastChecked: Date | null;
  checkHealth: () => Promise<void>;
}

const ApiHealthContext = createContext<ApiHealthContextType | undefined>(undefined);

interface ApiHealthProviderProps {
  readonly children: React.ReactNode;
}

export function ApiHealthProvider({ children }: ApiHealthProviderProps) {
  const [isHealthy, setIsHealthy] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const pathname = usePathname();

  const IS_MOCK_MODE = process.env.NEXT_PUBLIC_IS_MOCK_MODE === "True" || process.env.NEXT_PUBLIC_IS_MOCK_MODE === "true";

  // Mock Auth Initialization
  useEffect(() => {
    if (IS_MOCK_MODE) {
      if (typeof window !== "undefined") {
        if (!localStorage.getItem("auth_token")) {
          localStorage.setItem("auth_token", "dev-mock-token");
          logger.info("Mock Auth Token initialized in localStorage");
        }
        // ตรวจสอบคุกกี้ด้วยเพื่อให้ Middleware ทำงานได้ถูกต้อง
        if (!document.cookie.includes("auth_token")) {
          document.cookie = "auth_token=dev-mock-token; path=/; max-age=86400";
        }
      }
    }
  }, [IS_MOCK_MODE]);

  const checkHealth = useCallback(async () => {
    setIsChecking(true);
    try {
      const res = await HealthService.checkHealth();
      // ในโหมด Mock ให้ถือว่า Healthy เสมอเพื่อให้ UI ไม่ค้าง
      setIsHealthy(IS_MOCK_MODE ? true : (res.success && res.data.status === "ok"));
    } catch (err) {
      logger.error("API Health check failed unexpectedly in provider", err instanceof Error ? err : String(err));
      setIsHealthy(IS_MOCK_MODE); // ถ้าโหมด Mock ให้เป็น True
    } finally {
      setIsChecking(false);
      setLastChecked(new Date());
    }
  }, [IS_MOCK_MODE]);

  // ยิง Health Check ทุกครั้งที่เปลี่ยนหน้าจอ (ยกเว้นหน้า ROR)
  useEffect(() => {
    if (pathname?.includes("record-of-ragnarok")) return;
    checkHealth();
  }, [pathname, checkHealth]);

  const apiHealthValue = React.useMemo(
    () => ({
      isHealthy,
      isChecking,
      lastChecked,
      checkHealth,
    }),
    [isHealthy, isChecking, lastChecked, checkHealth]
  );

  return (
    <ApiHealthContext.Provider value={apiHealthValue}>
      {children}
    </ApiHealthContext.Provider>
  );
}

export function useApiHealth() {
  const context = useContext(ApiHealthContext);
  if (context === undefined) {
    throw new Error("useApiHealth must be used within an ApiHealthProvider");
  }
  return context;
}
