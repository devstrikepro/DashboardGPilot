"use client";

import * as React from "react";
import { Snackbar, Alert, AlertTitle } from "@mui/material";

export interface ToastProps {
  id?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: "default" | "destructive" | "success" | "warning";
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

export type ToastActionElement = React.ReactNode;

export function Toast({
  open,
  onOpenChange,
  variant = "default",
  title,
  description,
  // action, // MUI Alert standard is 'action' but handled via snackbar
}: Readonly<ToastProps>) {
  const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    onOpenChange?.(false);
  };

  const severity = variant === "destructive" ? "error" : variant === "default" ? "info" : variant;

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        onClose={handleClose}
        severity={severity as any}
        variant="filled"
        sx={{ width: "100%", boxShadow: 3 }}
      >
        {title && <AlertTitle sx={{ fontWeight: 700 }}>{title}</AlertTitle>}
        {description}
      </Alert>
    </Snackbar>
  );
}
