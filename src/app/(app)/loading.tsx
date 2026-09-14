import { Skeleton, SkeletonRows } from "@/components/ui";

export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-4 w-96 max-w-full" />
      <SkeletonRows rows={4} columns={3} />
    </div>
  );
}