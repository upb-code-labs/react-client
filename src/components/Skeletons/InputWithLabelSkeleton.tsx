import { Skeleton } from "../ui/skeleton";

export const InputWithLabelSkeleton = () => {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
};
