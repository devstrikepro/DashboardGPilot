"use client";

import { createContext, useContext, useState, useMemo, useEffect, useCallback } from "react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider as MUIThemeProvider, PaletteMode } from "@mui/material/styles";
import { getTheme } from "@/shared/config/theme";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/en-gb";

interface ThemeContextType {
  mode: PaletteMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: "dark",
  toggleTheme: () => {},
});

export const useThemeMode = () => useContext(ThemeContext);

export function ThemeProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [mode, setMode] = useState<PaletteMode>("dark");

  useEffect(() => {
    const savedMode = localStorage.getItem("theme-mode") as PaletteMode | null;
    if (savedMode && (savedMode === "dark" || savedMode === "light")) {
      setMode(savedMode);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setMode((prevMode) => {
      const newMode = prevMode === "dark" ? "light" : "dark";
      localStorage.setItem("theme-mode", newMode);
      return newMode;
    });
  }, []);

  const theme = useMemo(() => getTheme(mode), [mode]);

  const contextValue = useMemo(() => ({ mode, toggleTheme }), [mode, toggleTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <MUIThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
          <CssBaseline />
          {children}
        </LocalizationProvider>
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
}
