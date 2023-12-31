import { Skeleton } from "../ui/skeleton";

export const EditLaboratoryPageSkeleton = () => {
  return (
    <div className="col-span-3">
      {/* Laboratory details */}
      <Skeleton className="mb-4 h-40 w-full" />

      {/* Laboratory blocks */}
      <Skeleton className="mb-4 h-96 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
};
