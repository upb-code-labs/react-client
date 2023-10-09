import { Skeleton } from "@/components/ui/skeleton";

export const CourseNavigationSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-square w-24 rounded-2xl" />
      <Skeleton className="h-6 w-3/4" />
    </div>
  );
};
