"use client";

import { ErrorState } from "@/shared/ui";
import { ThemeProvider } from "@/shared/ui/theme-provider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider>
            <ErrorState
              error={error}
              reset={reset}
              title="Critical Error"
              message="A critical error occurred in the application shell."
            />
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
