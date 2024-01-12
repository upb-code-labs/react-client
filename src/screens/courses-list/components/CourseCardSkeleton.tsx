import { Skeleton } from "@/components/ui/skeleton";

export const CourseCardSkeleton = () => {
  return (
    <div className="mx-auto flex aspect-square w-full max-w-xs flex-col items-center justify-center gap-4 rounded-xl border p-4 shadow-md transition-shadow hover:shadow-lg">
      <Skeleton className="aspect-square w-[45%] rounded-2xl" />
      <Skeleton className="h-5 w-3/4" />
    </div>
  );
};
