import { Skeleton } from "@/components/ui/skeleton";

export const GradeSidebarSkeleton = () => {
  return (
    <div className="max-w-xs md:max-w-full">
      {/* Tabs content */}
      <div className="mx-auto max-w-xs space-y-4 md:max-w-full">
        <div className="space-y-2">
          {/* Input label */}
          <Skeleton className="h-4 w-9" />
          {/* Input */}
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          {/* Text area label */}
          <Skeleton className="h-4 w-9" />
          {/* Text area */}
          <Skeleton className="h-28 w-full" />
        </div>
      </div>
    </div>
  );
};
