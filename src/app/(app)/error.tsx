"use client";

import { Button, ErrorState } from "@/components/ui";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 py-10">
      <ErrorState
        title="Something went wrong"
        description={error.message || "An unexpected error occurred while rendering this page."}
        retry={
          <Button variant="danger" onClick={reset}>
            Try again
          </Button>
        }
      />
    </div>
  );
}