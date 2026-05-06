"use client";

import { ErrorState } from "@/shared/ui";

export default function GpilotError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      error={error}
      reset={reset}
      title="Dashboard Error"
      message="There was an error loading the dashboard data."
    />
  );
}
