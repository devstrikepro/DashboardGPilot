import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@/shared/ui/theme-provider";
import { ApiHealthProvider } from "@/shared/providers/api-health-provider";
import { QueryProvider } from "@/shared/providers/QueryProvider";
import { AuthProvider } from "@/shared/providers/auth-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});


export const metadata: Metadata = {
  title: {
    template: "%s | GPilot",
    default: "GPilot - Advanced Trading Terminal",
  },
  description: "Advanced Trading Terminal for multi-account management and performance tracking.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${manrope.variable} antialiased`}>
        <AppRouterCacheProvider>
          <ThemeProvider>
            <AuthProvider>
              <QueryProvider>
                <ApiHealthProvider>
                  {children}
                </ApiHealthProvider>
              </QueryProvider>
            </AuthProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
