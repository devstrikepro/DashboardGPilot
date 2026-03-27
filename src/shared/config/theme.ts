"use client";

import { createTheme, PaletteMode } from "@mui/material/styles";

export const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === "dark"
        ? {
            primary: {
              main: "#22D3EE",
              light: "#67E8F9",
              dark: "#0891B2",
            },
            secondary: {
              main: "#A78BFA",
              light: "#C4B5FD",
              dark: "#7C3AED",
            },
            success: {
              main: "#10B981",
              light: "#34D399",
              dark: "#059669",
            },
            error: {
              main: "#EF4444",
              light: "#F87171",
              dark: "#DC2626",
            },
            warning: {
              main: "#F59E0B",
              light: "#FBBF24",
              dark: "#D97706",
            },
            background: {
              default: "#0F172A",
              paper: "rgba(30, 41, 59, 0.7)",
            },
            text: {
              primary: "#F8FAFC",
              secondary: "#94A3B8",
            },
            divider: "rgba(148, 163, 184, 0.12)",
          }
        : {
            primary: {
              main: "#0891B2",
              light: "#22D3EE",
              dark: "#0E7490",
            },
            secondary: {
              main: "#7C3AED",
              light: "#A78BFA",
              dark: "#6D28D9",
            },
            success: {
              main: "#059669",
              light: "#10B981",
              dark: "#047857",
            },
            error: {
              main: "#DC2626",
              light: "#EF4444",
              dark: "#B91C1C",
            },
            warning: {
              main: "#D97706",
              light: "#F59E0B",
              dark: "#B45309",
            },
            background: {
              default: "#F8FAFC",
              paper: "#FFFFFF",
            },
            text: {
              primary: "#0F172A",
              secondary: "#64748B",
            },
            divider: "rgba(15, 23, 42, 0.08)",
          }),
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontFamily: '"Manrope", "Inter", sans-serif',
        fontWeight: 700,
      },
      h2: {
        fontFamily: '"Manrope", "Inter", sans-serif',
        fontWeight: 700,
      },
      h3: {
        fontFamily: '"Manrope", "Inter", sans-serif',
        fontWeight: 600,
      },
      h4: {
        fontFamily: '"Manrope", "Inter", sans-serif',
        fontWeight: 600,
      },
      h5: {
        fontFamily: '"Manrope", "Inter", sans-serif',
        fontWeight: 600,
      },
      h6: {
        fontFamily: '"Manrope", "Inter", sans-serif',
        fontWeight: 600,
      },
      body1: {
        fontFamily: '"Inter", sans-serif',
        fontSize: "0.875rem",
      },
      body2: {
        fontFamily: '"Inter", sans-serif',
        fontSize: "0.75rem",
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: mode === "dark" ? "#0F172A" : "#F8FAFC",
            backgroundImage:
              mode === "dark"
                ? "radial-gradient(ellipse at top, #1E293B 0%, #0F172A 50%)"
                : "radial-gradient(ellipse at top, #E2E8F0 0%, #F8FAFC 50%)",
            minHeight: "100vh",
            transition: "background-color 0.3s ease, background-image 0.3s ease",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: mode === "dark" ? "rgba(30, 41, 59, 0.7)" : "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(12px)",
            border:
              mode === "dark"
                ? "1px solid rgba(148, 163, 184, 0.1)"
                : "1px solid rgba(15, 23, 42, 0.08)",
            transition: "background-color 0.3s ease, border-color 0.3s ease",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: mode === "dark" ? "rgba(30, 41, 59, 0.7)" : "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(12px)",
            border:
              mode === "dark"
                ? "1px solid rgba(148, 163, 184, 0.1)"
                : "1px solid rgba(15, 23, 42, 0.08)",
            transition: "background-color 0.3s ease, border-color 0.3s ease",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 500,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 500,
          },
        },
      },
    },
  });

export const darkTheme = getTheme("dark");
export const lightTheme = getTheme("light");
