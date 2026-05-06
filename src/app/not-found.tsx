"use client";

import { ErrorState } from "@/shared/ui";

export default function NotFound() {
  return (
    <ErrorState
      title="404 - Page Not Found"
      message="The page you are looking for does not exist or has been moved."
    />
  );
}
