"use client";

import { Box, Skeleton, Container, Stack } from "@mui/material";

export function LoadingState() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={4}>
        {/* Header Skeleton */}
        <Box>
          <Skeleton variant="text" width={200} height={40} sx={{ mb: 1 }} />
          <Skeleton variant="text" width={300} height={24} />
        </Box>

        {/* Top Cards Skeleton */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr 1fr",
            },
            gap: 3,
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={140}
              sx={{ borderRadius: 2 }}
            />
          ))}
        </Box>

        {/* Main Content Skeleton */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
            gap: 3,
          }}
        >
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
          <Stack spacing={3}>
            <Skeleton variant="rectangular" height={190} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rectangular" height={190} sx={{ borderRadius: 2 }} />
          </Stack>
        </Box>

        {/* Table Skeleton */}
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
      </Stack>
    </Container>
  );
}
