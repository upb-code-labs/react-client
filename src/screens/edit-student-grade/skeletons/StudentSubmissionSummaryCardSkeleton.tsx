import { Skeleton } from "@/components/ui/skeleton";

export const StudentSubmissionSummaryCardSkeleton = () => {
  return (
    <div className="flex flex-wrap justify-between gap-2 rounded-md border p-4 shadow-sm">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-24" />
        <span className="flex items-center gap-1 capitalize text-black/75">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-5 w-12" />
        </span>
      </div>
      <div className="flex items-center">
        <Skeleton className="h-10 w-10" />
      </div>
    </div>
  );
};
