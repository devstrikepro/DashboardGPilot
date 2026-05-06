"use client";

import { Box, Button, Typography, Container, Stack, Paper } from "@mui/material";
import { WarningAmberRounded, RefreshRounded, HomeRounded } from "@mui/icons-material";
import Link from "next/link";

interface ErrorStateProps {
  error?: Error & { digest?: string };
  reset?: () => void;
  title?: string;
  message?: string;
}

export function ErrorState({
  error,
  reset,
  title = "Something went wrong!",
  message = "An unexpected error occurred while loading this page.",
}: ErrorStateProps) {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Stack spacing={3} alignItems="center">
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: "error.lighter",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "error.main",
              }}
            >
              <WarningAmberRounded sx={{ fontSize: 48 }} />
            </Box>

            <Box>
              <Typography variant="h4" gutterBottom fontWeight="bold">
                {title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {error?.message || message}
              </Typography>
              {error?.digest && (
                <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: "block" }}>
                  Error ID: {error.digest}
                </Typography>
              )}
            </Box>

            <Stack direction="row" spacing={2} justifyContent="center">
              {reset && (
                <Button
                  variant="contained"
                  startIcon={<RefreshRounded />}
                  onClick={reset}
                  size="large"
                >
                  Try again
                </Button>
              )}
              <Button
                variant="outlined"
                component={Link}
                href="/"
                startIcon={<HomeRounded />}
                size="large"
              >
                Back to Home
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
}
